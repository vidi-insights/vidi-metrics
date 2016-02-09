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
  plugin: 'vidi',
  
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

## Contributing
The [Vidi: Insights org][Org] encourages __open__ and __safe__ participation.

- [Code of Conduct][CoC]

If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

[Org]: https://github.com/vidi-insights
[CoC]: https://github.com/vidi-insights/org/blob/master/code-of-conduct.md

[Lead]: https://github.com/mcdonnelldean
[Sponsor]: https://nearform.com
