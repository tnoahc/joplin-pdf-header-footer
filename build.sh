#!/bin/sh
# Builds the files the Joplin plugin repository reads from the npm package:
#   publish/<plugin id>.jpl   - the plugin (a plain tar archive of src/)
#   publish/<plugin id>.json  - the manifest plus the .jpl hash and git commit
# The plugin is plain JavaScript, so there is no compile step.
set -e
cd "$(dirname "$0")"

field() { sed -n "s/.*\"$1\": *\"\([^\"]*\)\".*/\1/p" "$2" | head -n 1; }

id=$(field id src/manifest.json)
manifest_version=$(field version src/manifest.json)
package_version=$(field version package.json)

if [ "$manifest_version" != "$package_version" ]; then
	echo "Version mismatch: src/manifest.json is $manifest_version, package.json is $package_version" >&2
	exit 1
fi

rm -rf publish
mkdir -p publish
tar -cf "publish/$id.jpl" -C src manifest.json index.js contentScript.js

hash=$(sha256sum "publish/$id.jpl" | cut -d ' ' -f 1)
commit=""
if git rev-parse HEAD >/dev/null 2>&1; then
	branch=$(git rev-parse --abbrev-ref HEAD)
	[ "$branch" = "HEAD" ] && branch=master
	commit="$branch:$(git rev-parse HEAD)"
	[ -n "$(git status --porcelain)" ] && echo "Warning: uncommitted changes; the recorded commit won't match the build." >&2
fi

# Append the publish fields before the manifest's closing brace.
sed '$d' src/manifest.json | sed '$s/$/,/' > "publish/$id.json"
printf '\t"_publish_hash": "sha256:%s",\n\t"_publish_commit": "%s"\n}\n' "$hash" "$commit" >> "publish/$id.json"

echo "Built publish/$id.jpl and publish/$id.json (version $manifest_version)"
