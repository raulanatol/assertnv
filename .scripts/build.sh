#!/bin/sh

set -eu

npm run build
npm run esbuild-node
