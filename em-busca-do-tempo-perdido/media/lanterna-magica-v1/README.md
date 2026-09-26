# A lanterna mágica — study I

A 12-second, silent, looping interpretation of the bedroom lantern passage in
[Proust's Swann's Way](https://www.gutenberg.org/files/7178/7178-h/7178-h.htm).
Golo's red cloak travels toward Geneviève's golden castle; the projected image
flickers and bends over the room's door, knob, and curtain.

## Preview

Open `index.html` through the site's local HTTP server and select **Reproduzir a projeção**.
Download `lanterna-magica.mp4` for standalone playback: H.264, 1280 × 720,
24 fps, 12 seconds, no audio. `poster.jpg` is a still at six seconds.

The three source PNGs were generated with the built-in image generation tool.
The [complete generation prompts](PROMPTS.md) are retained beside them.
This is generated artwork animated and composited using FFmpeg, rather than a
native text-to-video generation or an exact historical reconstruction.

## Reproduce

With Python 3 and FFmpeg available:

```sh
python3 em-busca-do-tempo-perdido/media/lanterna-magica-v1/render.py
```

The renderer rebuilds the MP4 and poster from the three source PNGs.
The preview draws decoded video frames to a canvas for reliable Safari display,
starts only on request, and offers a keyboard-accessible play/pause button.

## Verification and integration

Verified the full MP4 decodes without errors; checked frame samples across the
loop and played the canvas preview in Safari. The scene uses simple slide motion;
the horse's legs are not articulated.

This study is embedded in the reading page through the project's Org note
(ID `5B137E92-A79C-46BF-9A35-05FAD1D52545`). The standalone preview remains available.
