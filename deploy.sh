#!/bin/bash

rm -rf ./build
rm -rf ./docs
npm run build
mkdir docs
cp -r ./build/* ./docs/
