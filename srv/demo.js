'use strict'

// Get the plugin
var metrics = require('..')

// options for Vidi: Metrics
var opts = {
  emitter: {enabled: true},
  collector: {enabled: true}
}

// Our micro-service
require('seneca')()
  .use(metrics, opts)
  .use(demo_plugin)
  .listen()

// Vidi plugins are simple seneca plugins.
function demo_plugin (opts) {

  // adds an emit plugin. Emit plugins are called on regular intervals and have
  // the opertunity to add to the payload being sent to collectors. Data sent
  // from emit plugins should not require tagging, and should be map ready.
  this.add({role: 'metrics', hook: 'emit'}, emit)

  // adds a tag plugin. When inbound data is missing a source:'name' pair the
  // data is sent to tag plugins for identification and sanitation. Tag plugins
  // allow data to be standardised enough for map plugins to match on the data.
  this.add({role: 'metrics', hook: 'tag'}, tag)

  // adds a map plugin. Maps recieve data once per payload via sources. A
  // map can additionally match on source:'' for granularity. Maps emit
  // arrarys of one or more metrics.
  this.add({role: 'metrics', hook: 'map'}, map)

  // adds a sink plugin. Metrics are sent to sinks one at a time. A sink
  // can additionally match on source:'' and name: '' for granularity. A
  // sink does not emit data but may persist or otherwise store metrics.
  this.add({role: 'metrics', hook: 'sink'}, sink)

  // Tagging just means returning a source and payload, it allows
  // plugins that understand the data to tag it for themselves. This
  // means inbound data does not need to be modified at source
  function tag (msg, done) {
    var clean_data = {
      source: 'demo-plugin',
      payload: msg.payload
    }

    done(null, clean_data)
  }

  // Map plugins return arrays of metrics. The only required fields are
  // source and name. All other fields depend on the sink you want to use.
  // Note that the fields below represent our 'plugin' standard.
  function map (msg, done) {
    var metric = {
      source: msg.source,
      name: 'my-metric',
      values: {val: msg.payload.val},
      tags: {tag: msg.payload.tag}
    }

    done(null, [metric])
  }

  // On interval, Vidi: Metrics will call all emitters and ask for data.
  // Multiple points of data can be sent in a single emit.
  function emit (msg, done) {
    var raw_data = [
      {source: 'demo-plugin', payload: {val: 1, tag: 'foo'}},
      {val: 2, tag: 'foo'}
    ]

    done(null, raw_data)
  }

  // A sink simply does something with each metric it gets. In our case
  // we are logging to the console but you can do anything you like with it.
  function sink (msg, done) {
    var metric = msg.metric
    var as_text = JSON.stringify(metric, null, 1)

    console.log(as_text)

    done()
  }

  // Seneca requires you return a plugin name
  return 'demo-plugin'
}
