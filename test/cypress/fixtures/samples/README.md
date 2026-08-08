# Synthetic media fixtures

Every tracked audio/video byte in this directory is generated locally. No
external footage, audio, artwork, or subtitles are used.

| File | Test intent | Expected streams | Nominal duration |
| --- | --- | --- | --- |
| `synthetic-container.avi` | Exercise the unsupported-AVI player path and torrent upload/seeding path | MPEG-4 Part 2 video, MP3 audio | 2 seconds |
| `synthetic-upload.mp4` | Exercise MP4 file selection/upload | H.264 video, AAC audio | 2 seconds |
| `synthetic-subtitles.mkv` | Exercise playable MKV input with an embedded subtitle track | H.264 video, AAC audio, SubRip subtitle | 2 seconds |
| `synthetic-hevc-main10-hdr.mkv` | Preserve the high-spec desktop decode path without third-party footage | 3840×2160 HEVC Main10, BT.2020/PQ metadata, DTS core, AC-3, SubRip | 1 second |

## Regeneration and verification

Run:

```sh
./test/cypress/fixtures/samples/generate-synthetic-media.sh
```

The script requires `ffmpeg` and `ffprobe`, creates its inputs with the FFmpeg
`testsrc2` and `sine` lavfi sources, and defines the short subtitle text inline.
It validates all three containers plus the embedded subtitle codec, language,
title, and text before replacing the tracked fixtures. Re-running it with the
same FFmpeg build produces byte-identical files.

## Provenance and legacy audit

- Video source: FFmpeg `testsrc2` lavfi generator.
- Audio source: FFmpeg `sine` lavfi generator.
- Subtitle source: two project-specific ASCII cues declared in the generator.
- Generated locally on 2026-08-29; no network or third-party media input.
- The generator, inline subtitle text, and generated binary fixtures are
  distributed under the GNU GPL v2 terms in the repository's root `LICENSE`.

The 2026-08-29 audit removed four previously tracked third-party-looking video
samples that had no redistribution evidence. It also removed one MKV and one
SRT sample that had no references anywhere in the repository and were redundant
with the generated embedded-subtitle fixture. `test.abk` is not a media file and
was left unchanged.
