#!/usr/bin/env bash

# Copyright © 2014-2017 Cask Data, Inc.
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

# Build script for docs

source ../vars
source ../_common/common-build.sh
source build-pipelines.sh

CHECK_INCLUDES=${TRUE}

function download_readme_file_and_test() {
  # Downloads a README.rst file to a target directory, and checks that it hasn't changed.
  # Uses md5 hashes to monitor if any files have changed.

  local file_name='README.rst'

  local includes_dir=${1}
  local source_url=${2}
  local md5_hash=${3}
  local relative_path=${4}

  # Replace any path components with dashes
  local target_file_name=${relative_path//\//-}.rst

  echo "Downloading using curl ${file_name} from ${source_url}"
  curl ${source_url}/${relative_path}/${file_name} --output ${includes_dir}/${target_file_name} --silent
  test_an_include ${md5_hash} ${includes_dir}/${target_file_name}
}

function download_includes() {
  echo "Calling sourced pipelines_download_includes"
  pipelines_download_includes ${1}

  echo "Downloading source files to be included from GitHub..."
  local github_url="https://raw.githubusercontent.com/cdapio"
  local includes_dir=${1}
  set_version

  local clients_branch ingest_branch
  if [ "x${GIT_BRANCH_TYPE:0:7}" == "xdevelop" ]; then
    clients_branch="develop"
    ingest_branch="develop"
  else
    clients_branch="${GIT_BRANCH_CDAP_CLIENTS}"
    ingest_branch="${GIT_BRANCH_CDAP_INGEST}"
  fi

# cdap-clients
# https://raw.githubusercontent.com/cdapio/cdap-clients/develop/cdap-authentication-clients/java/README.rst
  local clients_url="${github_url}/cdap-clients/${clients_branch}"

  download_readme_file_and_test ${includes_dir} ${clients_url} 9bdc7d9ab874bfb6ec044964d3df804e cdap-authentication-clients/java
  download_readme_file_and_test ${includes_dir} ${clients_url} 6f937cbf71ed2312a4893cba27e6145f cdap-authentication-clients/python

# cdap-ingest
# https://raw.githubusercontent.com/cdapio/cdap-ingest/develop/cdap-file-drop-zone/README.rst
  local ingest_url="${github_url}/cdap-ingest/${ingest_branch}"

  download_readme_file_and_test ${includes_dir} ${ingest_url} cf2d8cac45b4be267adbb0e8ecdc88a4 cdap-flume
  download_readme_file_and_test ${includes_dir} ${ingest_url} a852e493aff54ffd726368691f248d80 cdap-stream-clients/java
  download_readme_file_and_test ${includes_dir} ${ingest_url} da242d9be7051417bd5ff73b3dc5edc2 cdap-stream-clients/python
  download_readme_file_and_test ${includes_dir} ${ingest_url} 4475514acbba0a5f32a61d5c13c30fdb cdap-stream-clients/ruby

  echo_red_bold "Check included example files for changes"

  test_an_include 8fdb325ac2ad92bca959bd2f12fc91d7 ../../cdap-examples/FileSetExample/src/main/java/io/cdap/cdap/examples/fileset/FileSetService.java

  test_an_include 1b4cbbca8854950d67230f9062b2548e ../../cdap-examples/Purchase/src/main/java/io/cdap/cdap/examples/purchase/PurchaseHistoryBuilder.java
  test_an_include 80216a08a2b3d480e4a081722408222f ../../cdap-examples/Purchase/src/main/java/io/cdap/cdap/examples/purchase/PurchaseHistoryService.java
  test_an_include 272a77c680b8cfb14adb42b09e33a770 ../../cdap-examples/Purchase/src/main/java/io/cdap/cdap/examples/purchase/PurchaseStore.java

  test_an_include fdf59cc4d67aef9abda0bc35e806a809 ../../cdap-examples/SparkPageRank/src/main/java/io/cdap/cdap/examples/sparkpagerank/SparkPageRankApp.java

  test_an_include 26486a370532d820bde854d42990a868 ../../cdap-examples/SportResults/src/main/java/io/cdap/cdap/examples/sportresults/UploadService.java

  test_an_include ce88887b4e60273e60deeb6d233be7ae ../../cdap-examples/WikipediaPipeline/src/main/java/io/cdap/cdap/examples/wikipedia/TopNMapReduce.java
  test_an_include 76f187d9ad8ea4d14bde0f2ef8617a97 ../../cdap-examples/WikipediaPipeline/src/main/scala/io/cdap/cdap/examples/wikipedia/ClusteringUtils.scala

  test_an_include eb9c28563b1ef25f7740c796ecf005b2 ../../cdap-examples/WordCount/src/main/java/io/cdap/cdap/examples/wordcount/RetrieveCountsHandler.java
}

function test_includes () {
  echo "All includes tested."
}

run_command ${1}
