=======
CDAP UI
=======

CDAP is built part using React and part Angular. We are on the process migrating the entire app to react.
Until then the UI webserver (nodejs proxy) will serve three different applications to browser, two Angular and one React app.

Building the UI
===============

Prerequisites
-------------
- NodeJS Version: 10.16.2

  CDAP UI requires  NodeJS version 10.16.2.
  You could either download from the nodejs.org website or use a version manager.

  - `v10.16.2 Download <https://nodejs.org/download/release/v10.16.2/>`__

  - `nvm <https://github.com/creationix/nvm#install-script>`__ or

  - `n <https://github.com/tj/n>`__ from github.

  The node version managers help switching between node version quite seamlessly.

- Build tools: ``yarn``, ``gulp``, ``webpack``, and ``bower``

  For CDAP UI development we use ``yarn`` as node build tool.
  For installing yarn please follow `yarn installation docs <https://yarnpkg.com/lang/en/docs/install/>`__

  CDAP UI extensively uses ``bower``, ``gulp``, and ``webpack`` during its build process.
  Even though it's not necessary, it will be useful if they are installed globally::

    $ yarn global add gulp bower webpack -g

Install Dependencies
--------------------
::

  $ yarn
  $ bower install


Building CDAP in React
======================
::

  $ yarn cdap-dev-build ## build version
  $ yarn cdap-dev-build-w ## watch version

Building CDAP in React to be shared in Angular code
===================================================
::

  $ yarn build-dev-common ## build version
  $ yarn build-dev-common-w ## watch version

Building Hydrator in Angular
========================================
::

  $ yarn build ## build version
  $ yarn build-w ## watch version

Building entire UI
==================
::

  $ yarn cdap-full-build ## builds both angular and react code.


Building DLLs for updating pre-built libraries used by CDAP
===========================================================
::

  $ yarn build-dlls

This will build the pre-built library dlls that we use in CDAP


Building a Running Backend
==========================
UI work generally requires having a running CDAP Sandbox instance. To build an instance::

    $ git clone git@github.com:caskdata/cdap.git
    $ cd cdap
    $ mvn package -pl cdap-standalone -am -DskipTests -P dist,release
    $ cd cdap-standalone/target
    $ unzip cdap-sandbox-{version}.zip
    $ cd <cdap-sandbox-folder>
    $ bin/cdap sandbox start

Once you have started the CDAP Sandbox, it starts the UI node server as part of its init script.

To work on UI Code
------------------
If you want to develop and test the UI against the CDAP Sandbox that was just built as above,
you need to first kill the node server started by the CDAP Sandbox and follow this process:

Start these processes, each in their own terminal tab or browser window:

- ``$ gulp watch`` (autobuild + livereload of angular app)
- ``$ npm run cdap-dev-build-w`` (autobuild + livereload of react app)
- ``$ npm start`` (http-server)
- ``$ open http://localhost:11011``

If you are working on common components shared between all the apps (for instance, the Header)
then you need to build an additional ``common`` library that is used across all:

- ``$ webpack --config webpack.config.common.js -d ## build version``
- ``$ webpack --config webpack.config.common.js --watch -d ## watch version``


======================
License and Trademarks
======================

Copyright © 2019 Cask Data, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the
License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the License for the specific language governing permissions
and limitations under the License.

Cask is a trademark of Cask Data, Inc. All rights reserved.

Apache, Apache HBase, and HBase are trademarks of The Apache Software Foundation. Used with
permission. No endorsement by The Apache Software Foundation is implied by the use of these marks.
