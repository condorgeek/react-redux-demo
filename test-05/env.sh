#!/usr/bin/env bash

# take input file else use default .env
if [[ ! -z "${1}" ]]; then file="${1}"; else file=".env"; fi
if [[ ! -f "${file}" ]]; then echo "The file doesn't exist: ${file}" >&2 && exit 1; fi

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment
echo "window._env_ = {" >> ./env-config.js

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # skip comment- and blank lines
  [[ $line =~ ^$ ]] && continue
  [[ $line =~ ^#.* ]] && continue

  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}

  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> ./env-config.js
done < "${file}"

echo "}" >> ./env-config.js
