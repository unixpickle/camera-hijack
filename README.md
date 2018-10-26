# camera-hijack

This is a chrome extension that allows you to manipulate the images that webpages read from your webcam. Notably, you can use it to manipulate your camera feed on video chats. The extension gives you as much freedom as possible, by letting you provide a piece of JS code that draws each frame.

![Screenshot of the extension](screenshot.png)

# Installation

 * Go to `chrome://extensions`.
 * Enable developer mode (should be a switch in the top-right corner).
 * Click `Load Unpacked`
 * Select the `plugin` directory in this repository.
 * This should add a button for the extension to the menu bar.

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
