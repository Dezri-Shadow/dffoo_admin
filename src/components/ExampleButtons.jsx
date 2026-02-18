import { useEffect, useRef, useState } from "react";
import { connect, subscribe, request } from "../services/socket";

export default function ExampleButtons() {
    const [progress, setProgress] = useState("");

    const [status, setStatus] = useState("");

    const [time, setTime] = useState("");

    const jobs = useRef(new Map());

    useEffect(() => {
        connect();

        const unsubProgress = subscribe("jobProgress", (data) => {
            const job = jobs.current.get(data.payload.jobId);

            if (job) {
                // pass off happens here
                job.onProgress(data.payload);
            };
        });

        const unsubComplete = subscribe("jobComplete", (data) => {
            const job = jobs.current.get(data.payload.jobId);

            if (job) {
                // pass off happens here
                job.onComplete(data.payload);
            };
        });

        return () => {
            unsubProgress();
            unsubComplete();
        };
    }, []);
    // multi-reponse test
    async function startBigProcess() {
        try {
            const res = await request("startProcess");

            const jobId = res.payload.jobId;

            setStatus(res.payload.status);

            jobs.current.set(jobId, {
                onProgress: (payload) => {
                    // processing happens here
                    setProgress(payload.progress);
                    setStatus(payload.status);
                },
                onComplete: (payload) => {
                    // processing happens here
                    setProgress(payload.progress);
                    setStatus(payload.status);
                    jobs.current.delete(jobId);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    // single reponse test
    async function getTime() {
        const res = await request("timeRequest");

        setTime(res.payload.time);
    };

    return (
        <div style={{ margin: "auto", textAlign: "center" }}>
            <br />
            <button type="button" onClick={getTime}>Get Time</button>
            <br />
            {time}
            <br />
            <button type="button" onClick={startBigProcess}>Run Process Test</button>
            <br />
            {progress != "" ? `${progress}% - ${status}` : ""}
        </div>
    );
}