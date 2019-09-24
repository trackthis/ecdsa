#!/bin/sh

# Reset/fetch submodules
git submodule update --force --init --recursive

# Apply patches
( cd lib/supercop && patch -p1 < ../../patch/supercop/00-single-file-compile.patch )

# Compile
clang \
  --target=wasm32 \
  -emit-llvm \
  -fvisibility=hidden \
  -c \
  -S \
  -Ofast \
  ecdsa.c
llc \
  -march=wasm32 \
  -filetype=obj \
  -O3 \
  ecdsa.ll
wasm-ld \
  --no-entry \
  --import-memory \
  --export-dynamic \
  --strip-all \
  -o ecdsa.wasm \
  ecdsa.o

# Make a .js version of the binaries
cat <<EOJS > ecdsa.wasm.js
module.exports = Buffer.from('$(base64 -w 0 < ecdsa.wasm)', 'base64');
EOJS
