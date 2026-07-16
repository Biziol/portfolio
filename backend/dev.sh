#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

cleanup() {
	if [[ -n "${WATCH_PID:-}" ]] && kill -0 "$WATCH_PID" 2>/dev/null; then
		kill "$WATCH_PID"
		wait "$WATCH_PID" 2>/dev/null || true
	fi
}

trap cleanup EXIT INT TERM

./gradlew classes --continuous &
WATCH_PID=$!

./gradlew bootRun