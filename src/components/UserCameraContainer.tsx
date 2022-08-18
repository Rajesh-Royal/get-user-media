import { useEffect, useRef, useState } from "react";

const facingMode = "user";
const constraints = {
    audio: false,
    video: {
        facingMode: facingMode
    }
};
const UserCameraContainer = () => {
    const [startStream, setStartStream] = useState(false);
    const userStreamRef = useRef<HTMLVideoElement>(null);
    const [cameraPermissions, setCameraPermissions] = useState(false);

    const getUserCameraStream = () => {
        /* Stream it to video element */
        navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
            if (userStreamRef.current) {
                let video = userStreamRef.current;
                video.srcObject = stream;
                video.play();
            }
        }).catch((error) => {
            // todo - show correct error msg to user.
            // error on permission denied - DOMException: Permission denied
            setCameraPermissions(true);
        })
    }
    const stopUserCameraStream = () => {
        if (userStreamRef.current?.srcObject) {
            const mediaStream = userStreamRef.current.srcObject;

            const tracks = (mediaStream as MediaStream).getTracks();

            (tracks as MediaStreamTrack[])[0].stop();
        }
    }
    useEffect(() => {
        if (startStream) {
            getUserCameraStream();
        }
    }, [userStreamRef, startStream])
    return (
        <div>
            {!startStream ?
                <button onClick={() => setStartStream((prev) => !prev)}>Start web camera</button>
                : <button onClick={() => {
                    stopUserCameraStream();
                    setStartStream((prev) => !prev)
                }}>Stop web camera</button>
            }
            {startStream ? <video src={""} ref={userStreamRef} style={{ width: 400, height: 400 }}></video> : null}
            {cameraPermissions ? <p>Please allow camera permissions</p> : null}
        </div>
    )
}

export default UserCameraContainer