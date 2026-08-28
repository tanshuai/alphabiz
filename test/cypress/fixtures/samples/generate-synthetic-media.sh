#!/usr/bin/env bash

set -euo pipefail

fixture_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

for required_tool in ffmpeg ffprobe; do
  if ! command -v "$required_tool" >/dev/null 2>&1; then
    echo "Missing required tool: $required_tool" >&2
    exit 1
  fi
done

temporary_dir=$(mktemp -d "${TMPDIR:-/tmp}/alphabiz-synthetic-media.XXXXXX")
trap 'rm -rf -- "$temporary_dir"' EXIT

subtitle_source="$temporary_dir/synthetic-subtitles.srt"
printf '%s\n' \
  '1' \
  '00:00:00,200 --> 00:00:01,000' \
  'ALPHABIZ SYNTHETIC FIXTURE' \
  '' \
  '2' \
  '00:00:01,100 --> 00:00:01,800' \
  'Generated only from FFmpeg lavfi sources.' \
  > "$subtitle_source"

common_options=(
  -hide_banner
  -loglevel error
  -y
)

ffmpeg "${common_options[@]}" \
  -f lavfi -i 'testsrc2=size=160x90:rate=10:duration=2' \
  -f lavfi -i 'sine=frequency=440:sample_rate=22050:duration=2' \
  -map 0:v:0 -map 1:a:0 \
  -threads 1 -fflags +bitexact -map_metadata -1 \
  -c:v mpeg4 -q:v 12 -flags:v +bitexact \
  -c:a libmp3lame -b:a 24k -flags:a +bitexact \
  -shortest \
  "$temporary_dir/synthetic-container.avi"

ffmpeg "${common_options[@]}" \
  -f lavfi -i 'testsrc2=size=160x90:rate=10:duration=2' \
  -f lavfi -i 'sine=frequency=660:sample_rate=22050:duration=2' \
  -map 0:v:0 -map 1:a:0 \
  -threads 1 -fflags +bitexact -map_metadata -1 \
  -c:v libx264 -preset veryslow -crf 38 -pix_fmt yuv420p \
  -g 10 -keyint_min 10 -sc_threshold 0 -flags:v +bitexact \
  -c:a aac -b:a 24k -flags:a +bitexact \
  -movflags +faststart -shortest \
  "$temporary_dir/synthetic-upload.mp4"

ffmpeg "${common_options[@]}" \
  -f lavfi -i 'testsrc2=size=160x90:rate=10:duration=2' \
  -f lavfi -i 'sine=frequency=880:sample_rate=22050:duration=2' \
  -f srt -i "$subtitle_source" \
  -map 0:v:0 -map 1:a:0 -map 2:s:0 \
  -threads 1 -fflags +bitexact -map_metadata -1 \
  -c:v libx264 -preset veryslow -crf 38 -pix_fmt yuv420p \
  -g 10 -keyint_min 10 -sc_threshold 0 -flags:v +bitexact \
  -c:a aac -b:a 24k -flags:a +bitexact \
  -c:s srt \
  -metadata:s:s:0 language=eng \
  -metadata:s:s:0 title='Synthetic fixture subtitles' \
  -disposition:s:0 default \
  -t 2 \
  "$temporary_dir/synthetic-subtitles.mkv"

ffmpeg "${common_options[@]}" \
  -f lavfi -i 'testsrc2=size=3840x2160:rate=5:duration=1' \
  -f lavfi -i 'sine=frequency=523:sample_rate=48000:duration=1' \
  -f lavfi -i 'sine=frequency=784:sample_rate=48000:duration=1' \
  -f srt -i "$subtitle_source" \
  -map 0:v:0 -map 1:a:0 -map 2:a:0 -map 3:s:0 \
  -threads 1 -fflags +bitexact -map_metadata -1 \
  -vf format=yuv420p10le \
  -c:v libx265 -preset ultrafast -crf 45 \
  -x265-params 'pools=1:frame-threads=1:wpp=0:info=0:repeat-headers=1:log-level=error' \
  -bsf:v 'hevc_metadata=colour_primaries=9:transfer_characteristics=16:matrix_coefficients=9' \
  -c:a:0 dca -strict:a:0 -2 -b:a:0 768k \
  -c:a:1 ac3 -b:a:1 96k -flags:a +bitexact \
  -c:s srt \
  -metadata:s:v:0 language=eng \
  -metadata:s:a:0 language=eng \
  -metadata:s:a:1 language=eng \
  -metadata:s:s:0 language=eng \
  -metadata:s:s:0 title='Synthetic high-spec subtitles' \
  -disposition:s:0 default \
  -t 1 \
  "$temporary_dir/synthetic-hevc-main10-hdr.mkv"

