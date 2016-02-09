'use strict'

var opts = {
  metrics: {
    collector: true,
    log_input: true,
    log_output: true,
  }
}

var seneca =
require('seneca')()
  .use('..', opts.metrics)
  .listen()

setInterval(() => {
  seneca.act({
    role: 'metrics',
    cmd: 'write',
    data: {hello:'world'}
  })
}, 1000)
