'use strict'

var dgram = require('dgram')

var defaults = {
  plugin: 'vidi-metrics',
  role: 'metrics',
  collector: false,
  log_input: false,
  log_output: false,
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
  seneca.add({role: opts.role, cmd: 'write'}, on_cmd_write)
  seneca.add({role: opts.role, cmd: 'map'}, on_cmd_map)
  seneca.add({role: opts.role, cmd: 'store'}, on_cmd_store)

  function on_init (msg, done) {
    if (opts.collector) {
      opts.txrx.receive(opts.handler)
    }
    done()
  }

  function on_cmd_write (msg, done) {
    this.prior(msg, function (err, data) {
      data = data || msg

      if (data) {
        if (opts.log_input) {
          console.log(JSON.stringify(data, null, 2))
        }

        data.role = opts.role
        data.cmd = 'map'

        seneca.act(data, function (err, mapped) {
          if (!err) {
            mapped.role = opts.role
            mapped.cmd = 'store'

            if (opts.log_output) {
              console.log(JSON.stringify(mapped, null, 2))
            }

            seneca.act(mapped)
            done(null)
          }
        })
      }
    })
  }

  function on_cmd_map (msg, done) {
    this.prior(msg, function (err, data) {
      done(null, data || msg)
    })
  }

  function on_cmd_store (msg, done) {
    this.prior(msg, function (err, data) {
      done(null, (data || msg))
    })
  }

  function make_udp_txrx (seneca) {
    var host = opts.udp.host
    var port = opts.udp.port

    return {
      receive: (handler) => {
        var socket = dgram.createSocket('udp4')

        socket.on('message', (msg) => {
          try {
            msg = JSON.parse(msg)
            seneca.act({role: opts.role, cmd: 'write', data: msg})
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
