# Clip Swap

Pick a video and a photo, and Clip Swap puts the character from the photo into the video in place of the person, keeping the original motion, background and lighting. It runs on Wan 2.2 Animate Replace, hosted by fal.ai and billed to your own fal account.

## Get it

**Web app:** [ryangstott.github.io/clip-swap](https://ryangstott.github.io/clip-swap/). Open it in Chrome on Android and choose *Install app* (or *Add to Home screen*). On iPhone, open it in Safari, tap Share, then *Add to Home Screen*.

The first time, tap **Add API key** and paste a key from [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys). The key is stored on that device only.

Every push to `main` republishes the `web/` folder (see `.github/workflows/pages.yml`).

## Modes

- **Swap into video** (`fal-ai/wan/v2.2-14b/animate/replace`): keeps the video's scene; your character replaces the person.
- **Animate photo** (`fal-ai/wan/v2.2-14b/animate/move`): keeps the photo's scene; your character copies the video's motion.

## Cost

fal bills per output frame, at 16 frames per billed second: about US$0.04 (480p), $0.06 (580p) or $0.08 (720p) per billed second. A 10-second 30 fps clip at 480p is roughly US$0.75.

## Layout

| Path | What it is |
| --- | --- |
| `web/index.html` | The whole app |
| `web/sw.js`, `web/manifest.webmanifest` | Home-screen install and fast loading |
| `web/icons/` | App icons |
