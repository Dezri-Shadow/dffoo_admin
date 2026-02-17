//@ts-check
/**
 * @type {WebSocket?}
 */
let socket;
const listeners = new Map();
const pending = new Map();
let requestId = 0;

/**
 * Creates connection to server. Must be at start of `useEffect` in any componets. 
 * 
 * @example
 * ```js
 * useEffect(() => {
 *      connect();
 *      // Code for requests or subscribes here
 *  }, []);
 * ```
 * @returns {WebSocket}
 */
export function connect() {
    if (socket) {
        return socket;
    };

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onmessage = (event) => {
        /**
         * @type {wsMsg<typeMsg, any>}
         */
        const msg = JSON.parse(event.data);

        if ( msg.type === "response" ||
             msg.type === "error" ||
             msg.type === "jobComplete"
        ) {
            const resolver = pending.get(msg.id);

            if (resolver) {
                resolver(msg.payload);

                pending.delete(msg.id);
            }

            return;
        }

        const subs = listeners.get(msg.type);

        if (subs) {
            subs.forEach(/**@type {(value: any) => void}*/fn => fn(msg.payload));
        }
    };

    socket.onerror = () => {
        console.error("WebSocket error");

        socket = null;
    };

    return socket;
};

/**
 * Get all messages of a type
 * 
 * @example
 * ```js
 * useEffect(() => {
 *      connect();
 *      
 *      const unsub = subscribe("log", (data) => {
 *          setTextLogs((prev) => [...prev, data.text]);
 * 
 *          setLogs((prev) => [
 *              ...prev,
 *              {
 *                  id: idRef.current++,
 *                  html: data.html,
 *              },
 *          ]);
 *      });
 * 
 *      return unsub;
 *  }, []);
 * ```
 * @param {typeMsg} type Message type
 * @param {(data: wsMsg<typeMsg, any>["payload"]) => void} handler payload return
 * @returns {() => void}
 */
export function subscribe(type, handler) {
    if (!listeners.has(type)) {
        listeners.set(type, new Set());
    }

    listeners.get(type).add(handler);

    return () => {
        listeners.get(type).delete(handler);
    };
};

/**
 * Make a single request / response to the server.
 * 
 * @async
 * @example
 * ```js
 *  const getTime = async () => {
 *     const res = await request("timeRequest");
 * 
 *     console.log(res);
 * };
 * ```
 * @param {string} command command
 * @param {any?} data Message data
 * @returns {Promise<responseMsg["payload"]>} return payload
 */
export function request(command, data = "") {
    return new Promise((resolve) => {
        if(!socket){
            console.error("WebSocket request made before connection was started.");

            resolve({message:"Error"});
        }

        const id = requestId++;

        pending.set(id, resolve);

        socket?.send(JSON.stringify({
            type: "command",
            id: id,
            payload: {
                command: command,
                data: data
            }
        }));
    });
};
