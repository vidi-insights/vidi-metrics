![Banner][]

# vidi-metrics

- __Lead Maintainer:__ [Dean McDonnell][Lead]
- __Sponsor:__ [nearForm][Sponsor]

Vidi: Metrics is a customizable metrics pipeline built on top of [Seneca][]. It can be run as a
plugin for integration with larger Seneca systems or stand-alone as a scriptable, pluggable,
micro-service. Vidi: Metrics can both collect and emit metrics. Each mode can be enabled
independently or together. All transport is via UDP.

- __Work in progress__ This module is currently a work in progress.

## Running as a plugin
To use as a plugin, install via npm and use in your seneca system,

```
npm install vidi-metrics
```

```js
require('seneca')()
  .use('vidi-metrics', {
    emitter: {enabled: true},
    collector: {enabled: true}
  )
  ...
```

Mix and match with some plugins from the [Org] to add additional features.

## Running as a micro-service
A demo micro-service can be found in `srv/demo.js` and ran via npm. Simply clone this repository
locally and run,

```
npm install; npm run demo
```

The demo runs in both emitter and collector mode and demonstrates how to add custom plugins to a
UPD capable micro-service. It makes a great springboard for a custom micro-service tailored to
your needs. Check the [Org][] for additional plugins that can be dropped in to add more functionality.

## Options
Vidi: Metrics has a number of options available to configure how it works, below, each available option
is listed along with it's default value if not set by the user.

```js
{
  // the name the plugin is registered as
  plugin: 'vidi-metrics',

  // the role each hook is emitted as
  role: 'metrics',

  // collector options
  collector: {
    // enable or disable collector mode
    enabled: false
  },

  // emitter options
  emitter: {
    // enable or disable emitter mode
    enabled: false

    // the interval to call emitters on
    interval: 1000
  },

  // upd options  
  udp: {

    // the emit / collect host
    host: 'localhost',

    // the emit / collect port
    port: 5001
  }
}
```

## The pipeline
Vidi: Metrics has a simple pipeline that can be hooked into at various points.

### {role: 'metrics', hook: 'emit'}
If in emitter mode, once per interval Vidi: Metrics will call actions matching the
above pattern. Simply return an array of data points you wish to emit in the provided
callback.

### {role: 'metrics', hook: 'tag'}
Allows external data to be correctly tagged for mapping. If data arrives via UPD with no
source and/or payload the data will be passed to actions matching the above pattern. If
a match is made the correctly tagged data is returned in the callback, otherwise null is
returned. Data that cannot be tagged is discarded.

### {role: 'metrics', hook: 'map'}
Maps data to well defined metrics. These metrics are emitted with at least the fields
source, and name. Map plugins can emit multiple metrics of varying name and even source.

### {role: 'metrics', hook: 'sink'}
Sink's capture metrics on an individual basis. Sinks can match on name and source for more
granularity. Sinks are considered the final point in the pipeline.

__Note:__ Our demo micro-service mentioned above contains commented code demonstrating how to
hook into the pipeline using the above patterns.

## Contributing
The [Vidi: Insights org][Org] encourages __open__ and __safe__ participation.

- [Code of Conduct][CoC]

If you feel you can help in any way, be it with documentation, examples, extra testing, or new
features please get in touch.

## License
Copyright (c) 2016, Dean McDonnell and other contributors.
Licensed under [MIT][].

[Banner]: https://raw.githubusercontent.com/vidi-insights/org/master/assets/vidi-banner.png
[Lead]: https://github.com/mcdonnelldean
[Sponsor]: http://www.nearform.com/
[Org]: https://github.com/vidi-insights
[CoC]: https://github.com/vidi-insights/org/blob/master/code-of-conduct.md
[MIT]: ./LICENSE

[Seneca]: http://senecajs.org
[Releases]: https://github.com/vidi-insights/vidi-metrics/releases
