#!/usr/bin/env bash
# Runs a command; on failure, prints its last lines as a GitHub annotation
# so the error is visible in the PR's checks without opening the full log.
set -o pipefail
log="$(mktemp)"
"$@" 2>&1 | tee "$log"
status=${PIPESTATUS[0]}
if [ "$status" -ne 0 ]; then
  tail -n 80 "$log" | sed 's/%/%25/g' | sed 's/\x1b\[[0-9;]*m//g' | awk 'BEGIN{ORS="%0A"} {print}' > "$log.tail"
  echo "::error title=Failed: $*::$(cat "$log.tail")"
  # Also report each failing test separately.
  grep -E "^not ok|^# fail|Error:|AssertionError|expected|actual" "$log" | head -n 20 | while read -r line; do
    echo "::error title=detail::$(echo "$line" | sed 's/%/%25/g')"
  done
fi
exit "$status"
