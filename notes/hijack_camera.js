const oldGetMedia = navigator.mediaDevices.getUserMedia;

function fakeGetUserMedia(options) {
    return oldGetMedia.call(navigator.mediaDevices, options).then((stream) => {
        const track = stream.getVideoTracks()[0];
        if (!track) {
            return stream;
        }

        const newStream = new MediaStream();
        stream.getAudioTracks().forEach((track) => newStream.addTrack(track));

        const canvas = document.createElement('canvas');
        const video = document.createElement('video');
        video.setAttribute('autoplay', true);
        video.srcObject = stream;
        const settings = track.getSettings();
        canvas.width = settings.width;
        canvas.height = settings.height;

        drawFn = () => {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            ctx.fillRect(100, 100, 50, 50);
        };
        drawFn();
        const interval = setInterval(drawFn, 1000 / settings.frameRate);

        const newTrack = canvas.captureStream(track.frameRate).getVideoTracks()[0];
        const oldStop = newTrack.stop;
        newTrack.stop = function () {
            clearInterval(interval);
            stream.getVideoTracks().forEach((track) => track.stop());
            oldStop.call(this);
        };
        newStream.addTrack(newTrack);

        return newStream;
    }).catch((x) => console.log(x));
}

navigator.getUserMedia = fakeGetUserMedia;
navigator.webkitGetUserMedia = fakeGetUserMedia;
navigator.mediaDevices.getUserMedia = fakeGetUserMedia;