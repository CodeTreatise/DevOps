#!/bin/bash
# Parallel curl link checker — Pass 4
# Usage: bash scripts/check_links_curl.sh [concurrency]
cd "$(dirname "$0")/.."
IN="$TMPDIR/all_urls.txt"
OUT="$TMPDIR/link_status.tsv"
CONC="${1:-12}"
: > "$OUT"

check_one() {
  url="$1"
  code=$(curl -sS -o /dev/null -w '%{http_code}' -L --connect-timeout 5 --max-time 10 -A "Mozilla/5.0 (compatible; link-checker)" -I "$url" 2>/dev/null)
  if [ "$code" = "405" ] || [ "$code" = "403" ] || [ "$code" = "000" ] || [ -z "$code" ]; then
    code=$(curl -sS -o /dev/null -w '%{http_code}' -L --connect-timeout 6 --max-time 12 -A "Mozilla/5.0 (compatible; link-checker)" "$url" 2>/dev/null)
  fi
  printf '%s\t%s\n' "${code:-000}" "$url"
}
export -f check_one

cat "$IN" | xargs -P "$CONC" -I{} bash -c 'check_one "$1"' _ {} | sort > "$OUT"

echo "=== SUMMARY ==="
awk -F'\t' '{c[$1]++} END {for (k in c) print k, c[k]}' "$OUT" | sort
echo "=== NON-2xx/3xx ==="
awk -F'\t' '$1 !~ /^[23][0-9][0-9]$/ {print $1, $2}' "$OUT"
echo "=== DONE: $OUT ==="
