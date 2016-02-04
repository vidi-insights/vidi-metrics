'use strict'

var dgram = require('dgram')

var defaults = {
  plugin: 'stats',
  collector: false,
  log_payload: false,
  log_metrics: false,
  udp: {
    host: 'localhost',
    port: 5001
  }
}

module.exports = function (opts) {
  var seneca = this
  var extend = seneca.util.deepextend

  opts = extend(defaults, opts)

  // handles inbound messages
  function handle_payload (msg) {
    if (msg) {
      msg = JSON.parse(msg)

      if (opts.log_payload) {
        console.log(JSON.stringify(msg, null, 2))
      }

      msg.role = opts.plugin
      msg.cmd = 'map'

      // map data to standard format, this
      // us usually handled by plugins
      seneca.act(msg, (err, reply) => {
        if (!err) {
          reply.role = opts.plugin
          reply.cmd = 'store'

          // Allow stores to save the
          // standardised stats.
          seneca.act(reply)
        }
      })
    }
  }

  // creates a upd receiver and binds
  // it to the provided payload handler.
  function make_udp_txrx () {
    var host = opts.udp.host
    var port = opts.udp.port

    return {
      receive: (handler) => {
        var socket = dgram.createSocket('udp4')

        socket.on('message', (msg) => {
          try {
            handler(msg)
          }
          catch (e) {
            seneca.log.info(e.stack)
          }
        })

        socket.bind(port, host)
      }
    }
  }

  // Use default or user provided payload
  // handler and / or txrx handler.
  opts.txrx = opts.txrx || make_udp_txrx()
  opts.handler = opts.handler || handle_payload

  // Kick off. If in collector mode we will open
  // the port and provide a payload handler.
  seneca.add({init: opts.plugin}, (msg, done) => {
    if (opts.collector) {
      opts.txrx.receive(opts.handler)
    }

    done()
  })

  // handle local inbound messages. Passes the message through
  // the same handler as ones from our txrx handler.
  seneca.add({role: opts.plugin, cmd: 'write'}, (msg, done) => {
    handle_payload(msg)
    done()
  })

  // default handler for storage is to simply throw the messages away.
  seneca.add({role: opts.plugin, cmd: 'store'}, (msg, done) => {
    if (opts.log_metrics) {
      console.log(JSON.stringify(msg.metrics, null, 2))
    }

    done()
  })

  return opts.plugin
}
