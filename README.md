# vidi-metrics

- __Lead Maintainer:__ [Dean McDonnell][Lead]
- __Sponsor:__ [nearForm][Sponsor]

A customisable self hosting metrics pipeline.

- __Work in progress__ This module is currently a work in progress.

## Install

```
npm install vidi-metrics
```

## Usage

- in progress

## Options
```
{
  // default name when loading the plugin,
  // allows side by side loading if needed
  plugin: 'vidi-metrics',
  role: 'metrics',

  // Listen on upd for messages
  collector: false,

  // Console.log raw input
  log_input: false,

  // Console.log raw output
  log_output: false,

  // Configure upd listener
  udp: {
    host: 'localhost',
    port: 5001
  }
}
```

## Try it out
A demo micro-service can be found in `test/demo.js` and ran via npm. It listens on UDP for JSON messages and via Seneca for
`role:metrics, cmd:write`. If data is provided it will be sent through the pipeline and emitted emitted to console. The demo
emits input and output. Be sure to run `npm install` before running the demo.

```
npm run demo
```

## Contributing
The [Vidi: Insights org][Org] encourages __open__ and __safe__ participation.

- [Code of Conduct][CoC]

If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

[Org]: https://github.com/vidi-insights
[CoC]: https://github.com/vidi-insights/org/blob/master/code-of-conduct.md

[Lead]: https://github.com/mcdonnelldean
[Sponsor]: https://nearform.com
