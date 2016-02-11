'use strict'

var dgram = require('dgram')

var defaults = {
  plugin: 'vidi-metrics',
  role: 'metrics',
  collector: {
    enabled: false
  },
  emitter: {
    enabled: false,
    interval: 1000
  },
  udp: {
    host: 'localhost',
    port: 5001
  }
}

module.exports = function (opts) {
  var seneca = this
  var extend = seneca.util.deepextend

  opts = extend(defaults, opts)
  opts.txrx = opts.txrx || make_udp_txrx(seneca)

  seneca.add({init: opts.plugin}, on_init)

  function on_init (msg, done) {
    if (opts.collector.enabled) {
      opts.txrx.receive(opts.handler)
    }
    if (opts.emitter.enabled) {
      start_emit()
    }

    done()
  }

  function handle_data_in (data) {
    if (data) {
      if (opts.log_input) {
        console.log(JSON.stringify(data, null, 2))
      }

      map_if_needed(data, (err, data) => {
        if (!err && data) {
          data.role = opts.role
          data.hook = 'map'

          seneca.act(data, function (err, mapped) {
            if (!err) {
              mapped.forEach((metric) => {
                seneca.act({
                  role: opts.role,
                  hook: 'sink',
                  source: metric.source,
                  name: metric.name,
                  metric: metric
                })
              })
            }
          })
        }
      })
    }
  }

  function map_if_needed (data, done) {
    if (data.source && data.payload) return done(null, data)
    else seneca.act({role: opts.role, hook: 'tag', payload: data}, done)
  }

  function start_emit () {
    setInterval(() => {
      seneca.act({role: opts.role, hook: 'emit'}, handle_emit)
    }, opts.emitter.interval)
  }

  function handle_emit (err, metrics) {
    if (!err) {
      metrics.forEach((metric) => {
        opts.txrx.transmit(metric)
      })
    }
  }

  function make_udp_txrx (seneca) {
    var host = opts.udp.host
    var port = opts.udp.port

    return {
      transmit: (data) => {
        var socket = dgram.createSocket('udp4')

        data = new Buffer(JSON.stringify(data))
        socket.send(data, 0, data.length, opts.udp.port, opts.udp.host, (err) => {
          if (err) console.log(err)
        })
      },
      receive: (handler) => {
        var socket = dgram.createSocket('udp4')

        socket.on('message', (msg) => {
          try {
            msg = JSON.parse(msg)
            handle_data_in(msg)
          }
          catch (e) {
            seneca.log.info(e.stack)
          }
        })

        socket.bind(port, host)
      }
    }
  }

  return opts.plugin
}
