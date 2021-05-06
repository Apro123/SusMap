#!/usr/bin/env bash
case "${TRGT}" in
  browser )
  ionic integrations enable cordova --quiet
  ionic cordova platform add browser --no-interactive --confirm
  ionic cordova build browser --prod --release
  cd ./www
  ln -s index.html 404.html
  ln -s favicon.ico apple-touch-icon.png
  ln -s favicon.ico apple-touch-icon-precomposed.png
  cd ./..
  cp platforms/browser/config.xml www/
  cp .htaccess docs/
  export PROJ_NAME="$(cat package.json | grep name -m1 | cut -d "\"" -f4)"
  export PROJ_VERSION="$(cat package.json | grep version -m1 | cut -d "\"" -f4)"
  export PROJ_ZIP="$PROJ_NAME-v$PROJ_VERSION.zip"
  zip $PROJ_ZIP docs
  ;;
esac
