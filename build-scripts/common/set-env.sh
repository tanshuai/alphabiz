#!/bin/bash
# Set environments
set -e # Exit when error

function ensureExists () {
  if [ ! -e "$1" ]; then
    echo "Error: ""$1"" does not exists. Make sure you have already craeted or built."
    if [[ -z "$2" ]]; then
      echo "  $2"
    fi
    exit 1
  fi
}

ENV_FILE=$(dirname "$(realpath "$0/../../..")")/.env
if test -f "$ENV_FILE"; then
  echo "Loaded .env file"
  # shellcheck source=../../.env
  source "$ENV_FILE"
fi

function ensureEnv () {
  arg=$1
  if [[ -z "${!arg}" ]]; then
    echo "Error: Env $arg not set."
    if [[ -z "$2" ]]; then
      echo "  Set it before run your build arg"
    else
      echo "  This env variable is expected to be $2"
    fi
    echo "You can add a file named .env in root directory, and add your environment variables in it."
    exit 1
  else
    echo "Env: $arg set"
  fi
}

IS_DEV=false
if [[ $DEV = "true" ]]; then
  # shellcheck disable=SC2034
  IS_DEV=true
  echo "Run in development mode."
  echo "Build logs will print to screen."
else
  echo "Run in production mode. "
  # find "." -type f -name "build.log" -maxdepth 1 -exec rm -r "{}" \;
  # echo "Build logs redirected to $(dirname "$(realpath "$0/..")")/build.log"
fi

# Check environment variables
