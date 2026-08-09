#!/bin/bash
# Turn a source scan into the two files the game serves.
#
#   ./build-ad-images.sh rr-1958 ~/Downloads/rolls-royce-scan.jpg
#
# Produces assets/ads/{id}.jpg (max 1200px, under ~300KB) and
# assets/ads/{id}-thumb.jpg (400px). Both are re-encoded, which drops EXIF
# along with everything else the original carried.
#
# Uses sips, which ships with macOS. No dependencies to install.

set -euo pipefail

if [ $# -ne 2 ]; then
  echo "usage: $0 <id> <source-image>" >&2
  echo "  e.g. $0 rr-1958 ~/Downloads/rolls.jpg" >&2
  exit 1
fi

ID="$1"
SRC="$2"
DIR="$(cd "$(dirname "$0")" && pwd)/assets/ads"

[ -f "$SRC" ] || { echo "no such file: $SRC" >&2; exit 1; }
mkdir -p "$DIR"

FULL="$DIR/$ID.jpg"
THUMB="$DIR/$ID-thumb.jpg"

# --resampleHeightWidthMax scales the longest edge, preserving aspect ratio.
sips --setProperty format jpeg --setProperty formatOptions 75 \
     --resampleHeightWidthMax 1200 "$SRC" --out "$FULL" >/dev/null
sips --setProperty format jpeg --setProperty formatOptions 70 \
     --resampleHeightWidthMax 400 "$SRC" --out "$THUMB" >/dev/null

# sips writes a fresh container, so no EXIF survives. Verify rather than assume.
if command -v exiftool >/dev/null 2>&1; then
  exiftool -all= -overwrite_original "$FULL" "$THUMB" >/dev/null 2>&1 || true
fi

size_kb() { echo $(( $(stat -f%z "$1") / 1024 )); }
dims() { sips -g pixelWidth -g pixelHeight "$1" 2>/dev/null | awk '/pixel/{printf "%s ", $2}'; }

echo "$ID"
echo "  full : $(dims "$FULL")px  $(size_kb "$FULL")KB  -> assets/ads/$ID.jpg"
echo "  thumb: $(dims "$THUMB")px  $(size_kb "$THUMB")KB  -> assets/ads/$ID-thumb.jpg"

if [ "$(size_kb "$FULL")" -gt 300 ]; then
  echo "  NOTE: over the 300KB target. Re-run with a lower quality:" >&2
  echo "        sips --setProperty format jpeg --setProperty formatOptions 60 \\" >&2
  echo "             --resampleHeightWidthMax 1000 \"$SRC\" --out \"$FULL\"" >&2
fi
