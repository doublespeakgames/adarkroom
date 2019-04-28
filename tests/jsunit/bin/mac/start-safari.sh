#!/bin/sh

# Starts Safari. Use this instead of calling the AppleScripts directly.

osascript bin/mac/stop-safari.scpt
osascript bin/mac/start-safari.scpt $1

