#!/bin/bash
#
# Copyright © 2021 Cask Data, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.

# Start sandbox and kill UI process
cd ./sandbox/bin
./cdap sandbox start
PID=`ps -ef | grep index.js | grep -v grep | awk '{print $2}'`
kill $PID
cd ../..

# Start UI server and run cypress tests
# TODO Capture server.out if errors occur
yarn start & > server.out
yarn cypress --env gcp_projectid=cdap-gcp-project,gcp_service_account_path=/workspace/key_file.json --record --key $1
