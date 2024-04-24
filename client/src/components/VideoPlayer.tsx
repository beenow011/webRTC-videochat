import { useEffect, useRef } from "react"

export const VideoPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream && videoRef) videoRef.current.srcObject = stream;
    }, [stream])
    // console.log("viedo ref", videoRef)
    return (
        <video ref={videoRef} autoPlay muted={true} />


    )
}