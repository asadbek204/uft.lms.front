import {useEffect, useRef, FC} from "react";

type VideoComponentProps = {
    videoData: string;
    videoClass: string;
};

const VideoComponent: FC<VideoComponentProps> = ({ videoData, videoClass }) => {
    const videoRef = useRef(null);

    const handleSeek = (time: number) => {
        console.log('hanlsseek')
        if (videoRef.current) {
            (videoRef.current as HTMLVideoElement).currentTime = time; // Setting the currentTime property to seek
        }
    };

    useEffect(() => {
        if (!videoRef.current) {
            return
        }

        const videoElement = videoRef.current as HTMLVideoElement;
        const onMetadataLoaded = () => {
            // Seek to 10 seconds after metadata is loaded
            handleSeek(10);
        };

        if (videoElement) {
            videoElement.addEventListener('loadedmetadata', onMetadataLoaded);
        }
        console.log('hanlsseek22222')

        // Cleanup event listener
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('loadedmetadata', onMetadataLoaded);
            }
        };

    }, []); // Empty dependency array to run only once

    return (
        <>
            <video className={videoClass} width={'100%'} ref={videoRef} controls preload="auto">
                <source src={videoData} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
        </>
    );
}


export default VideoComponent;
