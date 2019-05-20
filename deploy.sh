#!/bin/bash

rsync -avz -e ssh \
    app.css \
    app.css.map \
    favicon.ico \
    img \
    index.html \
    AntiDiffer_Shape*.json \
    js \
    nme@wh1.stepone.no:/home/nme/stepone.dev/root_antidiffer/
