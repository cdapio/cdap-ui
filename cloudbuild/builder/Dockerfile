FROM node:12.20.1
# It would be easier to use cypress/base:12.19.0
# However, this uses a Debian that doesn't support OpenJDK 8
# So build our own Cypress + OpenJDK 8 builder
# TODO When CDAP moves to Java 11, update this
 
# Install OpenJDK-8
RUN apt-get update && \
   apt-get install -y openjdk-8-jdk && \
   apt-get install -y ant && \
   apt-get clean;
 
# Fix certificate issues
RUN apt-get update && \
   apt-get install ca-certificates-java && \
   apt-get clean && \
   update-ca-certificates -f;
 
# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME
 
# Install Cypress dependencies
RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
