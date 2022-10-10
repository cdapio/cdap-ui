# Copyright © 2022 Cask Data, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at

# http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.

import io
import os
import requests
import subprocess
import zipfile
import json

def run_shell_command(cmd):
    process = subprocess.run(cmd.split(" "), stderr=subprocess.PIPE)
    if process.returncode != 0:
        print("Process completed with error: ", process.stderr)
    assert process.returncode == 0

# Start CDAP sandbox
print("Downloading CDAP sandbox")
with open('sandbox_version.json') as sandbox_info_file:
  sandbox_info = json.load(sandbox_info_file)
sandbox_url = "https://github.com/cdapio/cdap-build/releases/download/{}/cdap-sandbox-{}.zip".format(sandbox_info["release"], sandbox_info["version"])
sandbox_dir = sandbox_url.split("/")[-1].split(".zip")[0]
r = requests.get(sandbox_url)
z = zipfile.ZipFile(io.BytesIO(r.content))
z.extractall("../../sandbox")

print("Start the sandbox")
run_shell_command(f"chmod +x ../../sandbox/{sandbox_dir}/bin/cdap")
my_env = os.environ.copy()
my_env["_JAVA_OPTIONS"] = "-Xmx24G"
sandbox_start_cmd = "../../sandbox/" + sandbox_dir + "/bin/cdap sandbox start"
process = subprocess.Popen(sandbox_start_cmd, shell=True, env=my_env)
process.communicate()
assert process.returncode == 0

# Kill sandbox UI
print("Killing sandbox UI")
get_node_PID_cmd="ps -ef | grep index.js | grep -v grep | awk '{print $2}'"
PID = subprocess.run(get_node_PID_cmd, shell=True, capture_output=True, text=True).stdout.strip("\n")
kill_node_process_cmd = "kill {}".format(PID)
process = subprocess.run(kill_node_process_cmd, shell=True)
assert process.returncode == 0

