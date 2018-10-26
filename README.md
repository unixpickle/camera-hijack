# camera-hijack

This is an experiment to use a chrome extension to mess with the input of the webcam.

# Examples

Identity function:

```js
function(canvas, video) {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
}
```

Make the camera spin around like crazy:

```js
function(canvas, video) {
    window.HACKS_ANGLE = ((window.HACKS_ANGLE || 0) + 0.1) % (Math.PI * 2);
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(window.HACKS_ANGLE);
    ctx.drawImage(video, -canvas.width / 2, -canvas.height / 2);
    ctx.restore();
}
```
