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

FROM node:16
# It would be easier to use cypress/base:12.19.0
# However, this uses a Debian that doesn't support OpenJDK 8
# So build our own Cypress + OpenJDK 8 builder
# TODO When CDAP moves to Java 11, update this

RUN apt-get update && \
   apt install -y software-properties-common

# Add OpenJDK registry
RUN wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | apt-key add -
RUN add-apt-repository --yes https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/

# Install OpenJDK-8
RUN apt-get update && \
   apt-get install -y adoptopenjdk-8-hotspot && \
   apt-get install -y ant && \
   apt-get clean;

# Fix certificate issues
RUN apt-get update && \
   apt-get install -y ca-certificates-java && \
   apt-get clean && \
   update-ca-certificates -f;

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME

# Install Cypress dependencies
RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
