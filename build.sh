#!/bin/sh
# Packages src/ into publish/<plugin id>.jpl (a .jpl is a plain tar archive).
# The plugin is plain JavaScript, so there is no compile step.
set -e
cd "$(dirname "$0")"

id=$(sed -n 's/.*"id": *"\([^"]*\)".*/\1/p' src/manifest.json)
mkdir -p publish
tar -cf "publish/$id.jpl" -C src manifest.json index.js contentScript.js
echo "Built publish/$id.jpl"
