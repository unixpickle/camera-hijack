if (typeof window.INJECTION_DRAW_FN === 'undefined') {
    window.INJECTION_DRAW_FN = (canvas, video) => canvas.getContext('2d').drawImage(video, 0, 0);
}

(function () {

    function hijackStream(stream) {
        const track = stream.getVideoTracks()[0];
        if (!track) {
            return stream;
        }

        const newStream = new MediaStream();
        stream.getAudioTracks().forEach((track) => newStream.addTrack(track));

        // Prevent the video object from playing an extra copy of
        // the audio, thus causing echo+feedback.
        stream.getAudioTracks().forEach((track) => stream.removeTrack(track));

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
    }

    if (navigator.getUserMedia) {
        const oldDeprecatedMethod = navigator.getUserMedia;
        navigator.getUserMedia = (constraints, successCb, errorCb) => {
            oldDeprecatedMethod.call(navigator, constraints, (stream) => {
                if (successCb) {
                    successCb(hijackStream(stream));
                }
            }, errorCb);
        };
        navigator.webkitGetUserMedia = navigator.getUserMedia;
    }

    const oldMethod = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = (options) => {
        return oldMethod.call(navigator.mediaDevices, options).then(hijackStream);
    };

})();