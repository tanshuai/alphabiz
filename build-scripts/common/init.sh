#!/usr/bin/env bash

set -e # Exit when error

function checkEnv () {
  arg=$1
  if [[ -z "${!arg}" ]]; then
    echo "Info: Env $arg not set. This may cause some errors."
    sleep 0.5
  fi
}

function infiniteRetry () {
  until "$@"
  do
    echo "Failed when running command" "$@" ". Will retry after a moment..."
    echo "You can use Ctrl+C to terminate."
    sleep 5
  done
}

echo "If you are using proxy, you need to set http_proxy, https_proxy and ALL_PROXY in env."
checkEnv http_proxy
checkEnv https_proxy
checkEnv ALL_PROXY

if test -f "$HOME/.npmrc"; then
  echo ".npmrc file exists"
  if ! grep -q authToken "$HOME/.npmrc"; then
    echo "Error:Cannot find authToken in your .npmrc file. You need to add Github Personal Access Token in it like:"
    echo "  //npm.pkg.github.com/:_authToken=XXXXX"
    exit 1
  fi
else
  echo "Error: Failed to check .npmrc file in your home directory. You may need to create one and put your github personal access key in it"
  exit 1
fi

echo "Info: Check node version"
if ! which node; then
  echo "Error: Cannot find node in your PATH. You should install it first"
  exit 1
fi
nodePos=$(which node)
nodeVersion=$(node -v)
echo "Current node: $nodePos (v$nodeVersion)"

echo "Info: Check yarn version"
if ! which yarn; then
  echo "Error: Cannot find yarn in your PATH. You should install it first."
  echo "For node>=16, you can run 'corepack enable' to enable built-in yarn"
  exit 1
fi
yarnPos=$(which yarn)
yarnVersion=$(yarn -v)
echo "Current yarn: $yarnPos (v$yarnVersion)"

echo "Info: Ready to run yarn to install dependencies."
echo "This script will try install until success. You can use Ctrl+C to terminate."
sleep 2

infiniteRetry yarn

echo "Info: Finished installing dependencies. Next:"
echo "  > Run 'yarn dev' for development"
echo "  > Run 'yarn build' to build app"
