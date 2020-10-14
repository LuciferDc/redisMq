const EventEmitter = require('events');
class EventEmitters {
  constructor () {
    this.emitter = new EventEmitter()
  }
}
module.exports = EventEmitters