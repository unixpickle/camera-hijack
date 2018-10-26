if (typeof window.INJECTION_DRAW_FN === 'undefined') {
    window.INJECTION_DRAW_FN = (canvas, video) => canvas.getContext('2d').drawImage(video, 0, 0);
}

(function () {

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

            drawFn = () => INJECTION_DRAW_FN(canvas, video);
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
        });
    }

    navigator.getUserMedia = () => console.warn('deprecated method');
    navigator.webkitGetUserMedia = () => console.warn('deprecated method');
    navigator.mediaDevices.getUserMedia = fakeGetUserMedia;

})();