probe_format () {
  ffprobe -v error -show_entries format=format_name \
    -of default=noprint_wrappers=1:nokey=1 "$1"
}

probe_streams () {
  ffprobe -v error -show_entries stream=codec_name,codec_type \
    -of compact=p=0:nk=1 "$1"
}

[[ $(probe_format "$temporary_dir/synthetic-container.avi") == 'avi' ]]
[[ $(probe_format "$temporary_dir/synthetic-upload.mp4") == *'mp4'* ]]
[[ $(probe_format "$temporary_dir/synthetic-subtitles.mkv") == *'matroska'* ]]
[[ $(probe_format "$temporary_dir/synthetic-hevc-main10-hdr.mkv") == *'matroska'* ]]

avi_streams=$(probe_streams "$temporary_dir/synthetic-container.avi")
[[ $avi_streams == *'mpeg4|video'* ]]
[[ $avi_streams == *'mp3|audio'* ]]

mp4_streams=$(probe_streams "$temporary_dir/synthetic-upload.mp4")
[[ $mp4_streams == *'h264|video'* ]]
[[ $mp4_streams == *'aac|audio'* ]]

mkv_streams=$(probe_streams "$temporary_dir/synthetic-subtitles.mkv")
[[ $mkv_streams == *'h264|video'* ]]
[[ $mkv_streams == *'aac|audio'* ]]
[[ $mkv_streams == *'subrip|subtitle'* ]]

high_spec_streams=$(probe_streams "$temporary_dir/synthetic-hevc-main10-hdr.mkv")
[[ $high_spec_streams == *'hevc|video'* ]]
[[ $high_spec_streams == *'dts|audio'* ]]
[[ $high_spec_streams == *'ac3|audio'* ]]
[[ $high_spec_streams == *'subrip|subtitle'* ]]

high_spec_video=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=profile,pix_fmt,width,height,color_space,color_transfer,color_primaries \
  -of default=noprint_wrappers=1 "$temporary_dir/synthetic-hevc-main10-hdr.mkv")
[[ $high_spec_video == *'profile=Main 10'* ]]
[[ $high_spec_video == *'pix_fmt=yuv420p10le'* ]]
[[ $high_spec_video == *'width=3840'* ]]
[[ $high_spec_video == *'height=2160'* ]]
[[ $high_spec_video == *'color_space=bt2020nc'* ]]
[[ $high_spec_video == *'color_transfer=smpte2084'* ]]
[[ $high_spec_video == *'color_primaries=bt2020'* ]]

subtitle_probe=$(ffprobe -v error -select_streams s:0 \
  -show_entries stream=codec_name:stream_tags=language,title \
  -of default=noprint_wrappers=1 "$temporary_dir/synthetic-subtitles.mkv")
[[ $subtitle_probe == *'codec_name=subrip'* ]]
[[ $subtitle_probe == *'TAG:language=eng'* ]]
[[ $subtitle_probe == *'TAG:title=Synthetic fixture subtitles'* ]]

high_spec_subtitle_probe=$(ffprobe -v error -select_streams s:0 \
  -show_entries stream=codec_name:stream_tags=language,title \
  -of default=noprint_wrappers=1 "$temporary_dir/synthetic-hevc-main10-hdr.mkv")
[[ $high_spec_subtitle_probe == *'codec_name=subrip'* ]]
[[ $high_spec_subtitle_probe == *'TAG:language=eng'* ]]
[[ $high_spec_subtitle_probe == *'TAG:title=Synthetic high-spec subtitles'* ]]

embedded_subtitles=$(ffmpeg -v error \
  -i "$temporary_dir/synthetic-subtitles.mkv" \
  -map 0:s:0 -f srt -)
[[ $embedded_subtitles == *'ALPHABIZ SYNTHETIC FIXTURE'* ]]

high_spec_subtitles=$(ffmpeg -v error \
  -i "$temporary_dir/synthetic-hevc-main10-hdr.mkv" \
  -map 0:s:0 -f srt -)
[[ $high_spec_subtitles == *'ALPHABIZ SYNTHETIC FIXTURE'* ]]

for fixture_name in \
  synthetic-container.avi \
  synthetic-upload.mp4 \
  synthetic-subtitles.mkv \
  synthetic-hevc-main10-hdr.mkv
do
  mv -f -- "$temporary_dir/$fixture_name" "$fixture_dir/$fixture_name"
  ffprobe -v error \
    -show_entries format=format_name,duration,size:stream=index,codec_type,codec_name \
    -of compact=p=0:nk=1 "$fixture_dir/$fixture_name"
done
