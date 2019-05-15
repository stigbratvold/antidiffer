#!/bin/bash

rsync -avz -e ssh \
    app.css \
    app.css.map \
    favicon.ico \
    img \
    index.html \
    js \
    nme@wh1.stepone.no:/home/nme/stepone.dev/root_antidiffer/
