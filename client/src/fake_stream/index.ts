export async function simulateWebcamStream(videoSource : string = './fake_video.mp4'): Promise<MediaStream | null> {
    // Create a video element
    const videoElement = document.createElement('video');

    // Load the video source
    videoElement.src = videoSource;

    // Wait for the video to load
    await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => resolve();
        videoElement.onerror = (error) => reject(error);
    });

    // Check if the video loaded successfully
    if (videoElement.readyState >= HTMLMediaElement.HAVE_METADATA) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to create canvas context');
            return null;
        }

        // Set canvas dimensions to match video
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Draw the video frames onto the canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Capture the canvas as a stream
        const stream = canvas.captureStream();

        return stream;
    } else {
        console.error('Failed to load the recorded video');
        return null;
    }
}


export  const videoPath = 'fake_video.mp4'

