# CDAP-UI

This repo contains the code for the CDAP UI. The main
repo for the CDAP project is [cdapio/cdap](https://github.com/cdapio/cdap).

## Running CDAP-UI

CDAP-UI requires an instance of CDAP to run.

### System requirements

Running CDAP-UI requires Java 8 (for CDAP) and Node.js
(please use the most recent long-term support version).

### Using the sandbox

CDAP-UI is packaged with the CDAP sandbox. You can
[download the sandbox](https://cdap.io/get-started/)
and follow the directions to run CDAP.

## Building CDAP-UI

You can build CDAP-UI as part of the full CDAP build,
or build only the UI and use a sandbox for the CDAP
backend.

### Running a full CDAP build

Please see the directions in the [CDAP repo](https://github.com/cdapio/cdap).

### Building CDAP-UI on its own.

To build CDAP-UI on its own, run the following commands from the
root directory of the repo:

```
yarn
bower install
```

Download the CDAP sandbox and start it. By default, the sandbox's UI
will use the same port as the locally built one. You can kill
the sandbox's UI process by using

```
ps -ef | grep index.js
```

to get the pid and then killing it. Or, you can update
[cdap.json](./server/config/development/cdap.json) locally to change
the port of the local build. (Change the field
`dashboard.bind.port`.)

After the port conflict is cleared, you can run

```
yarn dev
```

this will start the Node server as well as watchers for code changes.

## Contributing

Please see the [guidelines for contributing](./CONTRIBUTING.md) to the project and
[specific guidelines for developers](./DEVELOPERS.md).


## License

Please the [license](./LICENSE.txt).
