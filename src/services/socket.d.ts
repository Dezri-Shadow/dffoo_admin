/**
 * Increasing unique number for tracking requests and returns
 */
type id = number;
/**
 * Basic message types
 */
type typeMsg = "log"|"error"|"response"|"command"|"jobStarted"|"jobProgress"|"jobComplete";
/**
 * Basic request and response
 */
type wsMsg<typeMsg, Payload> = {type: typeMsg, id: id, payload: Payload };
type logPayload = {text: string, html: string};
/**
 * Log message
 */
type logMsg = wsMsg<"log", logPayload>;
type errorPayload = {message: string} ;
/**
 * Error message
 */
type errorMsg = wsMsg<"error", errorPayload>;
type commandPayload = {command: string, data?: any};
/**
 * Command message
 */
type commandMsg = wsMsg<"command", commandPayload>;
/**
 * Response message for single return commands (depends on command request)
 */
type responseMsg = wsMsg<"response", any>;
type jobStatus = "start"|"running"|"error"|"complete";
/**
 * progress is % of 100
 */
type jobProgressPayload = {status: jobStatus, progress: number};
/**
 * jobStarted message
 */
type jobStartedMsg = wsMsg<"jobStarted", jobProgressPayload>;
/**
 * jobProgress message
 */
type jobStartedMsg = wsMsg<"jobProgress", jobProgressPayload>;
/**
 * jobComplete message
 */
type jobCompleteMsg = wsMsg<"jobComplete", jobProgressPayload>;
