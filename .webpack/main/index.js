/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/lru-cache/index.js":
/*!*****************************************!*\
  !*** ./node_modules/lru-cache/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(/*! yallist */ "./node_modules/yallist/yallist.js")

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ "./node_modules/ws/index.js":
/*!**********************************!*\
  !*** ./node_modules/ws/index.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const WebSocket = __webpack_require__(/*! ./lib/websocket */ "./node_modules/ws/lib/websocket.js");

WebSocket.createWebSocketStream = __webpack_require__(/*! ./lib/stream */ "./node_modules/ws/lib/stream.js");
WebSocket.Server = __webpack_require__(/*! ./lib/websocket-server */ "./node_modules/ws/lib/websocket-server.js");
WebSocket.Receiver = __webpack_require__(/*! ./lib/receiver */ "./node_modules/ws/lib/receiver.js");
WebSocket.Sender = __webpack_require__(/*! ./lib/sender */ "./node_modules/ws/lib/sender.js");

WebSocket.WebSocket = WebSocket;
WebSocket.WebSocketServer = WebSocket.Server;

module.exports = WebSocket;


/***/ }),

/***/ "./node_modules/ws/lib/buffer-util.js":
/*!********************************************!*\
  !*** ./node_modules/ws/lib/buffer-util.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { EMPTY_BUFFER } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

const FastBuffer = Buffer[Symbol.species];

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
function concat(list, totalLength) {
  if (list.length === 0) return EMPTY_BUFFER;
  if (list.length === 1) return list[0];

  const target = Buffer.allocUnsafe(totalLength);
  let offset = 0;

  for (let i = 0; i < list.length; i++) {
    const buf = list[i];
    target.set(buf, offset);
    offset += buf.length;
  }

  if (offset < totalLength) {
    return new FastBuffer(target.buffer, target.byteOffset, offset);
  }

  return target;
}

/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
function _mask(source, mask, output, offset, length) {
  for (let i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
}

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
function _unmask(buffer, mask) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} buf The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 * @public
 */
function toArrayBuffer(buf) {
  if (buf.length === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
}

/**
 * Converts `data` to a `Buffer`.
 *
 * @param {*} data The data to convert
 * @return {Buffer} The buffer
 * @throws {TypeError}
 * @public
 */
function toBuffer(data) {
  toBuffer.readOnly = true;

  if (Buffer.isBuffer(data)) return data;

  let buf;

  if (data instanceof ArrayBuffer) {
    buf = new FastBuffer(data);
  } else if (ArrayBuffer.isView(data)) {
    buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
  } else {
    buf = Buffer.from(data);
    toBuffer.readOnly = false;
  }

  return buf;
}

module.exports = {
  concat,
  mask: _mask,
  toArrayBuffer,
  toBuffer,
  unmask: _unmask
};

/* istanbul ignore else  */
if (!process.env.WS_NO_BUFFER_UTIL) {
  try {
    const bufferUtil = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'bufferutil'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

    module.exports.mask = function (source, mask, output, offset, length) {
      if (length < 48) _mask(source, mask, output, offset, length);
      else bufferUtil.mask(source, mask, output, offset, length);
    };

    module.exports.unmask = function (buffer, mask) {
      if (buffer.length < 32) _unmask(buffer, mask);
      else bufferUtil.unmask(buffer, mask);
    };
  } catch (e) {
    // Continue regardless of the error.
  }
}


/***/ }),

/***/ "./node_modules/ws/lib/constants.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/constants.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";


const BINARY_TYPES = ['nodebuffer', 'arraybuffer', 'fragments'];
const hasBlob = typeof Blob !== 'undefined';

if (hasBlob) BINARY_TYPES.push('blob');

module.exports = {
  BINARY_TYPES,
  EMPTY_BUFFER: Buffer.alloc(0),
  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
  hasBlob,
  kForOnEventAttribute: Symbol('kIsForOnEventAttribute'),
  kListener: Symbol('kListener'),
  kStatusCode: Symbol('status-code'),
  kWebSocket: Symbol('websocket'),
  NOOP: () => {}
};


/***/ }),

/***/ "./node_modules/ws/lib/event-target.js":
/*!*********************************************!*\
  !*** ./node_modules/ws/lib/event-target.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { kForOnEventAttribute, kListener } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

const kCode = Symbol('kCode');
const kData = Symbol('kData');
const kError = Symbol('kError');
const kMessage = Symbol('kMessage');
const kReason = Symbol('kReason');
const kTarget = Symbol('kTarget');
const kType = Symbol('kType');
const kWasClean = Symbol('kWasClean');

/**
 * Class representing an event.
 */
class Event {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @throws {TypeError} If the `type` argument is not specified
   */
  constructor(type) {
    this[kTarget] = null;
    this[kType] = type;
  }

  /**
   * @type {*}
   */
  get target() {
    return this[kTarget];
  }

  /**
   * @type {String}
   */
  get type() {
    return this[kType];
  }
}

Object.defineProperty(Event.prototype, 'target', { enumerable: true });
Object.defineProperty(Event.prototype, 'type', { enumerable: true });

/**
 * Class representing a close event.
 *
 * @extends Event
 */
class CloseEvent extends Event {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {Number} [options.code=0] The status code explaining why the
   *     connection was closed
   * @param {String} [options.reason=''] A human-readable string explaining why
   *     the connection was closed
   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
   *     connection was cleanly closed
   */
  constructor(type, options = {}) {
    super(type);

    this[kCode] = options.code === undefined ? 0 : options.code;
    this[kReason] = options.reason === undefined ? '' : options.reason;
    this[kWasClean] = options.wasClean === undefined ? false : options.wasClean;
  }

  /**
   * @type {Number}
   */
  get code() {
    return this[kCode];
  }

  /**
   * @type {String}
   */
  get reason() {
    return this[kReason];
  }

  /**
   * @type {Boolean}
   */
  get wasClean() {
    return this[kWasClean];
  }
}

Object.defineProperty(CloseEvent.prototype, 'code', { enumerable: true });
Object.defineProperty(CloseEvent.prototype, 'reason', { enumerable: true });
Object.defineProperty(CloseEvent.prototype, 'wasClean', { enumerable: true });

/**
 * Class representing an error event.
 *
 * @extends Event
 */
class ErrorEvent extends Event {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {*} [options.error=null] The error that generated this event
   * @param {String} [options.message=''] The error message
   */
  constructor(type, options = {}) {
    super(type);

    this[kError] = options.error === undefined ? null : options.error;
    this[kMessage] = options.message === undefined ? '' : options.message;
  }

  /**
   * @type {*}
   */
  get error() {
    return this[kError];
  }

  /**
   * @type {String}
   */
  get message() {
    return this[kMessage];
  }
}

Object.defineProperty(ErrorEvent.prototype, 'error', { enumerable: true });
Object.defineProperty(ErrorEvent.prototype, 'message', { enumerable: true });

/**
 * Class representing a message event.
 *
 * @extends Event
 */
class MessageEvent extends Event {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {*} [options.data=null] The message content
   */
  constructor(type, options = {}) {
    super(type);

    this[kData] = options.data === undefined ? null : options.data;
  }

  /**
   * @type {*}
   */
  get data() {
    return this[kData];
  }
}

Object.defineProperty(MessageEvent.prototype, 'data', { enumerable: true });

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} type A string representing the event type to listen for
   * @param {(Function|Object)} handler The listener to add
   * @param {Object} [options] An options object specifies characteristics about
   *     the event listener
   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
   *     listener should be invoked at most once after being added. If `true`,
   *     the listener would be automatically removed when invoked.
   * @public
   */
  addEventListener(type, handler, options = {}) {
    for (const listener of this.listeners(type)) {
      if (
        !options[kForOnEventAttribute] &&
        listener[kListener] === handler &&
        !listener[kForOnEventAttribute]
      ) {
        return;
      }
    }

    let wrapper;

    if (type === 'message') {
      wrapper = function onMessage(data, isBinary) {
        const event = new MessageEvent('message', {
          data: isBinary ? data : data.toString()
        });

        event[kTarget] = this;
        callListener(handler, this, event);
      };
    } else if (type === 'close') {
      wrapper = function onClose(code, message) {
        const event = new CloseEvent('close', {
          code,
          reason: message.toString(),
          wasClean: this._closeFrameReceived && this._closeFrameSent
        });

        event[kTarget] = this;
        callListener(handler, this, event);
      };
    } else if (type === 'error') {
      wrapper = function onError(error) {
        const event = new ErrorEvent('error', {
          error,
          message: error.message
        });

        event[kTarget] = this;
        callListener(handler, this, event);
      };
    } else if (type === 'open') {
      wrapper = function onOpen() {
        const event = new Event('open');

        event[kTarget] = this;
        callListener(handler, this, event);
      };
    } else {
      return;
    }

    wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
    wrapper[kListener] = handler;

    if (options.once) {
      this.once(type, wrapper);
    } else {
      this.on(type, wrapper);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} type A string representing the event type to remove
   * @param {(Function|Object)} handler The listener to remove
   * @public
   */
  removeEventListener(type, handler) {
    for (const listener of this.listeners(type)) {
      if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
        this.removeListener(type, listener);
        break;
      }
    }
  }
};

module.exports = {
  CloseEvent,
  ErrorEvent,
  Event,
  EventTarget,
  MessageEvent
};

/**
 * Call an event listener
 *
 * @param {(Function|Object)} listener The listener to call
 * @param {*} thisArg The value to use as `this`` when calling the listener
 * @param {Event} event The event to pass to the listener
 * @private
 */
function callListener(listener, thisArg, event) {
  if (typeof listener === 'object' && listener.handleEvent) {
    listener.handleEvent.call(listener, event);
  } else {
    listener.call(thisArg, event);
  }
}


/***/ }),

/***/ "./node_modules/ws/lib/extension.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/extension.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { tokenChars } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");

/**
 * Adds an offer to the map of extension offers or a parameter to the map of
 * parameters.
 *
 * @param {Object} dest The map of extension offers or parameters
 * @param {String} name The extension or parameter name
 * @param {(Object|Boolean|String)} elem The extension parameters or the
 *     parameter value
 * @private
 */
function push(dest, name, elem) {
  if (dest[name] === undefined) dest[name] = [elem];
  else dest[name].push(elem);
}

/**
 * Parses the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} header The field value of the header
 * @return {Object} The parsed object
 * @public
 */
function parse(header) {
  const offers = Object.create(null);
  let params = Object.create(null);
  let mustUnescape = false;
  let isEscaping = false;
  let inQuotes = false;
  let extensionName;
  let paramName;
  let start = -1;
  let code = -1;
  let end = -1;
  let i = 0;

  for (; i < header.length; i++) {
    code = header.charCodeAt(i);

    if (extensionName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (
        i !== 0 &&
        (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
      ) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        const name = header.slice(start, end);
        if (code === 0x2c) {
          push(offers, name, params);
          params = Object.create(null);
        } else {
          extensionName = name;
        }

        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else if (paramName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 || code === 0x09) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        push(params, header.slice(start, end), true);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        start = end = -1;
      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
        paramName = header.slice(start, i);
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else {
      //
      // The value of a quoted-string after unescaping must conform to the
      // token ABNF, so only token characters are valid.
      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
      //
      if (isEscaping) {
        if (tokenChars[code] !== 1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (start === -1) start = i;
        else if (!mustUnescape) mustUnescape = true;
        isEscaping = false;
      } else if (inQuotes) {
        if (tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (code === 0x22 /* '"' */ && start !== -1) {
          inQuotes = false;
          end = i;
        } else if (code === 0x5c /* '\' */) {
          isEscaping = true;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
        inQuotes = true;
      } else if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
        if (end === -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        let value = header.slice(start, end);
        if (mustUnescape) {
          value = value.replace(/\\/g, '');
          mustUnescape = false;
        }
        push(params, paramName, value);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        paramName = undefined;
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    }
  }

  if (start === -1 || inQuotes || code === 0x20 || code === 0x09) {
    throw new SyntaxError('Unexpected end of input');
  }

  if (end === -1) end = i;
  const token = header.slice(start, end);
  if (extensionName === undefined) {
    push(offers, token, params);
  } else {
    if (paramName === undefined) {
      push(params, token, true);
    } else if (mustUnescape) {
      push(params, paramName, token.replace(/\\/g, ''));
    } else {
      push(params, paramName, token);
    }
    push(offers, extensionName, params);
  }

  return offers;
}

/**
 * Builds the `Sec-WebSocket-Extensions` header field value.
 *
 * @param {Object} extensions The map of extensions and parameters to format
 * @return {String} A string representing the given object
 * @public
 */
function format(extensions) {
  return Object.keys(extensions)
    .map((extension) => {
      let configurations = extensions[extension];
      if (!Array.isArray(configurations)) configurations = [configurations];
      return configurations
        .map((params) => {
          return [extension]
            .concat(
              Object.keys(params).map((k) => {
                let values = params[k];
                if (!Array.isArray(values)) values = [values];
                return values
                  .map((v) => (v === true ? k : `${k}=${v}`))
                  .join('; ');
              })
            )
            .join('; ');
        })
        .join(', ');
    })
    .join(', ');
}

module.exports = { format, parse };


/***/ }),

/***/ "./node_modules/ws/lib/limiter.js":
/*!****************************************!*\
  !*** ./node_modules/ws/lib/limiter.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";


const kDone = Symbol('kDone');
const kRun = Symbol('kRun');

/**
 * A very simple job queue with adjustable concurrency. Adapted from
 * https://github.com/STRML/async-limiter
 */
class Limiter {
  /**
   * Creates a new `Limiter`.
   *
   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
   *     to run concurrently
   */
  constructor(concurrency) {
    this[kDone] = () => {
      this.pending--;
      this[kRun]();
    };
    this.concurrency = concurrency || Infinity;
    this.jobs = [];
    this.pending = 0;
  }

  /**
   * Adds a job to the queue.
   *
   * @param {Function} job The job to run
   * @public
   */
  add(job) {
    this.jobs.push(job);
    this[kRun]();
  }

  /**
   * Removes a job from the queue and runs it if possible.
   *
   * @private
   */
  [kRun]() {
    if (this.pending === this.concurrency) return;

    if (this.jobs.length) {
      const job = this.jobs.shift();

      this.pending++;
      job(this[kDone]);
    }
  }
}

module.exports = Limiter;


/***/ }),

/***/ "./node_modules/ws/lib/permessage-deflate.js":
/*!***************************************************!*\
  !*** ./node_modules/ws/lib/permessage-deflate.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const zlib = __webpack_require__(/*! zlib */ "zlib");

const bufferUtil = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");
const Limiter = __webpack_require__(/*! ./limiter */ "./node_modules/ws/lib/limiter.js");
const { kStatusCode } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

const FastBuffer = Buffer[Symbol.species];
const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const kPerMessageDeflate = Symbol('permessage-deflate');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');

//
// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's an issue.
//
let zlibLimiter;

/**
 * permessage-deflate implementation.
 */
class PerMessageDeflate {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} [options] Configuration options
   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
   *     for, or request, a custom client window size
   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
   *     acknowledge disabling of client context takeover
   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
   *     calls to zlib
   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
   *     use of a custom server window size
   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
   *     disabling of server context takeover
   * @param {Number} [options.threshold=1024] Size (in bytes) below which
   *     messages should not be compressed if context takeover is disabled
   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
   *     deflate
   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
   *     inflate
   * @param {Boolean} [isServer=false] Create the instance in either server or
   *     client mode
   * @param {Number} [maxPayload=0] The maximum allowed message length
   */
  constructor(options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold =
      this._options.threshold !== undefined ? this._options.threshold : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency =
        this._options.concurrencyLimit !== undefined
          ? this._options.concurrencyLimit
          : 10;
      zlibLimiter = new Limiter(concurrency);
    }
  }

  /**
   * @type {String}
   */
  static get extensionName() {
    return 'permessage-deflate';
  }

  /**
   * Create an extension negotiation offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer() {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept an extension negotiation offer/response.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Object} Accepted configuration
   * @public
   */
  accept(configurations) {
    configurations = this.normalizeParams(configurations);

    this.params = this._isServer
      ? this.acceptAsServer(configurations)
      : this.acceptAsClient(configurations);

    return this.params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup() {
    if (this._inflate) {
      this._inflate.close();
      this._inflate = null;
    }

    if (this._deflate) {
      const callback = this._deflate[kCallback];

      this._deflate.close();
      this._deflate = null;

      if (callback) {
        callback(
          new Error(
            'The deflate stream was closed while data was being processed'
          )
        );
      }
    }
  }

  /**
   *  Accept an extension negotiation offer.
   *
   * @param {Array} offers The extension negotiation offers
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer(offers) {
    const opts = this._options;
    const accepted = offers.find((params) => {
      if (
        (opts.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (params.server_max_window_bits &&
          (opts.serverMaxWindowBits === false ||
            (typeof opts.serverMaxWindowBits === 'number' &&
              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
        (typeof opts.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return false;
      }

      return true;
    });

    if (!accepted) {
      throw new Error('None of the extension offers can be accepted');
    }

    if (opts.serverNoContextTakeover) {
      accepted.server_no_context_takeover = true;
    }
    if (opts.clientNoContextTakeover) {
      accepted.client_no_context_takeover = true;
    }
    if (typeof opts.serverMaxWindowBits === 'number') {
      accepted.server_max_window_bits = opts.serverMaxWindowBits;
    }
    if (typeof opts.clientMaxWindowBits === 'number') {
      accepted.client_max_window_bits = opts.clientMaxWindowBits;
    } else if (
      accepted.client_max_window_bits === true ||
      opts.clientMaxWindowBits === false
    ) {
      delete accepted.client_max_window_bits;
    }

    return accepted;
  }

  /**
   * Accept the extension negotiation response.
   *
   * @param {Array} response The extension negotiation response
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient(response) {
    const params = response[0];

    if (
      this._options.clientNoContextTakeover === false &&
      params.client_no_context_takeover
    ) {
      throw new Error('Unexpected parameter "client_no_context_takeover"');
    }

    if (!params.client_max_window_bits) {
      if (typeof this._options.clientMaxWindowBits === 'number') {
        params.client_max_window_bits = this._options.clientMaxWindowBits;
      }
    } else if (
      this._options.clientMaxWindowBits === false ||
      (typeof this._options.clientMaxWindowBits === 'number' &&
        params.client_max_window_bits > this._options.clientMaxWindowBits)
    ) {
      throw new Error(
        'Unexpected or invalid parameter "client_max_window_bits"'
      );
    }

    return params;
  }

  /**
   * Normalize parameters.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Array} The offers/response with normalized parameters
   * @private
   */
  normalizeParams(configurations) {
    configurations.forEach((params) => {
      Object.keys(params).forEach((key) => {
        let value = params[key];

        if (value.length > 1) {
          throw new Error(`Parameter "${key}" must have only a single value`);
        }

        value = value[0];

        if (key === 'client_max_window_bits') {
          if (value !== true) {
            const num = +value;
            if (!Number.isInteger(num) || num < 8 || num > 15) {
              throw new TypeError(
                `Invalid value for parameter "${key}": ${value}`
              );
            }
            value = num;
          } else if (!this._isServer) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else if (key === 'server_max_window_bits') {
          const num = +value;
          if (!Number.isInteger(num) || num < 8 || num > 15) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
          value = num;
        } else if (
          key === 'client_no_context_takeover' ||
          key === 'server_no_context_takeover'
        ) {
          if (value !== true) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else {
          throw new Error(`Unknown parameter "${key}"`);
        }

        params[key] = value;
      });
    });

    return configurations;
  }

  /**
   * Decompress data. Concurrency limited.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited.
   *
   * @param {(Buffer|String)} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress(data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._inflate = zlib.createInflateRaw({
        ...this._options.zlibInflateOptions,
        windowBits
      });
      this._inflate[kPerMessageDeflate] = this;
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = bufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (this._inflate._readableState.endEmitted) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];

        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
          this._inflate.reset();
        }
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {(Buffer|String)} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress(data, fin, callback) {
    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        ...this._options.zlibDeflateOptions,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kCallback] = callback;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      if (!this._deflate) {
        //
        // The deflate stream was closed while data was being processed.
        //
        return;
      }

      let data = bufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) {
        data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
      }

      //
      // Ensure that the callback will not be called again in
      // `PerMessageDeflate#cleanup()`.
      //
      this._deflate[kCallback] = null;

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
        this._deflate.reset();
      }

      callback(null, data);
    });
  }
}

module.exports = PerMessageDeflate;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData(chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData(chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kPerMessageDeflate]._maxPayload < 1 ||
    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError] = new RangeError('Max payload size exceeded');
  this[kError].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
  this[kError][kStatusCode] = 1009;
  this.removeListener('data', inflateOnData);

  //
  // The choice to employ `zlib.reset()` over `zlib.close()` is dictated by the
  // fact that in Node.js versions prior to 13.10.0, the callback for
  // `zlib.flush()` is not called if `zlib.close()` is used. Utilizing
  // `zlib.reset()` ensures that either the callback is invoked or an error is
  // emitted.
  //
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError(err) {
  //
  // There is no need to call `Zlib#close()` as the handle is automatically
  // closed when an error is emitted.
  //
  this[kPerMessageDeflate]._inflate = null;

  if (this[kError]) {
    this[kCallback](this[kError]);
    return;
  }

  err[kStatusCode] = 1007;
  this[kCallback](err);
}


/***/ }),

/***/ "./node_modules/ws/lib/receiver.js":
/*!*****************************************!*\
  !*** ./node_modules/ws/lib/receiver.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { Writable } = __webpack_require__(/*! stream */ "stream");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  kStatusCode,
  kWebSocket
} = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const { concat, toArrayBuffer, unmask } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");
const { isValidStatusCode, isValidUTF8 } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");

const FastBuffer = Buffer[Symbol.species];

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;
const DEFER_EVENT = 6;

/**
 * HyBi Receiver implementation.
 *
 * @extends Writable
 */
class Receiver extends Writable {
  /**
   * Creates a Receiver instance.
   *
   * @param {Object} [options] Options object
   * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
   *     multiple times in the same tick
   * @param {String} [options.binaryType=nodebuffer] The type for binary data
   * @param {Object} [options.extensions] An object containing the negotiated
   *     extensions
   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
   *     client or server mode
   * @param {Number} [options.maxPayload=0] The maximum allowed message length
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   */
  constructor(options = {}) {
    super();

    this._allowSynchronousEvents =
      options.allowSynchronousEvents !== undefined
        ? options.allowSynchronousEvents
        : true;
    this._binaryType = options.binaryType || BINARY_TYPES[0];
    this._extensions = options.extensions || {};
    this._isServer = !!options.isServer;
    this._maxPayload = options.maxPayload | 0;
    this._skipUTF8Validation = !!options.skipUTF8Validation;
    this[kWebSocket] = undefined;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._mask = undefined;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._errored = false;
    this._loop = false;
    this._state = GET_INFO;
  }

  /**
   * Implements `Writable.prototype._write()`.
   *
   * @param {Buffer} chunk The chunk of data to write
   * @param {String} encoding The character encoding of `chunk`
   * @param {Function} cb Callback
   * @private
   */
  _write(chunk, encoding, cb) {
    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

    this._bufferedBytes += chunk.length;
    this._buffers.push(chunk);
    this.startLoop(cb);
  }

  /**
   * Consumes `n` bytes from the buffered data.
   *
   * @param {Number} n The number of bytes to consume
   * @return {Buffer} The consumed bytes
   * @private
   */
  consume(n) {
    this._bufferedBytes -= n;

    if (n === this._buffers[0].length) return this._buffers.shift();

    if (n < this._buffers[0].length) {
      const buf = this._buffers[0];
      this._buffers[0] = new FastBuffer(
        buf.buffer,
        buf.byteOffset + n,
        buf.length - n
      );

      return new FastBuffer(buf.buffer, buf.byteOffset, n);
    }

    const dst = Buffer.allocUnsafe(n);

    do {
      const buf = this._buffers[0];
      const offset = dst.length - n;

      if (n >= buf.length) {
        dst.set(this._buffers.shift(), offset);
      } else {
        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
        this._buffers[0] = new FastBuffer(
          buf.buffer,
          buf.byteOffset + n,
          buf.length - n
        );
      }

      n -= buf.length;
    } while (n > 0);

    return dst;
  }

  /**
   * Starts the parsing loop.
   *
   * @param {Function} cb Callback
   * @private
   */
  startLoop(cb) {
    this._loop = true;

    do {
      switch (this._state) {
        case GET_INFO:
          this.getInfo(cb);
          break;
        case GET_PAYLOAD_LENGTH_16:
          this.getPayloadLength16(cb);
          break;
        case GET_PAYLOAD_LENGTH_64:
          this.getPayloadLength64(cb);
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          this.getData(cb);
          break;
        case INFLATING:
        case DEFER_EVENT:
          this._loop = false;
          return;
      }
    } while (this._loop);

    if (!this._errored) cb();
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @param {Function} cb Callback
   * @private
   */
  getInfo(cb) {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    const buf = this.consume(2);

    if ((buf[0] & 0x30) !== 0x00) {
      const error = this.createError(
        RangeError,
        'RSV2 and RSV3 must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_RSV_2_3'
      );

      cb(error);
      return;
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
      const error = this.createError(
        RangeError,
        'RSV1 must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_RSV_1'
      );

      cb(error);
      return;
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        const error = this.createError(
          RangeError,
          'RSV1 must be clear',
          true,
          1002,
          'WS_ERR_UNEXPECTED_RSV_1'
        );

        cb(error);
        return;
      }

      if (!this._fragmented) {
        const error = this.createError(
          RangeError,
          'invalid opcode 0',
          true,
          1002,
          'WS_ERR_INVALID_OPCODE'
        );

        cb(error);
        return;
      }

      this._opcode = this._fragmented;
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        const error = this.createError(
          RangeError,
          `invalid opcode ${this._opcode}`,
          true,
          1002,
          'WS_ERR_INVALID_OPCODE'
        );

        cb(error);
        return;
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        const error = this.createError(
          RangeError,
          'FIN must be set',
          true,
          1002,
          'WS_ERR_EXPECTED_FIN'
        );

        cb(error);
        return;
      }

      if (compressed) {
        const error = this.createError(
          RangeError,
          'RSV1 must be clear',
          true,
          1002,
          'WS_ERR_UNEXPECTED_RSV_1'
        );

        cb(error);
        return;
      }

      if (
        this._payloadLength > 0x7d ||
        (this._opcode === 0x08 && this._payloadLength === 1)
      ) {
        const error = this.createError(
          RangeError,
          `invalid payload length ${this._payloadLength}`,
          true,
          1002,
          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
        );

        cb(error);
        return;
      }
    } else {
      const error = this.createError(
        RangeError,
        `invalid opcode ${this._opcode}`,
        true,
        1002,
        'WS_ERR_INVALID_OPCODE'
      );

      cb(error);
      return;
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._isServer) {
      if (!this._masked) {
        const error = this.createError(
          RangeError,
          'MASK must be set',
          true,
          1002,
          'WS_ERR_EXPECTED_MASK'
        );

        cb(error);
        return;
      }
    } else if (this._masked) {
      const error = this.createError(
        RangeError,
        'MASK must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_MASK'
      );

      cb(error);
      return;
    }

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else this.haveLength(cb);
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @param {Function} cb Callback
   * @private
   */
  getPayloadLength16(cb) {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    this._payloadLength = this.consume(2).readUInt16BE(0);
    this.haveLength(cb);
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @param {Function} cb Callback
   * @private
   */
  getPayloadLength64(cb) {
    if (this._bufferedBytes < 8) {
      this._loop = false;
      return;
    }

    const buf = this.consume(8);
    const num = buf.readUInt32BE(0);

    //
    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
    // if payload length is greater than this number.
    //
    if (num > Math.pow(2, 53 - 32) - 1) {
      const error = this.createError(
        RangeError,
        'Unsupported WebSocket frame: payload length > 2^53 - 1',
        false,
        1009,
        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
      );

      cb(error);
      return;
    }

    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
    this.haveLength(cb);
  }

  /**
   * Payload length has been read.
   *
   * @param {Function} cb Callback
   * @private
   */
  haveLength(cb) {
    if (this._payloadLength && this._opcode < 0x08) {
      this._totalPayloadLength += this._payloadLength;
      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
        const error = this.createError(
          RangeError,
          'Max payload size exceeded',
          false,
          1009,
          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
        );

        cb(error);
        return;
      }
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask() {
    if (this._bufferedBytes < 4) {
      this._loop = false;
      return;
    }

    this._mask = this.consume(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @param {Function} cb Callback
   * @private
   */
  getData(cb) {
    let data = EMPTY_BUFFER;

    if (this._payloadLength) {
      if (this._bufferedBytes < this._payloadLength) {
        this._loop = false;
        return;
      }

      data = this.consume(this._payloadLength);

      if (
        this._masked &&
        (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0
      ) {
        unmask(data, this._mask);
      }
    }

    if (this._opcode > 0x07) {
      this.controlMessage(data, cb);
      return;
    }

    if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data, cb);
      return;
    }

    if (data.length) {
      //
      // This message is not compressed so its length is the sum of the payload
      // length of all fragments.
      //
      this._messageLength = this._totalPayloadLength;
      this._fragments.push(data);
    }

    this.dataMessage(cb);
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @param {Function} cb Callback
   * @private
   */
  decompress(data, cb) {
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) return cb(err);

      if (buf.length) {
        this._messageLength += buf.length;
        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
          const error = this.createError(
            RangeError,
            'Max payload size exceeded',
            false,
            1009,
            'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
          );

          cb(error);
          return;
        }

        this._fragments.push(buf);
      }

      this.dataMessage(cb);
      if (this._state === GET_INFO) this.startLoop(cb);
    });
  }

  /**
   * Handles a data message.
   *
   * @param {Function} cb Callback
   * @private
   */
  dataMessage(cb) {
    if (!this._fin) {
      this._state = GET_INFO;
      return;
    }

    const messageLength = this._messageLength;
    const fragments = this._fragments;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragmented = 0;
    this._fragments = [];

    if (this._opcode === 2) {
      let data;

      if (this._binaryType === 'nodebuffer') {
        data = concat(fragments, messageLength);
      } else if (this._binaryType === 'arraybuffer') {
        data = toArrayBuffer(concat(fragments, messageLength));
      } else if (this._binaryType === 'blob') {
        data = new Blob(fragments);
      } else {
        data = fragments;
      }

      if (this._allowSynchronousEvents) {
        this.emit('message', data, true);
        this._state = GET_INFO;
      } else {
        this._state = DEFER_EVENT;
        setImmediate(() => {
          this.emit('message', data, true);
          this._state = GET_INFO;
          this.startLoop(cb);
        });
      }
    } else {
      const buf = concat(fragments, messageLength);

      if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
        const error = this.createError(
          Error,
          'invalid UTF-8 sequence',
          true,
          1007,
          'WS_ERR_INVALID_UTF8'
        );

        cb(error);
        return;
      }

      if (this._state === INFLATING || this._allowSynchronousEvents) {
        this.emit('message', buf, false);
        this._state = GET_INFO;
      } else {
        this._state = DEFER_EVENT;
        setImmediate(() => {
          this.emit('message', buf, false);
          this._state = GET_INFO;
          this.startLoop(cb);
        });
      }
    }
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  controlMessage(data, cb) {
    if (this._opcode === 0x08) {
      if (data.length === 0) {
        this._loop = false;
        this.emit('conclude', 1005, EMPTY_BUFFER);
        this.end();
      } else {
        const code = data.readUInt16BE(0);

        if (!isValidStatusCode(code)) {
          const error = this.createError(
            RangeError,
            `invalid status code ${code}`,
            true,
            1002,
            'WS_ERR_INVALID_CLOSE_CODE'
          );

          cb(error);
          return;
        }

        const buf = new FastBuffer(
          data.buffer,
          data.byteOffset + 2,
          data.length - 2
        );

        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
          const error = this.createError(
            Error,
            'invalid UTF-8 sequence',
            true,
            1007,
            'WS_ERR_INVALID_UTF8'
          );

          cb(error);
          return;
        }

        this._loop = false;
        this.emit('conclude', code, buf);
        this.end();
      }

      this._state = GET_INFO;
      return;
    }

    if (this._allowSynchronousEvents) {
      this.emit(this._opcode === 0x09 ? 'ping' : 'pong', data);
      this._state = GET_INFO;
    } else {
      this._state = DEFER_EVENT;
      setImmediate(() => {
        this.emit(this._opcode === 0x09 ? 'ping' : 'pong', data);
        this._state = GET_INFO;
        this.startLoop(cb);
      });
    }
  }

  /**
   * Builds an error object.
   *
   * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
   * @param {String} message The error message
   * @param {Boolean} prefix Specifies whether or not to add a default prefix to
   *     `message`
   * @param {Number} statusCode The status code
   * @param {String} errorCode The exposed error code
   * @return {(Error|RangeError)} The error
   * @private
   */
  createError(ErrorCtor, message, prefix, statusCode, errorCode) {
    this._loop = false;
    this._errored = true;

    const err = new ErrorCtor(
      prefix ? `Invalid WebSocket frame: ${message}` : message
    );

    Error.captureStackTrace(err, this.createError);
    err.code = errorCode;
    err[kStatusCode] = statusCode;
    return err;
  }
}

module.exports = Receiver;


/***/ }),

/***/ "./node_modules/ws/lib/sender.js":
/*!***************************************!*\
  !*** ./node_modules/ws/lib/sender.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex" }] */



const { Duplex } = __webpack_require__(/*! stream */ "stream");
const { randomFillSync } = __webpack_require__(/*! crypto */ "crypto");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const { EMPTY_BUFFER, kWebSocket, NOOP } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const { isBlob, isValidStatusCode } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");
const { mask: applyMask, toBuffer } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");

const kByteLength = Symbol('kByteLength');
const maskBuffer = Buffer.alloc(4);
const RANDOM_POOL_SIZE = 8 * 1024;
let randomPool;
let randomPoolPointer = RANDOM_POOL_SIZE;

const DEFAULT = 0;
const DEFLATING = 1;
const GET_BLOB_DATA = 2;

/**
 * HyBi Sender implementation.
 */
class Sender {
  /**
   * Creates a Sender instance.
   *
   * @param {Duplex} socket The connection socket
   * @param {Object} [extensions] An object containing the negotiated extensions
   * @param {Function} [generateMask] The function used to generate the masking
   *     key
   */
  constructor(socket, extensions, generateMask) {
    this._extensions = extensions || {};

    if (generateMask) {
      this._generateMask = generateMask;
      this._maskBuffer = Buffer.alloc(4);
    }

    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._queue = [];
    this._state = DEFAULT;
    this.onerror = NOOP;
    this[kWebSocket] = undefined;
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {(Buffer|String)} data The data to frame
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @return {(Buffer|String)[]} The framed data
   * @public
   */
  static frame(data, options) {
    let mask;
    let merge = false;
    let offset = 2;
    let skipMasking = false;

    if (options.mask) {
      mask = options.maskBuffer || maskBuffer;

      if (options.generateMask) {
        options.generateMask(mask);
      } else {
        if (randomPoolPointer === RANDOM_POOL_SIZE) {
          /* istanbul ignore else  */
          if (randomPool === undefined) {
            //
            // This is lazily initialized because server-sent frames must not
            // be masked so it may never be used.
            //
            randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
          }

          randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
          randomPoolPointer = 0;
        }

        mask[0] = randomPool[randomPoolPointer++];
        mask[1] = randomPool[randomPoolPointer++];
        mask[2] = randomPool[randomPoolPointer++];
        mask[3] = randomPool[randomPoolPointer++];
      }

      skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
      offset = 6;
    }

    let dataLength;

    if (typeof data === 'string') {
      if (
        (!options.mask || skipMasking) &&
        options[kByteLength] !== undefined
      ) {
        dataLength = options[kByteLength];
      } else {
        data = Buffer.from(data);
        dataLength = data.length;
      }
    } else {
      dataLength = data.length;
      merge = options.mask && options.readOnly && !skipMasking;
    }

    let payloadLength = dataLength;

    if (dataLength >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (dataLength > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    target[1] = payloadLength;

    if (payloadLength === 126) {
      target.writeUInt16BE(dataLength, 2);
    } else if (payloadLength === 127) {
      target[2] = target[3] = 0;
      target.writeUIntBE(dataLength, 4, 6);
    }

    if (!options.mask) return [target, data];

    target[1] |= 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (skipMasking) return [target, data];

    if (merge) {
      applyMask(data, mask, target, offset, dataLength);
      return [target];
    }

    applyMask(data, mask, data, 0, dataLength);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {Number} [code] The status code component of the body
   * @param {(String|Buffer)} [data] The message component of the body
   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
   * @param {Function} [cb] Callback
   * @public
   */
  close(code, data, mask, cb) {
    let buf;

    if (code === undefined) {
      buf = EMPTY_BUFFER;
    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
      throw new TypeError('First argument must be a valid error code number');
    } else if (data === undefined || !data.length) {
      buf = Buffer.allocUnsafe(2);
      buf.writeUInt16BE(code, 0);
    } else {
      const length = Buffer.byteLength(data);

      if (length > 123) {
        throw new RangeError('The message must not be greater than 123 bytes');
      }

      buf = Buffer.allocUnsafe(2 + length);
      buf.writeUInt16BE(code, 0);

      if (typeof data === 'string') {
        buf.write(data, 2);
      } else {
        buf.set(data, 2);
      }
    }

    const options = {
      [kByteLength]: buf.length,
      fin: true,
      generateMask: this._generateMask,
      mask,
      maskBuffer: this._maskBuffer,
      opcode: 0x08,
      readOnly: false,
      rsv1: false
    };

    if (this._state !== DEFAULT) {
      this.enqueue([this.dispatch, buf, false, options, cb]);
    } else {
      this.sendFrame(Sender.frame(buf, options), cb);
    }
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  ping(data, mask, cb) {
    let byteLength;
    let readOnly;

    if (typeof data === 'string') {
      byteLength = Buffer.byteLength(data);
      readOnly = false;
    } else if (isBlob(data)) {
      byteLength = data.size;
      readOnly = false;
    } else {
      data = toBuffer(data);
      byteLength = data.length;
      readOnly = toBuffer.readOnly;
    }

    if (byteLength > 125) {
      throw new RangeError('The data size must not be greater than 125 bytes');
    }

    const options = {
      [kByteLength]: byteLength,
      fin: true,
      generateMask: this._generateMask,
      mask,
      maskBuffer: this._maskBuffer,
      opcode: 0x09,
      readOnly,
      rsv1: false
    };

    if (isBlob(data)) {
      if (this._state !== DEFAULT) {
        this.enqueue([this.getBlobData, data, false, options, cb]);
      } else {
        this.getBlobData(data, false, options, cb);
      }
    } else if (this._state !== DEFAULT) {
      this.enqueue([this.dispatch, data, false, options, cb]);
    } else {
      this.sendFrame(Sender.frame(data, options), cb);
    }
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  pong(data, mask, cb) {
    let byteLength;
    let readOnly;

    if (typeof data === 'string') {
      byteLength = Buffer.byteLength(data);
      readOnly = false;
    } else if (isBlob(data)) {
      byteLength = data.size;
      readOnly = false;
    } else {
      data = toBuffer(data);
      byteLength = data.length;
      readOnly = toBuffer.readOnly;
    }

    if (byteLength > 125) {
      throw new RangeError('The data size must not be greater than 125 bytes');
    }

    const options = {
      [kByteLength]: byteLength,
      fin: true,
      generateMask: this._generateMask,
      mask,
      maskBuffer: this._maskBuffer,
      opcode: 0x0a,
      readOnly,
      rsv1: false
    };

    if (isBlob(data)) {
      if (this._state !== DEFAULT) {
        this.enqueue([this.getBlobData, data, false, options, cb]);
      } else {
        this.getBlobData(data, false, options, cb);
      }
    } else if (this._state !== DEFAULT) {
      this.enqueue([this.dispatch, data, false, options, cb]);
    } else {
      this.sendFrame(Sender.frame(data, options), cb);
    }
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
   *     or text
   * @param {Boolean} [options.compress=false] Specifies whether or not to
   *     compress `data`
   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Function} [cb] Callback
   * @public
   */
  send(data, options, cb) {
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
    let opcode = options.binary ? 2 : 1;
    let rsv1 = options.compress;

    let byteLength;
    let readOnly;

    if (typeof data === 'string') {
      byteLength = Buffer.byteLength(data);
      readOnly = false;
    } else if (isBlob(data)) {
      byteLength = data.size;
      readOnly = false;
    } else {
      data = toBuffer(data);
      byteLength = data.length;
      readOnly = toBuffer.readOnly;
    }

    if (this._firstFragment) {
      this._firstFragment = false;
      if (
        rsv1 &&
        perMessageDeflate &&
        perMessageDeflate.params[
          perMessageDeflate._isServer
            ? 'server_no_context_takeover'
            : 'client_no_context_takeover'
        ]
      ) {
        rsv1 = byteLength >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    const opts = {
      [kByteLength]: byteLength,
      fin: options.fin,
      generateMask: this._generateMask,
      mask: options.mask,
      maskBuffer: this._maskBuffer,
      opcode,
      readOnly,
      rsv1
    };

    if (isBlob(data)) {
      if (this._state !== DEFAULT) {
        this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
      } else {
        this.getBlobData(data, this._compress, opts, cb);
      }
    } else if (this._state !== DEFAULT) {
      this.enqueue([this.dispatch, data, this._compress, opts, cb]);
    } else {
      this.dispatch(data, this._compress, opts, cb);
    }
  }

  /**
   * Gets the contents of a blob as binary data.
   *
   * @param {Blob} blob The blob
   * @param {Boolean} [compress=false] Specifies whether or not to compress
   *     the data
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @param {Function} [cb] Callback
   * @private
   */
  getBlobData(blob, compress, options, cb) {
    this._bufferedBytes += options[kByteLength];
    this._state = GET_BLOB_DATA;

    blob
      .arrayBuffer()
      .then((arrayBuffer) => {
        if (this._socket.destroyed) {
          const err = new Error(
            'The socket was closed while the blob was being read'
          );

          //
          // `callCallbacks` is called in the next tick to ensure that errors
          // that might be thrown in the callbacks behave like errors thrown
          // outside the promise chain.
          //
          process.nextTick(callCallbacks, this, err, cb);
          return;
        }

        this._bufferedBytes -= options[kByteLength];
        const data = toBuffer(arrayBuffer);

        if (!compress) {
          this._state = DEFAULT;
          this.sendFrame(Sender.frame(data, options), cb);
          this.dequeue();
        } else {
          this.dispatch(data, compress, options, cb);
        }
      })
      .catch((err) => {
        //
        // `onError` is called in the next tick for the same reason that
        // `callCallbacks` above is.
        //
        process.nextTick(onError, this, err, cb);
      });
  }

  /**
   * Dispatches a message.
   *
   * @param {(Buffer|String)} data The message to send
   * @param {Boolean} [compress=false] Specifies whether or not to compress
   *     `data`
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @param {Function} [cb] Callback
   * @private
   */
  dispatch(data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    this._bufferedBytes += options[kByteLength];
    this._state = DEFLATING;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      if (this._socket.destroyed) {
        const err = new Error(
          'The socket was closed while data was being compressed'
        );

        callCallbacks(this, err, cb);
        return;
      }

      this._bufferedBytes -= options[kByteLength];
      this._state = DEFAULT;
      options.readOnly = false;
      this.sendFrame(Sender.frame(buf, options), cb);
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue() {
    while (this._state === DEFAULT && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[3][kByteLength];
      Reflect.apply(params[0], this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue(params) {
    this._bufferedBytes += params[3][kByteLength];
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {(Buffer | String)[]} list The frame to send
   * @param {Function} [cb] Callback
   * @private
   */
  sendFrame(list, cb) {
    if (list.length === 2) {
      this._socket.cork();
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
      this._socket.uncork();
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

module.exports = Sender;

/**
 * Calls queued callbacks with an error.
 *
 * @param {Sender} sender The `Sender` instance
 * @param {Error} err The error to call the callbacks with
 * @param {Function} [cb] The first callback
 * @private
 */
function callCallbacks(sender, err, cb) {
  if (typeof cb === 'function') cb(err);

  for (let i = 0; i < sender._queue.length; i++) {
    const params = sender._queue[i];
    const callback = params[params.length - 1];

    if (typeof callback === 'function') callback(err);
  }
}

/**
 * Handles a `Sender` error.
 *
 * @param {Sender} sender The `Sender` instance
 * @param {Error} err The error
 * @param {Function} [cb] The first pending callback
 * @private
 */
function onError(sender, err, cb) {
  callCallbacks(sender, err, cb);
  sender.onerror(err);
}


/***/ }),

/***/ "./node_modules/ws/lib/stream.js":
/*!***************************************!*\
  !*** ./node_modules/ws/lib/stream.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^WebSocket$" }] */


const WebSocket = __webpack_require__(/*! ./websocket */ "./node_modules/ws/lib/websocket.js");
const { Duplex } = __webpack_require__(/*! stream */ "stream");

/**
 * Emits the `'close'` event on a stream.
 *
 * @param {Duplex} stream The stream.
 * @private
 */
function emitClose(stream) {
  stream.emit('close');
}

/**
 * The listener of the `'end'` event.
 *
 * @private
 */
function duplexOnEnd() {
  if (!this.destroyed && this._writableState.finished) {
    this.destroy();
  }
}

/**
 * The listener of the `'error'` event.
 *
 * @param {Error} err The error
 * @private
 */
function duplexOnError(err) {
  this.removeListener('error', duplexOnError);
  this.destroy();
  if (this.listenerCount('error') === 0) {
    // Do not suppress the throwing behavior.
    this.emit('error', err);
  }
}

/**
 * Wraps a `WebSocket` in a duplex stream.
 *
 * @param {WebSocket} ws The `WebSocket` to wrap
 * @param {Object} [options] The options for the `Duplex` constructor
 * @return {Duplex} The duplex stream
 * @public
 */
function createWebSocketStream(ws, options) {
  let terminateOnDestroy = true;

  const duplex = new Duplex({
    ...options,
    autoDestroy: false,
    emitClose: false,
    objectMode: false,
    writableObjectMode: false
  });

  ws.on('message', function message(msg, isBinary) {
    const data =
      !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;

    if (!duplex.push(data)) ws.pause();
  });

  ws.once('error', function error(err) {
    if (duplex.destroyed) return;

    // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
    //
    // - If the `'error'` event is emitted before the `'open'` event, then
    //   `ws.terminate()` is a noop as no socket is assigned.
    // - Otherwise, the error is re-emitted by the listener of the `'error'`
    //   event of the `Receiver` object. The listener already closes the
    //   connection by calling `ws.close()`. This allows a close frame to be
    //   sent to the other peer. If `ws.terminate()` is called right after this,
    //   then the close frame might not be sent.
    terminateOnDestroy = false;
    duplex.destroy(err);
  });

  ws.once('close', function close() {
    if (duplex.destroyed) return;

    duplex.push(null);
  });

  duplex._destroy = function (err, callback) {
    if (ws.readyState === ws.CLOSED) {
      callback(err);
      process.nextTick(emitClose, duplex);
      return;
    }

    let called = false;

    ws.once('error', function error(err) {
      called = true;
      callback(err);
    });

    ws.once('close', function close() {
      if (!called) callback(err);
      process.nextTick(emitClose, duplex);
    });

    if (terminateOnDestroy) ws.terminate();
  };

  duplex._final = function (callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._final(callback);
      });
      return;
    }

    // If the value of the `_socket` property is `null` it means that `ws` is a
    // client websocket and the handshake failed. In fact, when this happens, a
    // socket is never assigned to the websocket. Wait for the `'error'` event
    // that will be emitted by the websocket.
    if (ws._socket === null) return;

    if (ws._socket._writableState.finished) {
      callback();
      if (duplex._readableState.endEmitted) duplex.destroy();
    } else {
      ws._socket.once('finish', function finish() {
        // `duplex` is not destroyed here because the `'end'` event will be
        // emitted on `duplex` after this `'finish'` event. The EOF signaling
        // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
        callback();
      });
      ws.close();
    }
  };

  duplex._read = function () {
    if (ws.isPaused) ws.resume();
  };

  duplex._write = function (chunk, encoding, callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._write(chunk, encoding, callback);
      });
      return;
    }

    ws.send(chunk, callback);
  };

  duplex.on('end', duplexOnEnd);
  duplex.on('error', duplexOnError);
  return duplex;
}

module.exports = createWebSocketStream;


/***/ }),

/***/ "./node_modules/ws/lib/subprotocol.js":
/*!********************************************!*\
  !*** ./node_modules/ws/lib/subprotocol.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { tokenChars } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");

/**
 * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
 *
 * @param {String} header The field value of the header
 * @return {Set} The subprotocol names
 * @public
 */
function parse(header) {
  const protocols = new Set();
  let start = -1;
  let end = -1;
  let i = 0;

  for (i; i < header.length; i++) {
    const code = header.charCodeAt(i);

    if (end === -1 && tokenChars[code] === 1) {
      if (start === -1) start = i;
    } else if (
      i !== 0 &&
      (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
    ) {
      if (end === -1 && start !== -1) end = i;
    } else if (code === 0x2c /* ',' */) {
      if (start === -1) {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }

      if (end === -1) end = i;

      const protocol = header.slice(start, end);

      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }

      protocols.add(protocol);
      start = end = -1;
    } else {
      throw new SyntaxError(`Unexpected character at index ${i}`);
    }
  }

  if (start === -1 || end !== -1) {
    throw new SyntaxError('Unexpected end of input');
  }

  const protocol = header.slice(start, i);

  if (protocols.has(protocol)) {
    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
  }

  protocols.add(protocol);
  return protocols;
}

module.exports = { parse };


/***/ }),

/***/ "./node_modules/ws/lib/validation.js":
/*!*******************************************!*\
  !*** ./node_modules/ws/lib/validation.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { isUtf8 } = __webpack_require__(/*! buffer */ "buffer");

const { hasBlob } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

//
// Allowed token characters:
//
// '!', '#', '$', '%', '&', ''', '*', '+', '-',
// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
//
// tokenChars[32] === 0 // ' '
// tokenChars[33] === 1 // '!'
// tokenChars[34] === 0 // '"'
// ...
//
// prettier-ignore
const tokenChars = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

/**
 * Checks if a status code is allowed in a close frame.
 *
 * @param {Number} code The status code
 * @return {Boolean} `true` if the status code is valid, else `false`
 * @public
 */
function isValidStatusCode(code) {
  return (
    (code >= 1000 &&
      code <= 1014 &&
      code !== 1004 &&
      code !== 1005 &&
      code !== 1006) ||
    (code >= 3000 && code <= 4999)
  );
}

/**
 * Checks if a given buffer contains only correct UTF-8.
 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
 * Markus Kuhn.
 *
 * @param {Buffer} buf The buffer to check
 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
 * @public
 */
function _isValidUTF8(buf) {
  const len = buf.length;
  let i = 0;

  while (i < len) {
    if ((buf[i] & 0x80) === 0) {
      // 0xxxxxxx
      i++;
    } else if ((buf[i] & 0xe0) === 0xc0) {
      // 110xxxxx 10xxxxxx
      if (
        i + 1 === len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i] & 0xfe) === 0xc0 // Overlong
      ) {
        return false;
      }

      i += 2;
    } else if ((buf[i] & 0xf0) === 0xe0) {
      // 1110xxxx 10xxxxxx 10xxxxxx
      if (
        i + 2 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
      ) {
        return false;
      }

      i += 3;
    } else if ((buf[i] & 0xf8) === 0xf0) {
      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        i + 3 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i + 3] & 0xc0) !== 0x80 ||
        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
        buf[i] > 0xf4 // > U+10FFFF
      ) {
        return false;
      }

      i += 4;
    } else {
      return false;
    }
  }

  return true;
}

/**
 * Determines whether a value is a `Blob`.
 *
 * @param {*} value The value to be tested
 * @return {Boolean} `true` if `value` is a `Blob`, else `false`
 * @private
 */
function isBlob(value) {
  return (
    hasBlob &&
    typeof value === 'object' &&
    typeof value.arrayBuffer === 'function' &&
    typeof value.type === 'string' &&
    typeof value.stream === 'function' &&
    (value[Symbol.toStringTag] === 'Blob' ||
      value[Symbol.toStringTag] === 'File')
  );
}

module.exports = {
  isBlob,
  isValidStatusCode,
  isValidUTF8: _isValidUTF8,
  tokenChars
};

if (isUtf8) {
  module.exports.isValidUTF8 = function (buf) {
    return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
  };
} /* istanbul ignore else  */ else if (!process.env.WS_NO_UTF_8_VALIDATE) {
  try {
    const isValidUTF8 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'utf-8-validate'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

    module.exports.isValidUTF8 = function (buf) {
      return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
    };
  } catch (e) {
    // Continue regardless of the error.
  }
}


/***/ }),

/***/ "./node_modules/ws/lib/websocket-server.js":
/*!*************************************************!*\
  !*** ./node_modules/ws/lib/websocket-server.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex$", "caughtErrors": "none" }] */



const EventEmitter = __webpack_require__(/*! events */ "events");
const http = __webpack_require__(/*! http */ "http");
const { Duplex } = __webpack_require__(/*! stream */ "stream");
const { createHash } = __webpack_require__(/*! crypto */ "crypto");

const extension = __webpack_require__(/*! ./extension */ "./node_modules/ws/lib/extension.js");
const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const subprotocol = __webpack_require__(/*! ./subprotocol */ "./node_modules/ws/lib/subprotocol.js");
const WebSocket = __webpack_require__(/*! ./websocket */ "./node_modules/ws/lib/websocket.js");
const { GUID, kWebSocket } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

const RUNNING = 0;
const CLOSING = 1;
const CLOSED = 2;

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
   *     multiple times in the same tick
   * @param {Boolean} [options.autoPong=true] Specifies whether or not to
   *     automatically send a pong in response to a ping
   * @param {Number} [options.backlog=511] The maximum length of the queue of
   *     pending connections
   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
   *     track clients
   * @param {Function} [options.handleProtocols] A hook to handle protocols
   * @param {String} [options.host] The hostname where to bind the server
   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
   *     size
   * @param {Boolean} [options.noServer=false] Enable no server mode
   * @param {String} [options.path] Accept only connections matching this path
   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
   *     permessage-deflate
   * @param {Number} [options.port] The port where to bind the server
   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
   *     server to use
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   * @param {Function} [options.verifyClient] A hook to reject connections
   * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
   *     class to use. It must be the `WebSocket` class or class that extends it
   * @param {Function} [callback] A listener for the `listening` event
   */
  constructor(options, callback) {
    super();

    options = {
      allowSynchronousEvents: true,
      autoPong: true,
      maxPayload: 100 * 1024 * 1024,
      skipUTF8Validation: false,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null,
      WebSocket,
      ...options
    };

    if (
      (options.port == null && !options.server && !options.noServer) ||
      (options.port != null && (options.server || options.noServer)) ||
      (options.server && options.noServer)
    ) {
      throw new TypeError(
        'One and only one of the "port", "server", or "noServer" options ' +
          'must be specified'
      );
    }

    if (options.port != null) {
      this._server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.listen(
        options.port,
        options.host,
        options.backlog,
        callback
      );
    } else if (options.server) {
      this._server = options.server;
    }

    if (this._server) {
      const emitConnection = this.emit.bind(this, 'connection');

      this._removeListeners = addListeners(this._server, {
        listening: this.emit.bind(this, 'listening'),
        error: this.emit.bind(this, 'error'),
        upgrade: (req, socket, head) => {
          this.handleUpgrade(req, socket, head, emitConnection);
        }
      });
    }

    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
    if (options.clientTracking) {
      this.clients = new Set();
      this._shouldEmitClose = false;
    }

    this.options = options;
    this._state = RUNNING;
  }

  /**
   * Returns the bound address, the address family name, and port of the server
   * as reported by the operating system if listening on an IP socket.
   * If the server is listening on a pipe or UNIX domain socket, the name is
   * returned as a string.
   *
   * @return {(Object|String|null)} The address of the server
   * @public
   */
  address() {
    if (this.options.noServer) {
      throw new Error('The server is operating in "noServer" mode');
    }

    if (!this._server) return null;
    return this._server.address();
  }

  /**
   * Stop the server from accepting new connections and emit the `'close'` event
   * when all existing connections are closed.
   *
   * @param {Function} [cb] A one-time listener for the `'close'` event
   * @public
   */
  close(cb) {
    if (this._state === CLOSED) {
      if (cb) {
        this.once('close', () => {
          cb(new Error('The server is not running'));
        });
      }

      process.nextTick(emitClose, this);
      return;
    }

    if (cb) this.once('close', cb);

    if (this._state === CLOSING) return;
    this._state = CLOSING;

    if (this.options.noServer || this.options.server) {
      if (this._server) {
        this._removeListeners();
        this._removeListeners = this._server = null;
      }

      if (this.clients) {
        if (!this.clients.size) {
          process.nextTick(emitClose, this);
        } else {
          this._shouldEmitClose = true;
        }
      } else {
        process.nextTick(emitClose, this);
      }
    } else {
      const server = this._server;

      this._removeListeners();
      this._removeListeners = this._server = null;

      //
      // The HTTP/S server was created internally. Close it, and rely on its
      // `'close'` event.
      //
      server.close(() => {
        emitClose(this);
      });
    }
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle(req) {
    if (this.options.path) {
      const index = req.url.indexOf('?');
      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

      if (pathname !== this.options.path) return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {Duplex} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade(req, socket, head, cb) {
    socket.on('error', socketOnError);

    const key = req.headers['sec-websocket-key'];
    const upgrade = req.headers.upgrade;
    const version = +req.headers['sec-websocket-version'];

    if (req.method !== 'GET') {
      const message = 'Invalid HTTP method';
      abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
      return;
    }

    if (upgrade === undefined || upgrade.toLowerCase() !== 'websocket') {
      const message = 'Invalid Upgrade header';
      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
      return;
    }

    if (key === undefined || !keyRegex.test(key)) {
      const message = 'Missing or invalid Sec-WebSocket-Key header';
      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
      return;
    }

    if (version !== 13 && version !== 8) {
      const message = 'Missing or invalid Sec-WebSocket-Version header';
      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
        'Sec-WebSocket-Version': '13, 8'
      });
      return;
    }

    if (!this.shouldHandle(req)) {
      abortHandshake(socket, 400);
      return;
    }

    const secWebSocketProtocol = req.headers['sec-websocket-protocol'];
    let protocols = new Set();

    if (secWebSocketProtocol !== undefined) {
      try {
        protocols = subprotocol.parse(secWebSocketProtocol);
      } catch (err) {
        const message = 'Invalid Sec-WebSocket-Protocol header';
        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
        return;
      }
    }

    const secWebSocketExtensions = req.headers['sec-websocket-extensions'];
    const extensions = {};

    if (
      this.options.perMessageDeflate &&
      secWebSocketExtensions !== undefined
    ) {
      const perMessageDeflate = new PerMessageDeflate(
        this.options.perMessageDeflate,
        true,
        this.options.maxPayload
      );

      try {
        const offers = extension.parse(secWebSocketExtensions);

        if (offers[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        const message =
          'Invalid or unacceptable Sec-WebSocket-Extensions header';
        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
        return;
      }
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin:
          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.socket.authorized || req.socket.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message, headers) => {
          if (!verified) {
            return abortHandshake(socket, code || 401, message, headers);
          }

          this.completeUpgrade(
            extensions,
            key,
            protocols,
            req,
            socket,
            head,
            cb
          );
        });
        return;
      }

      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
    }

    this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {Object} extensions The accepted extensions
   * @param {String} key The value of the `Sec-WebSocket-Key` header
   * @param {Set} protocols The subprotocols
   * @param {http.IncomingMessage} req The request object
   * @param {Duplex} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @throws {Error} If called more than once with the same socket
   * @private
   */
  completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    if (socket[kWebSocket]) {
      throw new Error(
        'server.handleUpgrade() was called more than once with the same ' +
          'socket, possibly due to a misconfiguration'
      );
    }

    if (this._state > RUNNING) return abortHandshake(socket, 503);

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${digest}`
    ];

    const ws = new this.options.WebSocket(null, undefined, this.options);

    if (protocols.size) {
      //
      // Optionally call external protocol selection handler.
      //
      const protocol = this.options.handleProtocols
        ? this.options.handleProtocols(protocols, req)
        : protocols.values().next().value;

      if (protocol) {
        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
        ws._protocol = protocol;
      }
    }

    if (extensions[PerMessageDeflate.extensionName]) {
      const params = extensions[PerMessageDeflate.extensionName].params;
      const value = extension.format({
        [PerMessageDeflate.extensionName]: [params]
      });
      headers.push(`Sec-WebSocket-Extensions: ${value}`);
      ws._extensions = extensions;
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('\r\n').join('\r\n'));
    socket.removeListener('error', socketOnError);

    ws.setSocket(socket, head, {
      allowSynchronousEvents: this.options.allowSynchronousEvents,
      maxPayload: this.options.maxPayload,
      skipUTF8Validation: this.options.skipUTF8Validation
    });

    if (this.clients) {
      this.clients.add(ws);
      ws.on('close', () => {
        this.clients.delete(ws);

        if (this._shouldEmitClose && !this.clients.size) {
          process.nextTick(emitClose, this);
        }
      });
    }

    cb(ws, req);
  }
}

module.exports = WebSocketServer;

/**
 * Add event listeners on an `EventEmitter` using a map of <event, listener>
 * pairs.
 *
 * @param {EventEmitter} server The event emitter
 * @param {Object.<String, Function>} map The listeners to add
 * @return {Function} A function that will remove the added listeners when
 *     called
 * @private
 */
function addListeners(server, map) {
  for (const event of Object.keys(map)) server.on(event, map[event]);

  return function removeListeners() {
    for (const event of Object.keys(map)) {
      server.removeListener(event, map[event]);
    }
  };
}

/**
 * Emit a `'close'` event on an `EventEmitter`.
 *
 * @param {EventEmitter} server The event emitter
 * @private
 */
function emitClose(server) {
  server._state = CLOSED;
  server.emit('close');
}

/**
 * Handle socket errors.
 *
 * @private
 */
function socketOnError() {
  this.destroy();
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {Duplex} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @param {Object} [headers] Additional HTTP response headers
 * @private
 */
function abortHandshake(socket, code, message, headers) {
  //
  // The socket is writable unless the user destroyed or ended it before calling
  // `server.handleUpgrade()` or in the `verifyClient` function, which is a user
  // error. Handling this does not make much sense as the worst that can happen
  // is that some of the data written by the user might be discarded due to the
  // call to `socket.end()` below, which triggers an `'error'` event that in
  // turn causes the socket to be destroyed.
  //
  message = message || http.STATUS_CODES[code];
  headers = {
    Connection: 'close',
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(message),
    ...headers
  };

  socket.once('finish', socket.destroy);

  socket.end(
    `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
      Object.keys(headers)
        .map((h) => `${h}: ${headers[h]}`)
        .join('\r\n') +
      '\r\n\r\n' +
      message
  );
}

/**
 * Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
 * one listener for it, otherwise call `abortHandshake()`.
 *
 * @param {WebSocketServer} server The WebSocket server
 * @param {http.IncomingMessage} req The request object
 * @param {Duplex} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} message The HTTP response body
 * @param {Object} [headers] The HTTP response headers
 * @private
 */
function abortHandshakeOrEmitwsClientError(
  server,
  req,
  socket,
  code,
  message,
  headers
) {
  if (server.listenerCount('wsClientError')) {
    const err = new Error(message);
    Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);

    server.emit('wsClientError', err, socket, req);
  } else {
    abortHandshake(socket, code, message, headers);
  }
}


/***/ }),

/***/ "./node_modules/ws/lib/websocket.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/websocket.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex|Readable$", "caughtErrors": "none" }] */



const EventEmitter = __webpack_require__(/*! events */ "events");
const https = __webpack_require__(/*! https */ "https");
const http = __webpack_require__(/*! http */ "http");
const net = __webpack_require__(/*! net */ "net");
const tls = __webpack_require__(/*! tls */ "tls");
const { randomBytes, createHash } = __webpack_require__(/*! crypto */ "crypto");
const { Duplex, Readable } = __webpack_require__(/*! stream */ "stream");
const { URL } = __webpack_require__(/*! url */ "url");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const Receiver = __webpack_require__(/*! ./receiver */ "./node_modules/ws/lib/receiver.js");
const Sender = __webpack_require__(/*! ./sender */ "./node_modules/ws/lib/sender.js");
const { isBlob } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");

const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  GUID,
  kForOnEventAttribute,
  kListener,
  kStatusCode,
  kWebSocket,
  NOOP
} = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const {
  EventTarget: { addEventListener, removeEventListener }
} = __webpack_require__(/*! ./event-target */ "./node_modules/ws/lib/event-target.js");
const { format, parse } = __webpack_require__(/*! ./extension */ "./node_modules/ws/lib/extension.js");
const { toBuffer } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");

const closeTimeout = 30 * 1000;
const kAborted = Symbol('kAborted');
const protocolVersions = [8, 13];
const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
  /**
   * Create a new `WebSocket`.
   *
   * @param {(String|URL)} address The URL to which to connect
   * @param {(String|String[])} [protocols] The subprotocols
   * @param {Object} [options] Connection options
   */
  constructor(address, protocols, options) {
    super();

    this._binaryType = BINARY_TYPES[0];
    this._closeCode = 1006;
    this._closeFrameReceived = false;
    this._closeFrameSent = false;
    this._closeMessage = EMPTY_BUFFER;
    this._closeTimer = null;
    this._errorEmitted = false;
    this._extensions = {};
    this._paused = false;
    this._protocol = '';
    this._readyState = WebSocket.CONNECTING;
    this._receiver = null;
    this._sender = null;
    this._socket = null;

    if (address !== null) {
      this._bufferedAmount = 0;
      this._isServer = false;
      this._redirects = 0;

      if (protocols === undefined) {
        protocols = [];
      } else if (!Array.isArray(protocols)) {
        if (typeof protocols === 'object' && protocols !== null) {
          options = protocols;
          protocols = [];
        } else {
          protocols = [protocols];
        }
      }

      initAsClient(this, address, protocols, options);
    } else {
      this._autoPong = options.autoPong;
      this._isServer = true;
    }
  }

  /**
   * For historical reasons, the custom "nodebuffer" type is used by the default
   * instead of "blob".
   *
   * @type {String}
   */
  get binaryType() {
    return this._binaryType;
  }

  set binaryType(type) {
    if (!BINARY_TYPES.includes(type)) return;

    this._binaryType = type;

    //
    // Allow to change `binaryType` on the fly.
    //
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * @type {Number}
   */
  get bufferedAmount() {
    if (!this._socket) return this._bufferedAmount;

    return this._socket._writableState.length + this._sender._bufferedBytes;
  }

  /**
   * @type {String}
   */
  get extensions() {
    return Object.keys(this._extensions).join();
  }

  /**
   * @type {Boolean}
   */
  get isPaused() {
    return this._paused;
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onclose() {
    return null;
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onerror() {
    return null;
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onopen() {
    return null;
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onmessage() {
    return null;
  }

  /**
   * @type {String}
   */
  get protocol() {
    return this._protocol;
  }

  /**
   * @type {Number}
   */
  get readyState() {
    return this._readyState;
  }

  /**
   * @type {String}
   */
  get url() {
    return this._url;
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {Duplex} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Object} options Options object
   * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
   *     multiple times in the same tick
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Number} [options.maxPayload=0] The maximum allowed message size
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   * @private
   */
  setSocket(socket, head, options) {
    const receiver = new Receiver({
      allowSynchronousEvents: options.allowSynchronousEvents,
      binaryType: this.binaryType,
      extensions: this._extensions,
      isServer: this._isServer,
      maxPayload: options.maxPayload,
      skipUTF8Validation: options.skipUTF8Validation
    });

    const sender = new Sender(socket, this._extensions, options.generateMask);

    this._receiver = receiver;
    this._sender = sender;
    this._socket = socket;

    receiver[kWebSocket] = this;
    sender[kWebSocket] = this;
    socket[kWebSocket] = this;

    receiver.on('conclude', receiverOnConclude);
    receiver.on('drain', receiverOnDrain);
    receiver.on('error', receiverOnError);
    receiver.on('message', receiverOnMessage);
    receiver.on('ping', receiverOnPing);
    receiver.on('pong', receiverOnPong);

    sender.onerror = senderOnError;

    //
    // These methods may not be available if `socket` is just a `Duplex`.
    //
    if (socket.setTimeout) socket.setTimeout(0);
    if (socket.setNoDelay) socket.setNoDelay();

    if (head.length > 0) socket.unshift(head);

    socket.on('close', socketOnClose);
    socket.on('data', socketOnData);
    socket.on('end', socketOnEnd);
    socket.on('error', socketOnError);

    this._readyState = WebSocket.OPEN;
    this.emit('open');
  }

  /**
   * Emit the `'close'` event.
   *
   * @private
   */
  emitClose() {
    if (!this._socket) {
      this._readyState = WebSocket.CLOSED;
      this.emit('close', this._closeCode, this._closeMessage);
      return;
    }

    if (this._extensions[PerMessageDeflate.extensionName]) {
      this._extensions[PerMessageDeflate.extensionName].cleanup();
    }

    this._receiver.removeAllListeners();
    this._readyState = WebSocket.CLOSED;
    this.emit('close', this._closeCode, this._closeMessage);
  }

  /**
   * Start a closing handshake.
   *
   *          +----------+   +-----------+   +----------+
   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
   *    |     +----------+   +-----------+   +----------+     |
   *          +----------+   +-----------+         |
   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
   *          +----------+   +-----------+   |
   *    |           |                        |   +---+        |
   *                +------------------------+-->|fin| - - - -
   *    |         +---+                      |   +---+
   *     - - - - -|fin|<---------------------+
   *              +---+
   *
   * @param {Number} [code] Status code explaining why the connection is closing
   * @param {(String|Buffer)} [data] The reason why the connection is
   *     closing
   * @public
   */
  close(code, data) {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      abortHandshake(this, this._req, msg);
      return;
    }

    if (this.readyState === WebSocket.CLOSING) {
      if (
        this._closeFrameSent &&
        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
      ) {
        this._socket.end();
      }

      return;
    }

    this._readyState = WebSocket.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      //
      // This error is handled by the `'error'` listener on the socket. We only
      // want to know if the close frame has been sent here.
      //
      if (err) return;

      this._closeFrameSent = true;

      if (
        this._closeFrameReceived ||
        this._receiver._writableState.errorEmitted
      ) {
        this._socket.end();
      }
    });

    setCloseTimer(this);
  }

  /**
   * Pause the socket.
   *
   * @public
   */
  pause() {
    if (
      this.readyState === WebSocket.CONNECTING ||
      this.readyState === WebSocket.CLOSED
    ) {
      return;
    }

    this._paused = true;
    this._socket.pause();
  }

  /**
   * Send a ping.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the ping is sent
   * @public
   */
  ping(data, mask, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Send a pong.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the pong is sent
   * @public
   */
  pong(data, mask, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Resume the socket.
   *
   * @public
   */
  resume() {
    if (
      this.readyState === WebSocket.CONNECTING ||
      this.readyState === WebSocket.CLOSED
    ) {
      return;
    }

    this._paused = false;
    if (!this._receiver._writableState.needDrain) this._socket.resume();
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} [options] Options object
   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
   *     text
   * @param {Boolean} [options.compress] Specifies whether or not to compress
   *     `data`
   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when data is written out
   * @public
   */
  send(data, options, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    const opts = {
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true,
      ...options
    };

    if (!this._extensions[PerMessageDeflate.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate() {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      abortHandshake(this, this._req, msg);
      return;
    }

    if (this._socket) {
      this._readyState = WebSocket.CLOSING;
      this._socket.destroy();
    }
  }
}

/**
 * @constant {Number} CONNECTING
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket, 'CONNECTING', {
  enumerable: true,
  value: readyStates.indexOf('CONNECTING')
});

/**
 * @constant {Number} CONNECTING
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
  enumerable: true,
  value: readyStates.indexOf('CONNECTING')
});

/**
 * @constant {Number} OPEN
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket, 'OPEN', {
  enumerable: true,
  value: readyStates.indexOf('OPEN')
});

/**
 * @constant {Number} OPEN
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket.prototype, 'OPEN', {
  enumerable: true,
  value: readyStates.indexOf('OPEN')
});

/**
 * @constant {Number} CLOSING
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket, 'CLOSING', {
  enumerable: true,
  value: readyStates.indexOf('CLOSING')
});

/**
 * @constant {Number} CLOSING
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket.prototype, 'CLOSING', {
  enumerable: true,
  value: readyStates.indexOf('CLOSING')
});

/**
 * @constant {Number} CLOSED
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket, 'CLOSED', {
  enumerable: true,
  value: readyStates.indexOf('CLOSED')
});

/**
 * @constant {Number} CLOSED
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket.prototype, 'CLOSED', {
  enumerable: true,
  value: readyStates.indexOf('CLOSED')
});

[
  'binaryType',
  'bufferedAmount',
  'extensions',
  'isPaused',
  'protocol',
  'readyState',
  'url'
].forEach((property) => {
  Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
});

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    enumerable: true,
    get() {
      for (const listener of this.listeners(method)) {
        if (listener[kForOnEventAttribute]) return listener[kListener];
      }

      return null;
    },
    set(handler) {
      for (const listener of this.listeners(method)) {
        if (listener[kForOnEventAttribute]) {
          this.removeListener(method, listener);
          break;
        }
      }

      if (typeof handler !== 'function') return;

      this.addEventListener(method, handler, {
        [kForOnEventAttribute]: true
      });
    }
  });
});

WebSocket.prototype.addEventListener = addEventListener;
WebSocket.prototype.removeEventListener = removeEventListener;

module.exports = WebSocket;

/**
 * Initialize a WebSocket client.
 *
 * @param {WebSocket} websocket The client to initialize
 * @param {(String|URL)} address The URL to which to connect
 * @param {Array} protocols The subprotocols
 * @param {Object} [options] Connection options
 * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
 *     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
 *     times in the same tick
 * @param {Boolean} [options.autoPong=true] Specifies whether or not to
 *     automatically send a pong in response to a ping
 * @param {Function} [options.finishRequest] A function which can be used to
 *     customize the headers of each http request before it is sent
 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
 *     redirects
 * @param {Function} [options.generateMask] The function used to generate the
 *     masking key
 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
 *     handshake request
 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
 *     size
 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
 *     allowed
 * @param {String} [options.origin] Value of the `Origin` or
 *     `Sec-WebSocket-Origin` header
 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
 *     permessage-deflate
 * @param {Number} [options.protocolVersion=13] Value of the
 *     `Sec-WebSocket-Version` header
 * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
 *     not to skip UTF-8 validation for text and close messages
 * @private
 */
function initAsClient(websocket, address, protocols, options) {
  const opts = {
    allowSynchronousEvents: true,
    autoPong: true,
    protocolVersion: protocolVersions[1],
    maxPayload: 100 * 1024 * 1024,
    skipUTF8Validation: false,
    perMessageDeflate: true,
    followRedirects: false,
    maxRedirects: 10,
    ...options,
    socketPath: undefined,
    hostname: undefined,
    protocol: undefined,
    timeout: undefined,
    method: 'GET',
    host: undefined,
    path: undefined,
    port: undefined
  };

  websocket._autoPong = opts.autoPong;

  if (!protocolVersions.includes(opts.protocolVersion)) {
    throw new RangeError(
      `Unsupported protocol version: ${opts.protocolVersion} ` +
        `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  let parsedUrl;

  if (address instanceof URL) {
    parsedUrl = address;
  } else {
    try {
      parsedUrl = new URL(address);
    } catch (e) {
      throw new SyntaxError(`Invalid URL: ${address}`);
    }
  }

  if (parsedUrl.protocol === 'http:') {
    parsedUrl.protocol = 'ws:';
  } else if (parsedUrl.protocol === 'https:') {
    parsedUrl.protocol = 'wss:';
  }

  websocket._url = parsedUrl.href;

  const isSecure = parsedUrl.protocol === 'wss:';
  const isIpcUrl = parsedUrl.protocol === 'ws+unix:';
  let invalidUrlMessage;

  if (parsedUrl.protocol !== 'ws:' && !isSecure && !isIpcUrl) {
    invalidUrlMessage =
      'The URL\'s protocol must be one of "ws:", "wss:", ' +
      '"http:", "https:", or "ws+unix:"';
  } else if (isIpcUrl && !parsedUrl.pathname) {
    invalidUrlMessage = "The URL's pathname is empty";
  } else if (parsedUrl.hash) {
    invalidUrlMessage = 'The URL contains a fragment identifier';
  }

  if (invalidUrlMessage) {
    const err = new SyntaxError(invalidUrlMessage);

    if (websocket._redirects === 0) {
      throw err;
    } else {
      emitErrorAndClose(websocket, err);
      return;
    }
  }

  const defaultPort = isSecure ? 443 : 80;
  const key = randomBytes(16).toString('base64');
  const request = isSecure ? https.request : http.request;
  const protocolSet = new Set();
  let perMessageDeflate;

  opts.createConnection =
    opts.createConnection || (isSecure ? tlsConnect : netConnect);
  opts.defaultPort = opts.defaultPort || defaultPort;
  opts.port = parsedUrl.port || defaultPort;
  opts.host = parsedUrl.hostname.startsWith('[')
    ? parsedUrl.hostname.slice(1, -1)
    : parsedUrl.hostname;
  opts.headers = {
    ...opts.headers,
    'Sec-WebSocket-Version': opts.protocolVersion,
    'Sec-WebSocket-Key': key,
    Connection: 'Upgrade',
    Upgrade: 'websocket'
  };
  opts.path = parsedUrl.pathname + parsedUrl.search;
  opts.timeout = opts.handshakeTimeout;

  if (opts.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate(
      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
      false,
      opts.maxPayload
    );
    opts.headers['Sec-WebSocket-Extensions'] = format({
      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
    });
  }
  if (protocols.length) {
    for (const protocol of protocols) {
      if (
        typeof protocol !== 'string' ||
        !subprotocolRegex.test(protocol) ||
        protocolSet.has(protocol)
      ) {
        throw new SyntaxError(
          'An invalid or duplicated subprotocol was specified'
        );
      }

      protocolSet.add(protocol);
    }

    opts.headers['Sec-WebSocket-Protocol'] = protocols.join(',');
  }
  if (opts.origin) {
    if (opts.protocolVersion < 13) {
      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
    } else {
      opts.headers.Origin = opts.origin;
    }
  }
  if (parsedUrl.username || parsedUrl.password) {
    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
  }

  if (isIpcUrl) {
    const parts = opts.path.split(':');

    opts.socketPath = parts[0];
    opts.path = parts[1];
  }

  let req;

  if (opts.followRedirects) {
    if (websocket._redirects === 0) {
      websocket._originalIpc = isIpcUrl;
      websocket._originalSecure = isSecure;
      websocket._originalHostOrSocketPath = isIpcUrl
        ? opts.socketPath
        : parsedUrl.host;

      const headers = options && options.headers;

      //
      // Shallow copy the user provided options so that headers can be changed
      // without mutating the original object.
      //
      options = { ...options, headers: {} };

      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          options.headers[key.toLowerCase()] = value;
        }
      }
    } else if (websocket.listenerCount('redirect') === 0) {
      const isSameHost = isIpcUrl
        ? websocket._originalIpc
          ? opts.socketPath === websocket._originalHostOrSocketPath
          : false
        : websocket._originalIpc
          ? false
          : parsedUrl.host === websocket._originalHostOrSocketPath;

      if (!isSameHost || (websocket._originalSecure && !isSecure)) {
        //
        // Match curl 7.77.0 behavior and drop the following headers. These
        // headers are also dropped when following a redirect to a subdomain.
        //
        delete opts.headers.authorization;
        delete opts.headers.cookie;

        if (!isSameHost) delete opts.headers.host;

        opts.auth = undefined;
      }
    }

    //
    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
    // If the `Authorization` header is set, then there is nothing to do as it
    // will take precedence.
    //
    if (opts.auth && !options.headers.authorization) {
      options.headers.authorization =
        'Basic ' + Buffer.from(opts.auth).toString('base64');
    }

    req = websocket._req = request(opts);

    if (websocket._redirects) {
      //
      // Unlike what is done for the `'upgrade'` event, no early exit is
      // triggered here if the user calls `websocket.close()` or
      // `websocket.terminate()` from a listener of the `'redirect'` event. This
      // is because the user can also call `request.destroy()` with an error
      // before calling `websocket.close()` or `websocket.terminate()` and this
      // would result in an error being emitted on the `request` object with no
      // `'error'` event listeners attached.
      //
      websocket.emit('redirect', websocket.url, req);
    }
  } else {
    req = websocket._req = request(opts);
  }

  if (opts.timeout) {
    req.on('timeout', () => {
      abortHandshake(websocket, req, 'Opening handshake has timed out');
    });
  }

  req.on('error', (err) => {
    if (req === null || req[kAborted]) return;

    req = websocket._req = null;
    emitErrorAndClose(websocket, err);
  });

  req.on('response', (res) => {
    const location = res.headers.location;
    const statusCode = res.statusCode;

    if (
      location &&
      opts.followRedirects &&
      statusCode >= 300 &&
      statusCode < 400
    ) {
      if (++websocket._redirects > opts.maxRedirects) {
        abortHandshake(websocket, req, 'Maximum redirects exceeded');
        return;
      }

      req.abort();

      let addr;

      try {
        addr = new URL(location, address);
      } catch (e) {
        const err = new SyntaxError(`Invalid URL: ${location}`);
        emitErrorAndClose(websocket, err);
        return;
      }

      initAsClient(websocket, addr, protocols, options);
    } else if (!websocket.emit('unexpected-response', req, res)) {
      abortHandshake(
        websocket,
        req,
        `Unexpected server response: ${res.statusCode}`
      );
    }
  });

  req.on('upgrade', (res, socket, head) => {
    websocket.emit('upgrade', res);

    //
    // The user may have closed the connection from a listener of the
    // `'upgrade'` event.
    //
    if (websocket.readyState !== WebSocket.CONNECTING) return;

    req = websocket._req = null;

    const upgrade = res.headers.upgrade;

    if (upgrade === undefined || upgrade.toLowerCase() !== 'websocket') {
      abortHandshake(websocket, socket, 'Invalid Upgrade header');
      return;
    }

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
      return;
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    let protError;

    if (serverProt !== undefined) {
      if (!protocolSet.size) {
        protError = 'Server sent a subprotocol but none was requested';
      } else if (!protocolSet.has(serverProt)) {
        protError = 'Server sent an invalid subprotocol';
      }
    } else if (protocolSet.size) {
      protError = 'Server sent no subprotocol';
    }

    if (protError) {
      abortHandshake(websocket, socket, protError);
      return;
    }

    if (serverProt) websocket._protocol = serverProt;

    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

    if (secWebSocketExtensions !== undefined) {
      if (!perMessageDeflate) {
        const message =
          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
          'was requested';
        abortHandshake(websocket, socket, message);
        return;
      }

      let extensions;

      try {
        extensions = parse(secWebSocketExtensions);
      } catch (err) {
        const message = 'Invalid Sec-WebSocket-Extensions header';
        abortHandshake(websocket, socket, message);
        return;
      }

      const extensionNames = Object.keys(extensions);

      if (
        extensionNames.length !== 1 ||
        extensionNames[0] !== PerMessageDeflate.extensionName
      ) {
        const message = 'Server indicated an extension that was not requested';
        abortHandshake(websocket, socket, message);
        return;
      }

      try {
        perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
      } catch (err) {
        const message = 'Invalid Sec-WebSocket-Extensions header';
        abortHandshake(websocket, socket, message);
        return;
      }

      websocket._extensions[PerMessageDeflate.extensionName] =
        perMessageDeflate;
    }

    websocket.setSocket(socket, head, {
      allowSynchronousEvents: opts.allowSynchronousEvents,
      generateMask: opts.generateMask,
      maxPayload: opts.maxPayload,
      skipUTF8Validation: opts.skipUTF8Validation
    });
  });

  if (opts.finishRequest) {
    opts.finishRequest(req, websocket);
  } else {
    req.end();
  }
}

/**
 * Emit the `'error'` and `'close'` events.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {Error} The error to emit
 * @private
 */
function emitErrorAndClose(websocket, err) {
  websocket._readyState = WebSocket.CLOSING;
  //
  // The following assignment is practically useless and is done only for
  // consistency.
  //
  websocket._errorEmitted = true;
  websocket.emit('error', err);
  websocket.emitClose();
}

/**
 * Create a `net.Socket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {net.Socket} The newly created socket used to start the connection
 * @private
 */
function netConnect(options) {
  options.path = options.socketPath;
  return net.connect(options);
}

/**
 * Create a `tls.TLSSocket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {tls.TLSSocket} The newly created socket used to start the connection
 * @private
 */
function tlsConnect(options) {
  options.path = undefined;

  if (!options.servername && options.servername !== '') {
    options.servername = net.isIP(options.host) ? '' : options.host;
  }

  return tls.connect(options);
}

/**
 * Abort the handshake and emit an error.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
 *     abort or the socket to destroy
 * @param {String} message The error message
 * @private
 */
function abortHandshake(websocket, stream, message) {
  websocket._readyState = WebSocket.CLOSING;

  const err = new Error(message);
  Error.captureStackTrace(err, abortHandshake);

  if (stream.setHeader) {
    stream[kAborted] = true;
    stream.abort();

    if (stream.socket && !stream.socket.destroyed) {
      //
      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
      // called after the request completed. See
      // https://github.com/websockets/ws/issues/1869.
      //
      stream.socket.destroy();
    }

    process.nextTick(emitErrorAndClose, websocket, err);
  } else {
    stream.destroy(err);
    stream.once('error', websocket.emit.bind(websocket, 'error'));
    stream.once('close', websocket.emitClose.bind(websocket));
  }
}

/**
 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {*} [data] The data to send
 * @param {Function} [cb] Callback
 * @private
 */
function sendAfterClose(websocket, data, cb) {
  if (data) {
    const length = isBlob(data) ? data.size : toBuffer(data).length;

    //
    // The `_bufferedAmount` property is used only when the peer is a client and
    // the opening handshake fails. Under these circumstances, in fact, the
    // `setSocket()` method is not called, so the `_socket` and `_sender`
    // properties are set to `null`.
    //
    if (websocket._socket) websocket._sender._bufferedBytes += length;
    else websocket._bufferedAmount += length;
  }

  if (cb) {
    const err = new Error(
      `WebSocket is not open: readyState ${websocket.readyState} ` +
        `(${readyStates[websocket.readyState]})`
    );
    process.nextTick(cb, err);
  }
}

/**
 * The listener of the `Receiver` `'conclude'` event.
 *
 * @param {Number} code The status code
 * @param {Buffer} reason The reason for closing
 * @private
 */
function receiverOnConclude(code, reason) {
  const websocket = this[kWebSocket];

  websocket._closeFrameReceived = true;
  websocket._closeMessage = reason;
  websocket._closeCode = code;

  if (websocket._socket[kWebSocket] === undefined) return;

  websocket._socket.removeListener('data', socketOnData);
  process.nextTick(resume, websocket._socket);

  if (code === 1005) websocket.close();
  else websocket.close(code, reason);
}

/**
 * The listener of the `Receiver` `'drain'` event.
 *
 * @private
 */
function receiverOnDrain() {
  const websocket = this[kWebSocket];

  if (!websocket.isPaused) websocket._socket.resume();
}

/**
 * The listener of the `Receiver` `'error'` event.
 *
 * @param {(RangeError|Error)} err The emitted error
 * @private
 */
function receiverOnError(err) {
  const websocket = this[kWebSocket];

  if (websocket._socket[kWebSocket] !== undefined) {
    websocket._socket.removeListener('data', socketOnData);

    //
    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
    // https://github.com/websockets/ws/issues/1940.
    //
    process.nextTick(resume, websocket._socket);

    websocket.close(err[kStatusCode]);
  }

  if (!websocket._errorEmitted) {
    websocket._errorEmitted = true;
    websocket.emit('error', err);
  }
}

/**
 * The listener of the `Receiver` `'finish'` event.
 *
 * @private
 */
function receiverOnFinish() {
  this[kWebSocket].emitClose();
}

/**
 * The listener of the `Receiver` `'message'` event.
 *
 * @param {Buffer|ArrayBuffer|Buffer[])} data The message
 * @param {Boolean} isBinary Specifies whether the message is binary or not
 * @private
 */
function receiverOnMessage(data, isBinary) {
  this[kWebSocket].emit('message', data, isBinary);
}

/**
 * The listener of the `Receiver` `'ping'` event.
 *
 * @param {Buffer} data The data included in the ping frame
 * @private
 */
function receiverOnPing(data) {
  const websocket = this[kWebSocket];

  if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
  websocket.emit('ping', data);
}

/**
 * The listener of the `Receiver` `'pong'` event.
 *
 * @param {Buffer} data The data included in the pong frame
 * @private
 */
function receiverOnPong(data) {
  this[kWebSocket].emit('pong', data);
}

/**
 * Resume a readable stream
 *
 * @param {Readable} stream The readable stream
 * @private
 */
function resume(stream) {
  stream.resume();
}

/**
 * The `Sender` error event handler.
 *
 * @param {Error} The error
 * @private
 */
function senderOnError(err) {
  const websocket = this[kWebSocket];

  if (websocket.readyState === WebSocket.CLOSED) return;
  if (websocket.readyState === WebSocket.OPEN) {
    websocket._readyState = WebSocket.CLOSING;
    setCloseTimer(websocket);
  }

  //
  // `socket.end()` is used instead of `socket.destroy()` to allow the other
  // peer to finish sending queued data. There is no need to set a timer here
  // because `CLOSING` means that it is already set or not needed.
  //
  this._socket.end();

  if (!websocket._errorEmitted) {
    websocket._errorEmitted = true;
    websocket.emit('error', err);
  }
}

/**
 * Set a timer to destroy the underlying raw socket of a WebSocket.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @private
 */
function setCloseTimer(websocket) {
  websocket._closeTimer = setTimeout(
    websocket._socket.destroy.bind(websocket._socket),
    closeTimeout
  );
}

/**
 * The listener of the socket `'close'` event.
 *
 * @private
 */
function socketOnClose() {
  const websocket = this[kWebSocket];

  this.removeListener('close', socketOnClose);
  this.removeListener('data', socketOnData);
  this.removeListener('end', socketOnEnd);

  websocket._readyState = WebSocket.CLOSING;

  let chunk;

  //
  // The close frame might not have been received or the `'end'` event emitted,
  // for example, if the socket was destroyed due to an error. Ensure that the
  // `receiver` stream is closed after writing any remaining buffered data to
  // it. If the readable side of the socket is in flowing mode then there is no
  // buffered data as everything has been already written and `readable.read()`
  // will return `null`. If instead, the socket is paused, any possible buffered
  // data will be read as a single chunk.
  //
  if (
    !this._readableState.endEmitted &&
    !websocket._closeFrameReceived &&
    !websocket._receiver._writableState.errorEmitted &&
    (chunk = websocket._socket.read()) !== null
  ) {
    websocket._receiver.write(chunk);
  }

  websocket._receiver.end();

  this[kWebSocket] = undefined;

  clearTimeout(websocket._closeTimer);

  if (
    websocket._receiver._writableState.finished ||
    websocket._receiver._writableState.errorEmitted
  ) {
    websocket.emitClose();
  } else {
    websocket._receiver.on('error', receiverOnFinish);
    websocket._receiver.on('finish', receiverOnFinish);
  }
}

/**
 * The listener of the socket `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function socketOnData(chunk) {
  if (!this[kWebSocket]._receiver.write(chunk)) {
    this.pause();
  }
}

/**
 * The listener of the socket `'end'` event.
 *
 * @private
 */
function socketOnEnd() {
  const websocket = this[kWebSocket];

  websocket._readyState = WebSocket.CLOSING;
  websocket._receiver.end();
  this.end();
}

/**
 * The listener of the socket `'error'` event.
 *
 * @private
 */
function socketOnError() {
  const websocket = this[kWebSocket];

  this.removeListener('error', socketOnError);
  this.on('error', NOOP);

  if (websocket) {
    websocket._readyState = WebSocket.CLOSING;
    this.destroy();
  }
}


/***/ }),

/***/ "./node_modules/yallist/iterator.js":
/*!******************************************!*\
  !*** ./node_modules/yallist/iterator.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ "./node_modules/yallist/yallist.js":
/*!*****************************************!*\
  !*** ./node_modules/yallist/yallist.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __webpack_require__(/*! ./iterator.js */ "./node_modules/yallist/iterator.js")(Yallist)
} catch (er) {}


/***/ }),

/***/ "./src/ai/config.ts":
/*!**************************!*\
  !*** ./src/ai/config.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelConfiguration = void 0;
class ModelConfiguration {
    constructor() {
        this.permissions = {};
        this.config = this.loadConfig();
        this.permissions = this.loadPermissions();
    }
    loadConfig() {
        const saved = localStorage.getItem(ModelConfiguration.CONFIG_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            provider: 'openai',
            model: 'gpt-4-1106-preview',
            temperature: 0.7,
            maxTokens: 4096,
            tools: {
                kali: false, // Default disabled for security
                gcp: true,
                docker: true,
                vscode: {
                    fileAccess: true,
                    terminal: false, // Requires explicit user approval
                    extensions: true,
                    debugger: false
                }
            },
            permissions: {
                dangerousOperations: false,
                networkAccess: true,
                fileSystemWrite: false
            }
        };
    }
    loadPermissions() {
        const saved = localStorage.getItem(ModelConfiguration.PERMISSIONS_KEY);
        return saved ? JSON.parse(saved) : {};
    }
    async updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        localStorage.setItem(ModelConfiguration.CONFIG_KEY, JSON.stringify(this.config));
        // Notify about configuration update
        window.electronAPI?.notifyConfigUpdate?.(this.config);
    }
    async updatePermission(extensionId, granted) {
        this.permissions[extensionId] = granted;
        localStorage.setItem(ModelConfiguration.PERMISSIONS_KEY, JSON.stringify(this.permissions));
    }
    getConfig() {
        return { ...this.config };
    }
    hasPermission(extensionId) {
        return this.permissions[extensionId] === true;
    }
    getPermissions() {
        return { ...this.permissions };
    }
    validateConfig() {
        const errors = [];
        if (!this.config.apiKey && this.config.provider !== 'local') {
            errors.push(`API key required for ${this.config.provider}`);
        }
        if (this.config.temperature < 0 || this.config.temperature > 2) {
            errors.push('Temperature must be between 0 and 2');
        }
        if (this.config.maxTokens < 1 || this.config.maxTokens > 8192) {
            errors.push('Max tokens must be between 1 and 8192');
        }
        return errors;
    }
    exportConfig() {
        return JSON.stringify({
            config: this.config,
            permissions: this.permissions,
            exportedAt: new Date().toISOString()
        }, null, 2);
    }
    importConfig(configString) {
        try {
            const imported = JSON.parse(configString);
            if (imported.config) {
                this.config = imported.config;
                localStorage.setItem(ModelConfiguration.CONFIG_KEY, JSON.stringify(this.config));
            }
            if (imported.permissions) {
                this.permissions = imported.permissions;
                localStorage.setItem(ModelConfiguration.PERMISSIONS_KEY, JSON.stringify(this.permissions));
            }
        }
        catch (error) {
            throw new Error('Invalid configuration format');
        }
    }
}
exports.ModelConfiguration = ModelConfiguration;
ModelConfiguration.CONFIG_KEY = 'ai-model-config';
ModelConfiguration.PERMISSIONS_KEY = 'ai-permissions';


/***/ }),

/***/ "./src/ai/streaming.ts":
/*!*****************************!*\
  !*** ./src/ai/streaming.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AIStreamClient = exports.AIStream = void 0;
const ws_1 = __webpack_require__(/*! ws */ "./node_modules/ws/index.js");
const events_1 = __webpack_require__(/*! events */ "events");
const tool_executor_1 = __webpack_require__(/*! ../ai/tool-executor */ "./src/ai/tool-executor.ts");
const config_1 = __webpack_require__(/*! ../ai/config */ "./src/ai/config.ts");
class AIStream extends events_1.EventEmitter {
    constructor(port) {
        super();
        this.port = port;
        this.connections = new Map();
        this.activeStreams = new Map();
        this.toolExecutor = new tool_executor_1.ToolExecutor();
        this.modelConfig = new config_1.ModelConfiguration();
        this.initializeWebSocketServer();
    }
    initializeWebSocketServer() {
        this.wsServer = new ws_1.WebSocketServer({
            port: this.port,
            perMessageDeflate: false // Disable compression for real-time streaming
        });
        this.wsServer.on('connection', (ws, request) => {
            const connectionId = this.generateConnectionId();
            this.connections.set(connectionId, ws);
            console.log(`AI Stream connection established: ${connectionId}`);
            ws.on('message', async (data) => {
                try {
                    const request = JSON.parse(data.toString());
                    await this.handleRequest(connectionId, request);
                }
                catch (error) {
                    this.sendError(connectionId, 'Invalid request format');
                }
            });
            ws.on('close', () => {
                this.connections.delete(connectionId);
                // Cancel any active streams for this connection
                const streamController = this.activeStreams.get(connectionId);
                if (streamController) {
                    streamController.abort();
                    this.activeStreams.delete(connectionId);
                }
                console.log(`AI Stream connection closed: ${connectionId}`);
            });
            ws.on('error', (error) => {
                console.error(`WebSocket error for ${connectionId}:`, error);
                this.connections.delete(connectionId);
            });
            // Send welcome message
            this.sendToken(connectionId, {
                type: 'status',
                content: 'Connected to AI Stream',
                data: { connectionId }
            });
        });
        this.wsServer.on('listening', () => {
            console.log(`AI Stream server listening on port ${this.port}`);
        });
    }
    async handleRequest(connectionId, request) {
        try {
            // Validate request
            if (!request.prompt) {
                this.sendError(connectionId, 'Prompt is required');
                return;
            }
            // Create abort controller for this request
            const abortController = new AbortController();
            this.activeStreams.set(connectionId, abortController);
            // Send status update
            this.sendToken(connectionId, {
                type: 'status',
                content: 'Processing request...',
                data: { requestId: request.id }
            });
            // Get configuration
            const config = this.modelConfig.getConfig();
            // Merge request options with config
            const effectiveOptions = {
                model: request.options?.model || config.model,
                temperature: request.options?.temperature || config.temperature,
                maxTokens: request.options?.maxTokens || config.maxTokens,
                stream: request.options?.stream !== false // Default to streaming
            };
            // Stream the response
            await this.streamResponse(connectionId, request, effectiveOptions, abortController.signal);
        }
        catch (error) {
            this.sendError(connectionId, error instanceof Error ? error.message : 'Unknown error');
        }
        finally {
            this.activeStreams.delete(connectionId);
        }
    }
    async streamResponse(connectionId, request, options, abortSignal) {
        let totalTokens = 0;
        let completionTokens = 0;
        const promptTokens = this.estimateTokenCount(request.prompt);
        try {
            // Get available tools
            const availableTools = this.toolExecutor.getAvailableTools();
            // Prepare messages for AI model
            const messages = [
                {
                    role: 'system',
                    content: this.buildSystemPrompt(request.context, availableTools)
                },
                {
                    role: 'user',
                    content: request.prompt
                }
            ];
            // Call AI model with streaming
            const stream = await this.callAIModel({
                messages,
                tools: availableTools,
                model: options.model,
                temperature: options.temperature,
                maxTokens: options.maxTokens,
                stream: true
            }, abortSignal);
            let assistantMessage = '';
            let currentToolCalls = [];
            // Process stream
            for await (const chunk of stream) {
                if (abortSignal.aborted) {
                    break;
                }
                // Handle content tokens
                if (chunk.choices?.[0]?.delta?.content) {
                    const content = chunk.choices[0].delta.content;
                    assistantMessage += content;
                    completionTokens += this.estimateTokenCount(content);
                    totalTokens = promptTokens + completionTokens;
                    this.sendToken(connectionId, {
                        type: 'token',
                        content,
                        metadata: {
                            timestamp: Date.now(),
                            tokenCount: completionTokens,
                            model: options.model
                        }
                    });
                }
                // Handle tool calls
                if (chunk.choices?.[0]?.delta?.tool_calls) {
                    const toolCall = chunk.choices[0].delta.tool_calls[0];
                    if (toolCall.function) {
                        currentToolCalls.push(toolCall);
                        this.sendToken(connectionId, {
                            type: 'tool_call',
                            content: `\n🔧 Executing: ${toolCall.function.name}\n`,
                            data: {
                                toolName: toolCall.function.name,
                                arguments: toolCall.function.arguments
                            }
                        });
                        try {
                            // Execute the tool
                            const result = await this.toolExecutor.executeTool({
                                name: toolCall.function.name,
                                function: toolCall.function.name,
                                arguments: JSON.parse(toolCall.function.arguments || '{}')
                            });
                            if (result.success) {
                                this.sendToken(connectionId, {
                                    type: 'tool_result',
                                    content: `✅ Result: ${result.output}\n`,
                                    data: {
                                        success: true,
                                        output: result.output,
                                        toolName: toolCall.function.name
                                    }
                                });
                            }
                            else {
                                this.sendToken(connectionId, {
                                    type: 'tool_result',
                                    content: `❌ Error: ${result.error}\n`,
                                    data: {
                                        success: false,
                                        error: result.error,
                                        toolName: toolCall.function.name,
                                        recommendedExtensions: result.recommendedExtensions
                                    }
                                });
                                // Handle extension recommendations
                                if (result.recommendedExtensions) {
                                    this.sendToken(connectionId, {
                                        type: 'status',
                                        content: `💡 Suggested extensions: ${result.recommendedExtensions.join(', ')}`,
                                        data: {
                                            type: 'extension_recommendation',
                                            extensions: result.recommendedExtensions
                                        }
                                    });
                                }
                            }
                        }
                        catch (error) {
                            this.sendToken(connectionId, {
                                type: 'error',
                                content: `🚫 Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`,
                                data: {
                                    toolName: toolCall.function.name,
                                    error: error instanceof Error ? error.message : 'Unknown error'
                                }
                            });
                        }
                    }
                }
                // Handle finish reason
                if (chunk.choices?.[0]?.finish_reason) {
                    break;
                }
            }
            // Send completion message
            this.sendToken(connectionId, {
                type: 'complete',
                content: '',
                data: {
                    requestId: request.id,
                    totalTokens,
                    usage: {
                        promptTokens,
                        completionTokens,
                        totalTokens
                    },
                    toolCalls: currentToolCalls
                },
                metadata: {
                    timestamp: Date.now(),
                    model: options.model,
                    usage: {
                        promptTokens,
                        completionTokens,
                        totalTokens
                    }
                }
            });
        }
        catch (error) {
            if (!abortSignal.aborted) {
                this.sendError(connectionId, error instanceof Error ? error.message : 'Streaming failed');
            }
        }
    }
    async callAIModel(params, abortSignal) {
        const config = this.modelConfig.getConfig();
        // For demonstration, create a mock streaming response
        // In production, this would call the actual AI service
        return this.createMockStream(params, abortSignal);
    }
    async *createMockStream(params, abortSignal) {
        const responses = [
            "I'll help you with your development task. Let me analyze your request and available tools.",
            "\n\nBased on your workspace, I can see several opportunities for improvement. ",
            "Let me start by examining your project structure and dependencies.",
            "\n\nI notice you have some files that could benefit from formatting. ",
            "Would you like me to run prettier on your TypeScript files?"
        ];
        for (let i = 0; i < responses.length; i++) {
            if (abortSignal.aborted) {
                break;
            }
            yield {
                choices: [{
                        delta: {
                            content: responses[i]
                        }
                    }]
            };
            // Simulate streaming delay
            await new Promise(resolve => setTimeout(resolve, 150));
        }
        // Simulate tool call
        if (!abortSignal.aborted && params.tools && params.tools.length > 0) {
            yield {
                choices: [{
                        delta: {
                            tool_calls: [{
                                    function: {
                                        name: 'vscode_esbenp_prettier_vscode_format',
                                        arguments: JSON.stringify({ files: ['src/index.ts'] })
                                    }
                                }]
                        }
                    }]
            };
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        // Completion
        yield {
            choices: [{
                    finish_reason: 'stop'
                }]
        };
    }
    buildSystemPrompt(context, tools) {
        const config = this.modelConfig.getConfig();
        return `You are VSEmbed AI DevTool, an advanced AI assistant integrated into a VS Code-like development environment.

CONTEXT:
${context ? JSON.stringify(context, null, 2) : 'No additional context provided'}

AVAILABLE TOOLS:
${tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

CAPABILITIES:
- VS Code extension access: ${config.tools.vscode.extensions ? 'ENABLED' : 'DISABLED'}
- Terminal operations: ${config.tools.vscode.terminal ? 'ENABLED' : 'DISABLED'}
- File system access: ${config.tools.vscode.fileAccess ? 'ENABLED' : 'DISABLED'}
- Docker operations: ${config.tools.docker ? 'ENABLED' : 'DISABLED'}
- GCP integration: ${config.tools.gcp ? 'ENABLED' : 'DISABLED'}
- Security tools: ${config.tools.kali ? 'ENABLED' : 'DISABLED'}

INSTRUCTIONS:
1. Always explain what you're going to do before using tools
2. Request permissions clearly when needed
3. Recommend extensions when they would be helpful
4. Provide clear, actionable advice
5. Respect security settings and user permissions
6. Use tools efficiently and explain their purpose

Respond in a helpful, professional manner and use tools when appropriate to assist with development tasks.`;
    }
    sendToken(connectionId, token) {
        const ws = this.connections.get(connectionId);
        if (ws && ws.readyState === ws_1.WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(token));
            }
            catch (error) {
                console.error(`Failed to send token to ${connectionId}:`, error);
            }
        }
    }
    sendError(connectionId, message) {
        this.sendToken(connectionId, {
            type: 'error',
            content: message,
            metadata: {
                timestamp: Date.now()
            }
        });
    }
    generateConnectionId() {
        return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    estimateTokenCount(text) {
        // Simple token estimation (roughly 4 characters per token)
        return Math.ceil(text.length / 4);
    }
    // Public API methods
    async broadcast(token) {
        const message = JSON.stringify(token);
        const promises = [];
        this.connections.forEach((ws, connectionId) => {
            if (ws.readyState === ws_1.WebSocket.OPEN) {
                promises.push(new Promise((resolve, reject) => {
                    ws.send(message, (error) => {
                        if (error) {
                            console.error(`Broadcast failed for ${connectionId}:`, error);
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    });
                }));
            }
        });
        await Promise.allSettled(promises);
    }
    getActiveConnections() {
        return this.connections.size;
    }
    getActiveStreams() {
        return this.activeStreams.size;
    }
    async shutdown() {
        console.log('Shutting down AI Stream server...');
        // Cancel all active streams
        this.activeStreams.forEach(controller => {
            controller.abort();
        });
        this.activeStreams.clear();
        // Close all connections
        const closePromises = [];
        this.connections.forEach((ws, connectionId) => {
            closePromises.push(new Promise((resolve) => {
                ws.close(1000, 'Server shutdown');
                ws.on('close', resolve);
            }));
        });
        await Promise.all(closePromises);
        this.connections.clear();
        // Close WebSocket server
        return new Promise((resolve, reject) => {
            this.wsServer.close((error) => {
                if (error) {
                    reject(error);
                }
                else {
                    console.log('AI Stream server shut down successfully');
                    resolve();
                }
            });
        });
    }
}
exports.AIStream = AIStream;
// Client-side streaming interface
class AIStreamClient extends events_1.EventEmitter {
    constructor(url) {
        super();
        this.url = url;
        this.ws = null;
        this.connectionId = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }
    async connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new ws_1.WebSocket(this.url);
                this.ws.onopen = () => {
                    console.log('Connected to AI Stream');
                    this.reconnectAttempts = 0;
                    resolve();
                };
                this.ws.onmessage = (event) => {
                    try {
                        const token = JSON.parse(event.data);
                        if (token.type === 'status' && token.data?.connectionId) {
                            this.connectionId = token.data.connectionId;
                        }
                        this.emit('token', token);
                    }
                    catch (error) {
                        console.error('Failed to parse stream message:', error);
                    }
                };
                this.ws.onclose = (event) => {
                    console.log('AI Stream connection closed:', event.code, event.reason);
                    this.emit('disconnect');
                    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.attemptReconnect();
                    }
                };
                this.ws.onerror = (error) => {
                    console.error('AI Stream error:', error);
                    this.emit('error', error);
                    reject(error);
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async attemptReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);
        setTimeout(async () => {
            try {
                await this.connect();
                this.emit('reconnect');
            }
            catch (error) {
                console.error('Reconnection failed:', error);
            }
        }, delay);
    }
    async sendRequest(request) {
        if (!this.ws || this.ws.readyState !== ws_1.WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
        }
        this.ws.send(JSON.stringify(request));
    }
    disconnect() {
        if (this.ws) {
            this.ws.close(1000, 'Client disconnect');
            this.ws = null;
        }
    }
    isConnected() {
        return this.ws?.readyState === ws_1.WebSocket.OPEN;
    }
    getConnectionId() {
        return this.connectionId;
    }
}
exports.AIStreamClient = AIStreamClient;


/***/ }),

/***/ "./src/ai/tool-executor.ts":
/*!*********************************!*\
  !*** ./src/ai/tool-executor.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolExecutor = void 0;
const recommender_1 = __webpack_require__(/*! ../extensions/recommender */ "./src/extensions/recommender.ts");
const manager_1 = __webpack_require__(/*! ../permissions/manager */ "./src/permissions/manager.ts");
const config_1 = __webpack_require__(/*! ../ai/config */ "./src/ai/config.ts");
class ToolExecutor {
    constructor() {
        this.availableExtensions = new Map();
        this.permissionManager = new manager_1.PermissionManager();
        this.extensionRecommender = new recommender_1.ExtensionRecommender();
        this.modelConfig = new config_1.ModelConfiguration();
        this.initializeExtensionTracking();
    }
    async initializeExtensionTracking() {
        // In a real VS Code environment, this would query actual extensions
        // For now, simulate some common extensions
        const commonExtensions = [
            { id: 'esbenp.prettier-vscode', commands: ['prettier.format'] },
            { id: 'dbaeumer.vscode-eslint', commands: ['eslint.fix'] },
            { id: 'ms-python.python', commands: ['python.run', 'python.debug'] },
            { id: 'ms-azuretools.vscode-docker', commands: ['docker.build', 'docker.run'] }
        ];
        commonExtensions.forEach(ext => {
            this.availableExtensions.set(ext.id, {
                id: ext.id,
                isActive: true,
                commands: ext.commands
            });
        });
    }
    async executeTool(toolCall) {
        try {
            // Handle VS Code extension tools
            if (toolCall.name.startsWith('vscode_')) {
                return await this.executeVSCodeTool(toolCall);
            }
            // Handle Kali tools
            if (toolCall.name.startsWith('kali_')) {
                return await this.executeKaliTool(toolCall);
            }
            // Handle Docker tools
            if (toolCall.name.startsWith('docker_')) {
                return await this.executeDockerTool(toolCall);
            }
            // Handle GCP tools
            if (toolCall.name.startsWith('gcp_')) {
                return await this.executeGCPTool(toolCall);
            }
            return {
                success: false,
                output: '',
                error: `Unknown tool type: ${toolCall.name}`
            };
        }
        catch (error) {
            return {
                success: false,
                output: '',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async executeVSCodeTool(toolCall) {
        const { name, function: command, arguments: args } = toolCall;
        const extId = this.parseExtensionId(name);
        // Check if extension is available
        const extension = this.availableExtensions.get(extId);
        if (!extension) {
            // Recommend extension installation
            const recommendations = this.extensionRecommender.recommendExtensions({
                files: [],
                installedExtensions: Array.from(this.availableExtensions.keys()),
                activeExtensions: Array.from(this.availableExtensions.keys()),
                dependencies: {}
            });
            const recommendation = recommendations.find(r => r.extensionId === extId);
            return {
                success: false,
                output: '',
                error: `Extension ${extId} not available`,
                recommendedExtensions: [extId],
                requiresPermission: false
            };
        }
        // Check permissions
        const hasPermission = await this.permissionManager.requestExtensionPermission(extId, command, `Execute ${command} with arguments: ${JSON.stringify(args)}`);
        if (!hasPermission) {
            return {
                success: false,
                output: '',
                error: `Permission denied for ${extId}:${command}`,
                requiresPermission: true
            };
        }
        // Execute the command
        try {
            const result = await this.callExtensionCommand(extId, command, args);
            return {
                success: true,
                output: JSON.stringify(result),
                error: undefined
            };
        }
        catch (error) {
            return {
                success: false,
                output: '',
                error: `Extension execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    async executeKaliTool(toolCall) {
        const config = this.modelConfig.getConfig();
        if (!config.tools.kali) {
            return {
                success: false,
                output: '',
                error: 'Kali tools are disabled in configuration'
            };
        }
        const hasPermission = await this.permissionManager.requestExtensionPermission('kali-tools', toolCall.function, `Execute Kali security tool: ${toolCall.function}`);
        if (!hasPermission) {
            return {
                success: false,
                output: '',
                error: 'Permission denied for Kali tools',
                requiresPermission: true
            };
        }
        // Simulate Kali tool execution
        const { function: tool, arguments: args } = toolCall;
        switch (tool) {
            case 'nmap_scan':
                return this.simulateNmapScan(args);
            case 'vulnerability_scan':
                return this.simulateVulnerabilityScan(args);
            default:
                return {
                    success: false,
                    output: '',
                    error: `Unknown Kali tool: ${tool}`
                };
        }
    }
    async executeDockerTool(toolCall) {
        const config = this.modelConfig.getConfig();
        if (!config.tools.docker) {
            return {
                success: false,
                output: '',
                error: 'Docker tools are disabled in configuration'
            };
        }
        const hasPermission = await this.permissionManager.requestExtensionPermission('docker', toolCall.function, `Execute Docker command: ${toolCall.function}`);
        if (!hasPermission) {
            return {
                success: false,
                output: '',
                error: 'Permission denied for Docker operations',
                requiresPermission: true
            };
        }
        // Simulate Docker command execution
        const result = await this.executeDockerCommand(toolCall.function, toolCall.arguments);
        return {
            success: true,
            output: result,
            error: undefined
        };
    }
    async executeGCPTool(toolCall) {
        const config = this.modelConfig.getConfig();
        if (!config.tools.gcp) {
            return {
                success: false,
                output: '',
                error: 'GCP tools are disabled in configuration'
            };
        }
        // Simulate GCP API call
        const result = await this.callGCPAPI(toolCall.function, toolCall.arguments);
        return {
            success: true,
            output: JSON.stringify(result),
            error: undefined
        };
    }
    parseExtensionId(toolName) {
        // Convert vscode_extension_name_command to extension.name
        const parts = toolName.split('_').slice(1); // Remove 'vscode' prefix
        const commandIndex = parts.findIndex(part => part === 'command' || part === 'cmd');
        if (commandIndex > 0) {
            return parts.slice(0, commandIndex).join('.');
        }
        return parts.join('.');
    }
    async callExtensionCommand(extensionId, command, args) {
        // In a real implementation, this would call the actual VS Code API
        // For simulation, return mock results
        if (command === 'prettier.format') {
            return { formatted: true, changes: 5 };
        }
        if (command === 'eslint.fix') {
            return { fixes: 3, errors: 0, warnings: 1 };
        }
        if (command === 'python.run') {
            return { exitCode: 0, output: 'Hello, World!' };
        }
        return { executed: true, command, args };
    }
    async simulateNmapScan(args) {
        // Simulate nmap scan results
        const mockResults = {
            target: args.target || '127.0.0.1',
            open_ports: [22, 80, 443],
            closed_ports: [21, 25, 53],
            scan_time: '2.5s'
        };
        return {
            success: true,
            output: JSON.stringify(mockResults, null, 2),
            error: undefined
        };
    }
    async simulateVulnerabilityScan(args) {
        const mockResults = {
            vulnerabilities: [
                { id: 'CVE-2023-1234', severity: 'medium', description: 'Sample vulnerability' }
            ],
            scan_date: new Date().toISOString()
        };
        return {
            success: true,
            output: JSON.stringify(mockResults, null, 2),
            error: undefined
        };
    }
    async executeDockerCommand(command, args) {
        // Simulate Docker command execution
        const mockCommands = {
            'build': `Building image: ${args.tag || 'latest'}`,
            'run': `Running container: ${args.image || 'ubuntu'}`,
            'ps': 'CONTAINER ID   IMAGE     COMMAND   STATUS',
            'images': 'REPOSITORY   TAG       IMAGE ID   SIZE'
        };
        return mockCommands[command] || `Executed: docker ${command}`;
    }
    async callGCPAPI(endpoint, params) {
        // Simulate GCP API call
        return {
            endpoint,
            params,
            response: 'Mock GCP response',
            timestamp: new Date().toISOString()
        };
    }
    getAvailableTools() {
        const tools = [];
        // Add VS Code extension tools
        this.availableExtensions.forEach((ext, id) => {
            ext.commands.forEach(command => {
                tools.push({
                    name: `vscode_${id.replace(/\./g, '_')}_${command}`,
                    description: `${ext.id}: ${command}`,
                    category: 'vscode'
                });
            });
        });
        // Add Kali tools if enabled
        const config = this.modelConfig.getConfig();
        if (config.tools.kali) {
            tools.push({
                name: 'kali_nmap_scan',
                description: 'Network scanning with Nmap',
                category: 'security'
            }, {
                name: 'kali_vulnerability_scan',
                description: 'Vulnerability assessment',
                category: 'security'
            });
        }
        // Add Docker tools if enabled
        if (config.tools.docker) {
            tools.push({
                name: 'docker_build',
                description: 'Build Docker image',
                category: 'containerization'
            }, {
                name: 'docker_run',
                description: 'Run Docker container',
                category: 'containerization'
            });
        }
        return tools;
    }
    async checkExtensionAvailability(extensionId) {
        const extension = this.availableExtensions.get(extensionId);
        return {
            available: !!extension,
            installed: !!extension,
            active: extension?.isActive || false,
            recommendInstall: !extension
        };
    }
}
exports.ToolExecutor = ToolExecutor;


/***/ }),

/***/ "./src/docker/sandbox.ts":
/*!*******************************!*\
  !*** ./src/docker/sandbox.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DockerManager = void 0;
const events_1 = __webpack_require__(/*! events */ "events");
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const fs = __importStar(__webpack_require__(/*! fs/promises */ "fs/promises"));
class DockerManager extends events_1.EventEmitter {
    constructor(recommender) {
        super();
        this.recommender = recommender;
        this.containers = new Map();
        this.imageCache = new Map();
        this.networkIds = new Set();
        this.metrics = {
            totalContainers: 0,
            runningContainers: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            networkTraffic: 0,
            securityEvents: 0,
            containerHealth: new Map()
        };
        this.initializeDocker();
        this.startMonitoring();
        this.setupCleanup();
    }
    async createExtensionSandbox(extensionId, config) {
        const sandboxConfig = await this.buildContainerConfig(extensionId, config);
        const containerId = this.generateContainerId(extensionId);
        // Check if extension requires special permissions
        const extensionInfo = await this.recommender.getExtensionInfo(extensionId);
        if (extensionInfo?.security?.requiresIsolation) {
            sandboxConfig.security.capabilities.drop.push('NET_RAW', 'SYS_ADMIN');
        }
        const sandbox = {
            containerId,
            extensionId,
            status: 'creating',
            config: sandboxConfig,
            createdAt: new Date(),
            lastAccessed: new Date(),
            ports: sandboxConfig.ports.map(p => p.host),
            resources: {
                cpu: 0,
                memory: 0,
                network: 0
            }
        };
        this.containers.set(containerId, sandbox);
        this.emit('sandboxCreating', { containerId, extensionId });
        try {
            // Build container if image doesn't exist
            await this.ensureImage(sandboxConfig.image);
            // Create and start container
            const process = await this.startContainer(sandbox);
            sandbox.process = process;
            sandbox.status = 'running';
            this.metrics.totalContainers++;
            this.metrics.runningContainers++;
            this.emit('sandboxCreated', { containerId, extensionId });
            return sandbox;
        }
        catch (error) {
            sandbox.status = 'error';
            this.emit('sandboxError', {
                containerId,
                extensionId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    async stopSandbox(containerId) {
        const sandbox = this.containers.get(containerId);
        if (!sandbox) {
            throw new Error(`Sandbox ${containerId} not found`);
        }
        this.emit('sandboxStopping', { containerId, extensionId: sandbox.extensionId });
        try {
            // Stop container gracefully
            await this.executeDockerCommand(['stop', '-t', '10', containerId]);
            // Remove container
            await this.executeDockerCommand(['rm', containerId]);
            sandbox.status = 'stopped';
            if (sandbox.status === 'running') {
                this.metrics.runningContainers--;
            }
            this.emit('sandboxStopped', { containerId, extensionId: sandbox.extensionId });
        }
        catch (error) {
            this.emit('sandboxError', {
                containerId,
                extensionId: sandbox.extensionId,
                error: error instanceof Error ? error.message : 'Failed to stop container'
            });
            throw error;
        }
    }
    async restartSandbox(containerId) {
        const sandbox = this.containers.get(containerId);
        if (!sandbox) {
            throw new Error(`Sandbox ${containerId} not found`);
        }
        await this.stopSandbox(containerId);
        // Wait a moment for cleanup
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newSandbox = await this.createExtensionSandbox(sandbox.extensionId, sandbox.config);
        // Update container ID mapping
        this.containers.delete(containerId);
        this.containers.set(newSandbox.containerId, newSandbox);
    }
    async executeSandboxCommand(containerId, command) {
        const sandbox = this.containers.get(containerId);
        if (!sandbox || sandbox.status !== 'running') {
            throw new Error(`Sandbox ${containerId} is not running`);
        }
        sandbox.lastAccessed = new Date();
        try {
            const result = await this.executeDockerCommand(['exec', containerId, ...command]);
            this.emit('commandExecuted', { containerId, command, success: true });
            return result;
        }
        catch (error) {
            this.emit('commandExecuted', {
                containerId,
                command,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    async copyToSandbox(containerId, hostPath, containerPath) {
        const sandbox = this.containers.get(containerId);
        if (!sandbox || sandbox.status !== 'running') {
            throw new Error(`Sandbox ${containerId} is not running`);
        }
        try {
            await this.executeDockerCommand(['cp', hostPath, `${containerId}:${containerPath}`]);
            this.emit('fileCopied', { containerId, hostPath, containerPath, direction: 'to' });
        }
        catch (error) {
            this.emit('copyError', {
                containerId,
                hostPath,
                containerPath,
                direction: 'to',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    async copyFromSandbox(containerId, containerPath, hostPath) {
        const sandbox = this.containers.get(containerId);
        if (!sandbox || sandbox.status !== 'running') {
            throw new Error(`Sandbox ${containerId} is not running`);
        }
        try {
            await this.executeDockerCommand(['cp', `${containerId}:${containerPath}`, hostPath]);
            this.emit('fileCopied', { containerId, containerPath, hostPath, direction: 'from' });
        }
        catch (error) {
            this.emit('copyError', {
                containerId,
                containerPath,
                hostPath,
                direction: 'from',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    async getSandboxLogs(containerId, tail = 100) {
        const sandbox = this.containers.get(containerId);
        if (!sandbox) {
            throw new Error(`Sandbox ${containerId} not found`);
        }
        try {
            return await this.executeDockerCommand(['logs', '--tail', tail.toString(), containerId]);
        }
        catch (error) {
            throw new Error(`Failed to get logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getSandboxStatus(containerId) {
        return this.containers.get(containerId);
    }
    listSandboxes() {
        return Array.from(this.containers.values());
    }
    getSandboxesByExtension(extensionId) {
        return Array.from(this.containers.values()).filter(s => s.extensionId === extensionId);
    }
    getMetrics() {
        return { ...this.metrics };
    }
    async buildContainerConfig(extensionId, customConfig) {
        const baseConfig = {
            name: `vsembed-ext-${extensionId.replace(/[^a-zA-Z0-9]/g, '-')}`,
            image: 'vsembed/extension-runtime:latest',
            ports: [
                { host: await this.getAvailablePort(), container: 8080 }
            ],
            volumes: [
                { host: '/tmp/vsembed/workspace', container: '/workspace', readonly: false },
                { host: '/tmp/vsembed/extensions', container: '/extensions', readonly: true }
            ],
            environment: {
                'EXTENSION_ID': extensionId,
                'NODE_ENV': 'production',
                'VSCODE_EXTENSION_API_VERSION': '1.74.0'
            },
            resources: {
                memory: '512m',
                cpuLimit: '0.5',
                networkMode: 'vsembed-network'
            },
            security: {
                capabilities: {
                    add: [],
                    drop: ['ALL']
                },
                user: '1000:1000',
                readonlyRootfs: true
            }
        };
        // Apply extension-specific configurations
        const extensionInfo = await this.recommender.getExtensionInfo(extensionId);
        if (extensionInfo) {
            if (extensionInfo.resources?.memory) {
                baseConfig.resources.memory = extensionInfo.resources.memory;
            }
            if (extensionInfo.resources?.cpu) {
                baseConfig.resources.cpuLimit = extensionInfo.resources.cpu;
            }
            if (extensionInfo.security?.requiredCapabilities) {
                baseConfig.security.capabilities.add.push(...extensionInfo.security.requiredCapabilities);
            }
        }
        // Merge with custom configuration
        return this.mergeConfigs(baseConfig, customConfig || {});
    }
    mergeConfigs(base, custom) {
        return {
            ...base,
            ...custom,
            ports: custom.ports || base.ports,
            volumes: custom.volumes || base.volumes,
            environment: { ...base.environment, ...(custom.environment || {}) },
            resources: { ...base.resources, ...(custom.resources || {}) },
            security: {
                ...base.security,
                ...(custom.security || {}),
                capabilities: {
                    add: [...(base.security.capabilities.add || []), ...(custom.security?.capabilities?.add || [])],
                    drop: [...(base.security.capabilities.drop || []), ...(custom.security?.capabilities?.drop || [])]
                }
            }
        };
    }
    async ensureImage(imageName) {
        if (this.imageCache.has(imageName)) {
            return;
        }
        try {
            // Check if image exists locally
            await this.executeDockerCommand(['inspect', imageName]);
            this.imageCache.set(imageName, true);
        }
        catch (error) {
            // Image doesn't exist, build it
            await this.buildExtensionImage(imageName);
            this.imageCache.set(imageName, true);
        }
    }
    async buildExtensionImage(imageName) {
        this.emit('imageBuildStarted', { imageName });
        // Create Dockerfile for extension runtime
        const dockerfile = this.generateDockerfile();
        const buildContext = '/tmp/vsembed/build';
        await fs.mkdir(buildContext, { recursive: true });
        await fs.writeFile(path.join(buildContext, 'Dockerfile'), dockerfile);
        try {
            await this.executeDockerCommand(['build', '-t', imageName, buildContext]);
            this.emit('imageBuildCompleted', { imageName });
        }
        catch (error) {
            this.emit('imageBuildFailed', {
                imageName,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    generateDockerfile() {
        return `
FROM node:18-alpine

# Install VS Code dependencies
RUN apk add --no-cache \
    git \
    bash \
    curl \
    python3 \
    make \
    g++ \
    libx11 \
    libxkbfile \
    libsecret

# Create non-root user
RUN addgroup -g 1000 vscode && \
    adduser -u 1000 -G vscode -s /bin/bash -D vscode

# Install VS Code Server
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Create workspace directory
RUN mkdir -p /workspace /extensions /tmp/vscode-extensions
RUN chown -R vscode:vscode /workspace /extensions /tmp/vscode-extensions

# Copy extension runner script
COPY <<EOF /usr/local/bin/run-extension.sh
#!/bin/bash
set -e

# Initialize VS Code environment
export VSCODE_AGENT_FOLDER=/tmp/vscode-extensions
export VSCODE_EXTENSIONS_PATH=/extensions

# Start code-server with extension support
exec code-server \\
  --bind-addr 0.0.0.0:8080 \\
  --auth none \\
  --disable-telemetry \\
  --extensions-dir /extensions \\
  --user-data-dir /tmp/vscode-user \\
  /workspace
EOF

RUN chmod +x /usr/local/bin/run-extension.sh

# Switch to non-root user
USER vscode

# Set working directory
WORKDIR /workspace

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8080/healthz || exit 1

# Start extension runtime
CMD ["/usr/local/bin/run-extension.sh"]
`;
    }
    async startContainer(sandbox) {
        const { config } = sandbox;
        const dockerArgs = [
            'run',
            '-d',
            '--name', sandbox.containerId,
            '--memory', config.resources.memory,
            '--cpus', config.resources.cpuLimit,
            '--network', config.resources.networkMode,
            '--user', config.security.user,
            '--security-opt', 'no-new-privileges:true'
        ];
        // Add readonly root filesystem if specified
        if (config.security.readonlyRootfs) {
            dockerArgs.push('--read-only');
            dockerArgs.push('--tmpfs', '/tmp:exec,size=100m');
            dockerArgs.push('--tmpfs', '/var/tmp:exec,size=100m');
        }
        // Add capabilities
        config.security.capabilities.drop.forEach(cap => {
            dockerArgs.push('--cap-drop', cap);
        });
        config.security.capabilities.add.forEach(cap => {
            dockerArgs.push('--cap-add', cap);
        });
        // Add seccomp profile if specified
        if (config.security.seccompProfile) {
            dockerArgs.push('--security-opt', `seccomp=${config.security.seccompProfile}`);
        }
        // Add port mappings
        config.ports.forEach(port => {
            dockerArgs.push('-p', `${port.host}:${port.container}`);
        });
        // Add volume mounts
        config.volumes.forEach(volume => {
            const mount = volume.readonly ? `${volume.host}:${volume.container}:ro` : `${volume.host}:${volume.container}`;
            dockerArgs.push('-v', mount);
        });
        // Add environment variables
        Object.entries(config.environment).forEach(([key, value]) => {
            dockerArgs.push('-e', `${key}=${value}`);
        });
        // Add image
        dockerArgs.push(config.image);
        const process = (0, child_process_1.spawn)('docker', dockerArgs, {
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: false
        });
        return new Promise((resolve, reject) => {
            let output = '';
            let errorOutput = '';
            process.stdout?.on('data', (data) => {
                output += data.toString();
            });
            process.stderr?.on('data', (data) => {
                errorOutput += data.toString();
            });
            process.on('close', (code) => {
                if (code === 0) {
                    resolve(process);
                }
                else {
                    reject(new Error(`Docker container failed to start: ${errorOutput}`));
                }
            });
            process.on('error', (error) => {
                reject(error);
            });
            // Timeout after 30 seconds
            setTimeout(() => {
                if (!process.killed) {
                    process.kill();
                    reject(new Error('Container startup timeout'));
                }
            }, 30000);
        });
    }
    async executeDockerCommand(args) {
        return new Promise((resolve, reject) => {
            const process = (0, child_process_1.spawn)('docker', args, {
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let output = '';
            let errorOutput = '';
            process.stdout?.on('data', (data) => {
                output += data.toString();
            });
            process.stderr?.on('data', (data) => {
                errorOutput += data.toString();
            });
            process.on('close', (code) => {
                if (code === 0) {
                    resolve(output.trim());
                }
                else {
                    reject(new Error(`Docker command failed: ${errorOutput}`));
                }
            });
            process.on('error', (error) => {
                reject(error);
            });
        });
    }
    async getAvailablePort() {
        // Simple port allocation - in production, use proper port management
        return 8080 + Math.floor(Math.random() * 1000);
    }
    generateContainerId(extensionId) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        const sanitized = extensionId.replace(/[^a-zA-Z0-9]/g, '-');
        return `vsembed-${sanitized}-${timestamp}-${random}`;
    }
    async initializeDocker() {
        try {
            // Check if Docker is available
            await this.executeDockerCommand(['version']);
            // Create custom network for VSEmbed
            try {
                await this.executeDockerCommand([
                    'network', 'create',
                    '--driver', 'bridge',
                    '--subnet', '172.20.0.0/16',
                    '--opt', 'com.docker.network.bridge.enable_icc=false',
                    'vsembed-network'
                ]);
                this.networkIds.add('vsembed-network');
            }
            catch (error) {
                // Network might already exist
                console.log('VSEmbed network already exists or failed to create');
            }
            this.emit('dockerInitialized');
        }
        catch (error) {
            this.emit('dockerError', { error: 'Docker not available' });
            throw new Error('Docker is not available or not running');
        }
    }
    startMonitoring() {
        this.monitoringInterval = setInterval(async () => {
            await this.updateMetrics();
        }, 10000); // Every 10 seconds
    }
    async updateMetrics() {
        try {
            // Update container health status
            for (const [containerId, sandbox] of this.containers) {
                if (sandbox.status === 'running') {
                    try {
                        const healthOutput = await this.executeDockerCommand(['inspect', '--format={{.State.Health.Status}}', containerId]);
                        const isHealthy = healthOutput.trim() === 'healthy';
                        this.metrics.containerHealth.set(containerId, isHealthy);
                        if (!isHealthy) {
                            this.emit('containerUnhealthy', { containerId, extensionId: sandbox.extensionId });
                        }
                    }
                    catch (error) {
                        this.metrics.containerHealth.set(containerId, false);
                        this.emit('containerUnhealthy', { containerId, extensionId: sandbox.extensionId });
                    }
                }
            }
            // Update overall metrics
            this.metrics.runningContainers = Array.from(this.containers.values())
                .filter(s => s.status === 'running').length;
            this.emit('metricsUpdated', this.metrics);
        }
        catch (error) {
            console.error('Failed to update Docker metrics:', error);
        }
    }
    setupCleanup() {
        this.cleanupInterval = setInterval(async () => {
            await this.cleanupIdleContainers();
        }, 60000); // Every minute
    }
    async cleanupIdleContainers() {
        const idleThreshold = 30 * 60 * 1000; // 30 minutes
        const now = new Date();
        for (const [containerId, sandbox] of this.containers) {
            const idleTime = now.getTime() - sandbox.lastAccessed.getTime();
            if (idleTime > idleThreshold && sandbox.status === 'running') {
                try {
                    await this.stopSandbox(containerId);
                    this.emit('containerCleaned', { containerId, extensionId: sandbox.extensionId, idleTime });
                }
                catch (error) {
                    console.error(`Failed to cleanup container ${containerId}:`, error);
                }
            }
        }
    }
    async shutdown() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        // Stop all running containers
        const stopPromises = Array.from(this.containers.keys()).map(containerId => this.stopSandbox(containerId).catch(console.error));
        await Promise.all(stopPromises);
        // Clean up networks
        for (const networkId of this.networkIds) {
            try {
                await this.executeDockerCommand(['network', 'rm', networkId]);
            }
            catch (error) {
                console.error(`Failed to remove network ${networkId}:`, error);
            }
        }
        this.emit('shutdown');
    }
}
exports.DockerManager = DockerManager;


/***/ }),

/***/ "./src/extensions/recommender.ts":
/*!***************************************!*\
  !*** ./src/extensions/recommender.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtensionRecommender = void 0;
class ExtensionRecommender {
    constructor() {
        this.contextRules = {
            // Language-based recommendations
            'package.json': [
                'esbenp.prettier-vscode',
                'dbaeumer.vscode-eslint',
                'bradlc.vscode-tailwindcss',
                'ms-vscode.vscode-typescript-next'
            ],
            '*.py': [
                'ms-python.python',
                'ms-python.pylint',
                'ms-python.black-formatter',
                'ms-toolsai.jupyter'
            ],
            '*.go': ['golang.go'],
            '*.rs': ['rust-lang.rust-analyzer'],
            '*.java': ['redhat.java', 'vscjava.vscode-java-pack'],
            '*.cs': ['ms-dotnettools.csharp'],
            '*.php': ['bmewburn.vscode-intelephense-client'],
            '*.rb': ['rebornix.ruby'],
            // Framework-based recommendations
            'Dockerfile': [
                'ms-azuretools.vscode-docker',
                'ms-kubernetes-tools.vscode-kubernetes-tools'
            ],
            'docker-compose.yml': ['ms-azuretools.vscode-docker'],
            '.terraform': ['hashicorp.terraform'],
            'requirements.txt': ['ms-python.python'],
            'Cargo.toml': ['rust-lang.rust-analyzer'],
            'go.mod': ['golang.go'],
            'pom.xml': ['redhat.java'],
            'build.gradle': ['redhat.java'],
            // Security and DevOps
            '.github/workflows': ['github.vscode-github-actions'],
            '.gitlab-ci.yml': ['gitlab.gitlab-workflow'],
            'ansible.cfg': ['redhat.ansible'],
            // Database
            '*.sql': ['ms-mssql.mssql'],
            'schema.prisma': ['prisma.prisma'],
            // Configuration
            '.env': ['mikestead.dotenv'],
            '*.toml': ['tamasfe.even-better-toml'],
            '*.yaml': ['redhat.vscode-yaml'],
            '*.yml': ['redhat.vscode-yaml']
        };
        this.taskBasedRules = {
            'docker': ['ms-azuretools.vscode-docker'],
            'kubernetes': ['ms-kubernetes-tools.vscode-kubernetes-tools'],
            'security': ['kali-linux.security-tools'],
            'testing': ['ms-vscode.test-adapter-converter'],
            'debugging': ['ms-vscode.vscode-js-debug'],
            'git': ['eamodio.gitlens'],
            'database': ['ms-mssql.mssql', 'mtxr.sqltools'],
            'api': ['humao.rest-client', 'ms-vscode.vscode-thunder-client'],
            'documentation': ['yzhang.markdown-all-in-one', 'shd101wyy.markdown-preview-enhanced']
        };
    }
    recommendExtensions(context) {
        const recommendations = [];
        // File-based recommendations
        context.files.forEach(file => {
            const matched = Object.entries(this.contextRules)
                .filter(([pattern]) => this.matchesPattern(pattern, file.path));
            matched.forEach(([pattern, extIds]) => {
                extIds.forEach(extId => {
                    if (!context.installedExtensions.includes(extId)) {
                        recommendations.push({
                            extensionId: extId,
                            reason: `Recommended for ${this.getFileType(pattern)} files`,
                            urgency: this.getUrgency(extId, pattern),
                            category: this.getCategory(extId),
                            requiredForTask: file.path
                        });
                    }
                });
            });
        });
        // Task-based recommendations
        if (context.aiTask) {
            const taskKeywords = context.aiTask.toLowerCase();
            Object.entries(this.taskBasedRules).forEach(([task, extIds]) => {
                if (taskKeywords.includes(task)) {
                    extIds.forEach(extId => {
                        if (!context.installedExtensions.includes(extId)) {
                            recommendations.push({
                                extensionId: extId,
                                reason: `Required for ${task} operations`,
                                urgency: 'high',
                                category: 'task-specific',
                                requiredForTask: context.aiTask
                            });
                        }
                    });
                }
            });
        }
        // Dependency-based recommendations
        Object.entries(context.dependencies).forEach(([dep, version]) => {
            const extId = this.getDependencyExtension(dep);
            if (extId && !context.installedExtensions.includes(extId)) {
                recommendations.push({
                    extensionId: extId,
                    reason: `Enhances support for ${dep}`,
                    urgency: 'medium',
                    category: 'dependency',
                    requiredForTask: `${dep}@${version}`
                });
            }
        });
        return this.dedupeAndPrioritize(recommendations);
    }
    matchesPattern(pattern, filePath) {
        if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace('*', '.*'));
            return regex.test(filePath);
        }
        return filePath.includes(pattern);
    }
    getFileType(pattern) {
        if (pattern.includes('.')) {
            return pattern.split('.').pop() || 'file';
        }
        return pattern;
    }
    getUrgency(extensionId, pattern) {
        // Essential language servers are high priority
        const essential = [
            'ms-python.python',
            'ms-vscode.vscode-typescript-next',
            'golang.go',
            'rust-lang.rust-analyzer'
        ];
        if (essential.includes(extensionId))
            return 'high';
        // Formatters and linters are medium priority
        if (extensionId.includes('prettier') || extensionId.includes('eslint')) {
            return 'medium';
        }
        return 'low';
    }
    getCategory(extensionId) {
        if (extensionId.includes('python'))
            return 'language';
        if (extensionId.includes('docker'))
            return 'containerization';
        if (extensionId.includes('prettier') || extensionId.includes('eslint'))
            return 'formatting';
        if (extensionId.includes('git'))
            return 'version-control';
        return 'utility';
    }
    getDependencyExtension(dependency) {
        const depMap = {
            'react': 'ms-vscode.vscode-typescript-next',
            'vue': 'vue.volar',
            'angular': 'angular.ng-template',
            'svelte': 'svelte.svelte-vscode',
            'prisma': 'prisma.prisma',
            'graphql': 'graphql.vscode-graphql',
            'jest': 'orta.vscode-jest',
            'cypress': 'cypress-io.vscode-cypress',
            'tailwindcss': 'bradlc.vscode-tailwindcss'
        };
        return depMap[dependency] || null;
    }
    dedupeAndPrioritize(recommendations) {
        const seen = new Set();
        const deduped = recommendations.filter(rec => {
            if (seen.has(rec.extensionId))
                return false;
            seen.add(rec.extensionId);
            return true;
        });
        // Sort by urgency and category
        return deduped.sort((a, b) => {
            const urgencyOrder = { high: 3, medium: 2, low: 1 };
            const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
            if (urgencyDiff !== 0)
                return urgencyDiff;
            // Secondary sort by category importance
            const categoryOrder = { language: 4, formatting: 3, 'task-specific': 2, utility: 1 };
            return (categoryOrder[b.category] || 0) -
                (categoryOrder[a.category] || 0);
        });
    }
    getInstallationScript(recommendations) {
        return recommendations.map(rec => `code --install-extension ${rec.extensionId}`);
    }
    generateInstallCommand(extensionIds) {
        return extensionIds
            .map(id => `--install-extension ${id}`)
            .join(' ');
    }
}
exports.ExtensionRecommender = ExtensionRecommender;


/***/ }),

/***/ "./src/main/main.ts":
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const AIOrchestratorService_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './services/AIOrchestratorService'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const WorkspaceManager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './services/WorkspaceManager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const SecretsManager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './services/SecretsManager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const RunnerManager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './services/RunnerManager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const SecurityManager_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './services/SecurityManager'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const vscode_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../electron/vscode'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const middleware_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../permissions/middleware'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const streaming_1 = __webpack_require__(/*! ../ai/streaming */ "./src/ai/streaming.ts");
const optimizer_1 = __webpack_require__(/*! ../performance/optimizer */ "./src/performance/optimizer.ts");
const sandbox_1 = __webpack_require__(/*! ../docker/sandbox */ "./src/docker/sandbox.ts");
const recommender_1 = __webpack_require__(/*! ../extensions/recommender */ "./src/extensions/recommender.ts");
class VSEmbedApplication {
    constructor() {
        this.mainWindow = null;
        this.orchestrator = new AIOrchestratorService_1.AIOrchestratorService();
        this.workspaceManager = new WorkspaceManager_1.WorkspaceManager();
        this.secretsManager = new SecretsManager_1.SecretsManager();
        this.runnerManager = new RunnerManager_1.RunnerManager();
        this.securityManager = new SecurityManager_1.SecurityManager();
        // Initialize new components - ALL PROPERLY WIRED
        this.extensionRecommender = new recommender_1.ExtensionRecommender();
        this.vscodeBridge = new vscode_1.VSCodeBridge();
        this.permissionMiddleware = new middleware_1.PermissionMiddleware();
        this.aiStream = new streaming_1.AIStream(8081);
        this.performanceOptimizer = new optimizer_1.PerformanceOptimizer(optimizer_1.defaultOptimizationConfig);
        this.dockerManager = new sandbox_1.DockerManager(this.extensionRecommender);
        this.setupAppHandlers();
        this.setupIpcHandlers();
        this.setupNewComponentHandlers();
        this.setupShutdownHandlers();
    }
    setupAppHandlers() {
        electron_1.app.whenReady().then(() => {
            this.createMainWindow();
            this.createMenu();
        });
        electron_1.app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                electron_1.app.quit();
            }
        });
        electron_1.app.on('activate', () => {
            if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                this.createMainWindow();
            }
        });
        electron_1.app.on('web-contents-created', (event, contents) => {
            contents.on('new-window', (event, navigationUrl) => {
                event.preventDefault();
                if (!navigationUrl.startsWith('http://localhost:')) {
                    console.warn('Blocked navigation to:', navigationUrl);
                }
            });
        });
    }
    createMainWindow() {
        this.mainWindow = new electron_1.BrowserWindow({
            width: 1400,
            height: 900,
            minWidth: 800,
            minHeight: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                preload: path.join(__dirname, 'preload.js'),
                webSecurity: true,
                allowRunningInsecureContent: false,
            },
            titleBarStyle: 'default',
            show: false,
        });
        if (true) {
            this.mainWindow.loadURL('http://localhost:3000');
            this.mainWindow.webContents.openDevTools();
        }
        else // removed by dead control flow
{}
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow?.show();
        });
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
    createMenu() {
        const template = [
            {
                label: 'File',
                submenu: [
                    { label: 'New Workspace', accelerator: 'CmdOrCtrl+N', click: () => this.handleNewWorkspace() },
                    { label: 'Open Workspace', accelerator: 'CmdOrCtrl+O', click: () => this.handleOpenWorkspace() },
                    { label: 'Export Workspace', accelerator: 'CmdOrCtrl+E', click: () => this.handleExportWorkspace() },
                    { type: 'separator' },
                    { label: 'Settings', accelerator: 'CmdOrCtrl+,', click: () => this.handleSettings() },
                    { type: 'separator' },
                    { label: 'Quit', accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q', click: () => electron_1.app.quit() }
                ]
            },
            {
                label: 'AI',
                submenu: [
                    { label: 'Clear Conversation', click: () => this.handleClearConversation() },
                    { label: 'Change Model', click: () => this.handleChangeModel() },
                    { type: 'separator' },
                    { label: 'AI Settings', click: () => this.handleAISettings() }
                ]
            },
            {
                label: 'Developer',
                submenu: [
                    { label: 'Performance Report', click: () => this.handlePerformanceReport() },
                    { label: 'Docker Status', click: () => this.handleDockerStatus() },
                    { label: 'Permission Audit', click: () => this.handlePermissionAudit() }
                ]
            }
        ];
        const menu = electron_1.Menu.buildFromTemplate(template);
        electron_1.Menu.setApplicationMenu(menu);
    }
    setupAppHandlers() {
        electron_1.app.whenReady().then(() => {
            this.createMainWindow();
            this.createMenu();
        });
        electron_1.app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                electron_1.app.quit();
            }
        });
        electron_1.app.on('activate', () => {
            if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                this.createMainWindow();
            }
        });
        // Security: Prevent new window creation
        electron_1.app.on('web-contents-created', (event, contents) => {
            contents.on('new-window', (event, navigationUrl) => {
                event.preventDefault();
                // Only allow navigation to localhost for preview
                if (!navigationUrl.startsWith('http://localhost:')) {
                    console.warn('Blocked navigation to:', navigationUrl);
                }
            });
        });
    }
    createMainWindow() {
        this.mainWindow = new electron_1.BrowserWindow({
            width: 1400,
            height: 900,
            minWidth: 800,
            minHeight: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                preload: path.join(__dirname, 'preload.js'),
                webSecurity: true,
                allowRunningInsecureContent: false,
            },
            titleBarStyle: 'default',
            show: false,
        });
        // Load the React application
        if (true) {
            this.mainWindow.loadURL('http://localhost:3000');
            this.mainWindow.webContents.openDevTools();
        }
        else // removed by dead control flow
{}
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow?.show();
        });
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
    createMenu() {
        const template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'New Workspace',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => this.handleNewWorkspace(),
                    },
                    {
                        label: 'Open Workspace',
                        accelerator: 'CmdOrCtrl+O',
                        click: () => this.handleOpenWorkspace(),
                    },
                    {
                        label: 'Export Workspace',
                        accelerator: 'CmdOrCtrl+E',
                        click: () => this.handleExportWorkspace(),
                    },
                    { type: 'separator' },
                    {
                        label: 'Settings',
                        accelerator: 'CmdOrCtrl+,',
                        click: () => this.handleSettings(),
                    },
                    { type: 'separator' },
                    {
                        label: 'Quit',
                        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                        click: () => electron_1.app.quit(),
                    },
                ],
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                ],
            },
            {
                label: 'AI',
                submenu: [
                    {
                        label: 'Clear Conversation',
                        click: () => this.handleClearConversation(),
                    },
                    {
                        label: 'Change Model',
                        click: () => this.handleChangeModel(),
                    },
                    { type: 'separator' },
                    {
                        label: 'AI Settings',
                        click: () => this.handleAISettings(),
                    },
                ],
            },
            {
                label: 'Runner',
                submenu: [
                    {
                        label: 'Start',
                        accelerator: 'F5',
                        click: () => this.handleStartRunner(),
                    },
                    {
                        label: 'Stop',
                        accelerator: 'Shift+F5',
                        click: () => this.handleStopRunner(),
                    },
                    {
                        label: 'Restart',
                        accelerator: 'Ctrl+F5',
                        click: () => this.handleRestartRunner(),
                    },
                    { type: 'separator' },
                    {
                        label: 'View Logs',
                        click: () => this.handleViewLogs(),
                    },
                ],
            },
            {
                label: 'Security',
                submenu: [
                    {
                        label: 'Manage Secrets',
                        click: () => this.handleManageSecrets(),
                    },
                    {
                        label: 'View Audit Log',
                        click: () => this.handleViewAuditLog(),
                    },
                    {
                        label: 'Security Settings',
                        click: () => this.handleSecuritySettings(),
                    },
                ],
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About',
                        click: () => this.handleAbout(),
                    },
                    {
                        label: 'Documentation',
                        click: () => this.handleDocumentation(),
                    },
                ],
            },
        ];
        const menu = electron_1.Menu.buildFromTemplate(template);
        electron_1.Menu.setApplicationMenu(menu);
    }
    setupIpcHandlers() {
        // Workspace operations
        electron_1.ipcMain.handle('workspace:create', async (event, name, template) => {
            return await this.workspaceManager.createWorkspace(name, template);
        });
        electron_1.ipcMain.handle('workspace:open', async (event, path) => {
            return await this.workspaceManager.openWorkspace(path);
        });
        electron_1.ipcMain.handle('workspace:export', async (event, targetPath) => {
            return await this.workspaceManager.exportWorkspace(targetPath);
        });
        electron_1.ipcMain.handle('workspace:import', async (event, archivePath) => {
            return await this.workspaceManager.importWorkspace(archivePath);
        });
        // AI Orchestrator operations
        electron_1.ipcMain.handle('ai:process-request', async (event, userInput, context) => {
            return await this.orchestrator.processRequest(userInput, context);
        });
        electron_1.ipcMain.handle('ai:execute-plan', async (event, planId) => {
            return await this.orchestrator.executeActionPlan(planId);
        });
        electron_1.ipcMain.handle('ai:get-models', async () => {
            return await this.orchestrator.getAvailableModels();
        });
        electron_1.ipcMain.handle('ai:set-model', async (event, modelName) => {
            return await this.orchestrator.setModel(modelName);
        });
        // Runner operations
        electron_1.ipcMain.handle('runner:start', async (event, config) => {
            return await this.runnerManager.start(config);
        });
        electron_1.ipcMain.handle('runner:stop', async () => {
            return await this.runnerManager.stop();
        });
        electron_1.ipcMain.handle('runner:status', async () => {
            return await this.runnerManager.status();
        });
        electron_1.ipcMain.handle('runner:build', async (event, config) => {
            return await this.runnerManager.build(config);
        });
        // Secrets operations
        electron_1.ipcMain.handle('secrets:set', async (event, key, value) => {
            return await this.secretsManager.setSecret(key, value);
        });
        electron_1.ipcMain.handle('secrets:get', async (event, key, requester) => {
            return await this.secretsManager.getSecret(key, requester);
        });
        electron_1.ipcMain.handle('secrets:list', async () => {
            return await this.secretsManager.listSecrets();
        });
        // Security operations
        electron_1.ipcMain.handle('security:request-approval', async (event, summary, riskLevel, details) => {
            return await this.securityManager.requestApproval(summary, riskLevel, details);
        });
        electron_1.ipcMain.handle('security:log-action', async (event, actionType, metadata, riskLevel) => {
            return await this.securityManager.logAction(actionType, metadata, riskLevel);
        });
    }
    setupNewComponentHandlers() {
        // VS Code Bridge operations
        electron_1.ipcMain.handle('vscode:execute-command', async (event, command, args) => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.commands', { command, args });
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return await this.vscodeBridge.executeCommand(command, args);
        });
        electron_1.ipcMain.handle('vscode:get-file-content', async (event, filePath) => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.files.read', { filePath });
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return await this.vscodeBridge.getFileContent(filePath);
        });
        electron_1.ipcMain.handle('vscode:write-file', async (event, filePath, content) => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'vscode.files.write', { filePath, content });
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return await this.vscodeBridge.writeFile(filePath, content);
        });
        electron_1.ipcMain.handle('vscode:get-hover-info', async (event, filePath, position) => {
            return await this.vscodeBridge.getHoverInfo(filePath, position);
        });
        electron_1.ipcMain.handle('vscode:get-completions', async (event, filePath, position) => {
            return await this.vscodeBridge.getCompletions(filePath, position);
        });
        electron_1.ipcMain.handle('vscode:get-definitions', async (event, filePath, position) => {
            return await this.vscodeBridge.getDefinitions(filePath, position);
        });
        electron_1.ipcMain.handle('vscode:get-references', async (event, filePath, position) => {
            return await this.vscodeBridge.getReferences(filePath, position);
        });
        // Extension operations
        electron_1.ipcMain.handle('extensions:recommend', async (event, context) => {
            return await this.extensionRecommender.recommendExtensions(context);
        });
        electron_1.ipcMain.handle('extensions:install', async (event, extensionId) => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'extensions.install', { extensionId });
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return await this.extensionRecommender.installExtension(extensionId);
        });
        electron_1.ipcMain.handle('extensions:get-info', async (event, extensionId) => {
            return await this.extensionRecommender.getExtensionInfo(extensionId);
        });
        // Docker sandbox operations
        electron_1.ipcMain.handle('docker:create-sandbox', async (event, extensionId, config) => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'docker.create', { extensionId, config });
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return await this.dockerManager.createExtensionSandbox(extensionId, config);
        });
        electron_1.ipcMain.handle('docker:stop-sandbox', async (event, containerId) => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'docker.stop', { containerId });
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return await this.dockerManager.stopSandbox(containerId);
        });
        electron_1.ipcMain.handle('docker:execute-command', async (event, containerId, command) => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'docker.execute', { containerId, command });
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return await this.dockerManager.executeSandboxCommand(containerId, command);
        });
        electron_1.ipcMain.handle('docker:get-logs', async (event, containerId, tail) => {
            return await this.dockerManager.getSandboxLogs(containerId, tail);
        });
        electron_1.ipcMain.handle('docker:list-sandboxes', async () => {
            return this.dockerManager.listSandboxes();
        });
        electron_1.ipcMain.handle('docker:get-metrics', async () => {
            return this.dockerManager.getMetrics();
        });
        // Performance operations
        electron_1.ipcMain.handle('performance:get-metrics', async () => {
            return this.performanceOptimizer.getMetrics();
        });
        electron_1.ipcMain.handle('performance:generate-report', async () => {
            return this.performanceOptimizer.generateReport();
        });
        electron_1.ipcMain.handle('performance:get-recommendations', async () => {
            return this.performanceOptimizer.getOptimizationRecommendations();
        });
        electron_1.ipcMain.handle('performance:force-gc', async () => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'performance.gc');
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return this.performanceOptimizer.forceGarbageCollection();
        });
        // Permission middleware operations
        electron_1.ipcMain.handle('permissions:check', async (event, actor, resource, context) => {
            return await this.permissionMiddleware.checkPermission(actor, resource, context);
        });
        electron_1.ipcMain.handle('permissions:get-policies', async () => {
            return this.permissionMiddleware.getPolicies();
        });
        electron_1.ipcMain.handle('permissions:update-policy', async (event, policyId, updates) => {
            const permission = await this.permissionMiddleware.checkPermission('user', 'permissions.policy.update', { policyId, updates });
            if (!permission.allowed) {
                throw new Error(`Permission denied: ${permission.reason}`);
            }
            return this.permissionMiddleware.updatePolicy(policyId, updates);
        });
        electron_1.ipcMain.handle('permissions:get-audit-log', async (event, filters) => {
            return this.permissionMiddleware.getAuditLog(filters);
        });
        // AI Streaming operations
        electron_1.ipcMain.handle('ai-stream:get-connection-info', async () => {
            return {
                port: 8081,
                url: 'ws://localhost:8081',
                connections: this.aiStream.getActiveConnections(),
                streams: this.aiStream.getActiveStreams()
            };
        });
        // Event forwarding from components
        this.setupEventForwarding();
    }
    setupEventForwarding() {
        // Forward Docker events to renderer
        this.dockerManager.on('sandboxCreated', (data) => {
            this.mainWindow?.webContents.send('docker:sandbox-created', data);
        });
        this.dockerManager.on('sandboxStopped', (data) => {
            this.mainWindow?.webContents.send('docker:sandbox-stopped', data);
        });
        this.dockerManager.on('sandboxError', (data) => {
            this.mainWindow?.webContents.send('docker:sandbox-error', data);
        });
        // Forward performance events to renderer
        this.performanceOptimizer.on('memoryUpdate', (data) => {
            this.mainWindow?.webContents.send('performance:memory-update', data);
        });
        this.performanceOptimizer.on('timing', (data) => {
            this.mainWindow?.webContents.send('performance:timing', data);
        });
        // Forward permission events to renderer
        this.permissionMiddleware.on('permissionDenied', (data) => {
            this.mainWindow?.webContents.send('permissions:denied', data);
        });
        this.permissionMiddleware.on('auditEvent', (data) => {
            this.mainWindow?.webContents.send('permissions:audit-event', data);
        });
        // Forward VS Code bridge events to renderer
        this.vscodeBridge.on('extensionInstalled', (data) => {
            this.mainWindow?.webContents.send('vscode:extension-installed', data);
        });
        this.vscodeBridge.on('languageServerReady', (data) => {
            this.mainWindow?.webContents.send('vscode:language-server-ready', data);
        });
    }
    // Menu handlers
    async handleNewWorkspace() {
        this.mainWindow?.webContents.send('menu:new-workspace');
    }
    async handleOpenWorkspace() {
        const result = await electron_1.dialog.showOpenDialog(this.mainWindow, {
            properties: ['openDirectory'],
            title: 'Select Workspace Directory',
        });
        if (!result.canceled && result.filePaths.length > 0) {
            const workspacePath = result.filePaths[0];
            this.mainWindow?.webContents.send('workspace:open', workspacePath);
        }
    }
    async handleExportWorkspace() {
        const result = await electron_1.dialog.showSaveDialog(this.mainWindow, {
            title: 'Export Workspace',
            defaultPath: 'workspace.tar.gz',
            filters: [
                { name: 'Workspace Archive', extensions: ['tar.gz', 'zip'] },
            ],
        });
        if (!result.canceled && result.filePath) {
            this.mainWindow?.webContents.send('workspace:export', result.filePath);
        }
    }
    async handleSettings() {
        this.mainWindow?.webContents.send('menu:settings');
    }
    async handleClearConversation() {
        this.mainWindow?.webContents.send('ai:clear-conversation');
    }
    async handleChangeModel() {
        this.mainWindow?.webContents.send('ai:change-model');
    }
    async handleAISettings() {
        this.mainWindow?.webContents.send('ai:settings');
    }
    async handleStartRunner() {
        this.mainWindow?.webContents.send('runner:start');
    }
    async handleStopRunner() {
        this.mainWindow?.webContents.send('runner:stop');
    }
    async handleRestartRunner() {
        this.mainWindow?.webContents.send('runner:restart');
    }
    async handleViewLogs() {
        this.mainWindow?.webContents.send('runner:view-logs');
    }
    async handleManageSecrets() {
        this.mainWindow?.webContents.send('security:manage-secrets');
    }
    async handleViewAuditLog() {
        this.mainWindow?.webContents.send('security:view-audit-log');
    }
    async handleSecuritySettings() {
        this.mainWindow?.webContents.send('security:settings');
    }
    async handlePerformanceReport() {
        this.mainWindow?.webContents.send('performance:report');
    }
    async handleDockerStatus() {
        this.mainWindow?.webContents.send('docker:status');
    }
    async handlePermissionAudit() {
        this.mainWindow?.webContents.send('permissions:audit');
    }
    async handleAbout() {
        electron_1.dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: 'About VSEmbed AI DevTool',
            message: 'VSEmbed AI DevTool',
            detail: 'Portable, embeddable AI-powered development environment\nVersion 0.1.0\nCopyright (c) 2025 Sheewi',
        });
    }
    async handleDocumentation() {
        // Open documentation URL
        (__webpack_require__(/*! electron */ "electron").shell).openExternal('https://github.com/Sheewi/VsEmbed#readme');
    }
}
// Initialize the application
new VSEmbedApplication();


/***/ }),

/***/ "./src/performance sync recursive":
/*!*******************************!*\
  !*** ./src/performance/ sync ***!
  \*******************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/performance sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/performance/optimizer.ts":
/*!**************************************!*\
  !*** ./src/performance/optimizer.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultOptimizationConfig = exports.PerformanceOptimizer = void 0;
const events_1 = __webpack_require__(/*! events */ "events");
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const lru_cache_1 = __webpack_require__(/*! lru-cache */ "./node_modules/lru-cache/index.js");
class IntelligentCache extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.accessPatterns = new Map();
        this.cache = new lru_cache_1.LRUCache({
            max: config.maxSize,
            ttl: config.ttl,
            updateAgeOnGet: true,
            allowStale: false,
            sizeCalculation: (entry) => entry.size
        });
        this.compressionEnabled = config.enableCompression;
        if (config.persistToDisk) {
            this.setupPersistence();
        }
        this.setupMonitoring();
    }
    set(key, value, ttl) {
        const entry = {
            key,
            value,
            timestamp: Date.now(),
            hits: 0,
            size: this.calculateSize(value),
            ttl
        };
        // Track access patterns
        this.recordAccess(key);
        this.cache.set(key, entry);
        this.emit('set', { key, size: entry.size });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (entry) {
            entry.hits++;
            this.recordAccess(key);
            this.emit('hit', { key, hits: entry.hits });
            return entry.value;
        }
        this.emit('miss', { key });
        return undefined;
    }
    has(key) {
        return this.cache.has(key);
    }
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.emit('delete', { key });
        }
        return deleted;
    }
    clear() {
        this.cache.clear();
        this.accessPatterns.clear();
        this.emit('clear');
    }
    getStats() {
        const hits = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0);
        const totalRequests = hits + this.cache.size;
        return {
            size: this.cache.size,
            maxSize: this.cache.max,
            hitRate: totalRequests > 0 ? hits / totalRequests : 0,
            memoryUsage: this.cache.calculatedSize || 0
        };
    }
    // Predictive caching based on access patterns
    getPredictedKeys() {
        const predictions = [];
        this.accessPatterns.forEach((accesses, key) => {
            if (accesses.length >= 3) {
                // Calculate frequency and recency score
                const now = Date.now();
                const recentAccesses = accesses.filter(time => now - time < 300000); // 5 minutes
                const frequency = recentAccesses.length / accesses.length;
                const recency = Math.max(0, 1 - (now - Math.max(...accesses)) / 300000);
                predictions.push({
                    key,
                    score: frequency * 0.7 + recency * 0.3
                });
            }
        });
        return predictions
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(p => p.key);
    }
    recordAccess(key) {
        const accesses = this.accessPatterns.get(key) || [];
        accesses.push(Date.now());
        // Keep only last 50 accesses
        if (accesses.length > 50) {
            accesses.splice(0, accesses.length - 50);
        }
        this.accessPatterns.set(key, accesses);
    }
    calculateSize(value) {
        return JSON.stringify(value).length;
    }
    setupPersistence() {
        // Simplified persistence - in production, use proper serialization
        this.persistPath = vscode.workspace.getConfiguration().get('vsembed.cache.path');
    }
    setupMonitoring() {
        setInterval(() => {
            const stats = this.getStats();
            this.emit('stats', stats);
            // Auto-cleanup if memory usage is high
            if (stats.memoryUsage > this.config.maxSize * 0.9) {
                this.performCleanup();
            }
        }, 30000); // Every 30 seconds
    }
    performCleanup() {
        // Remove least recently used items with low hit rates
        const entries = Array.from(this.cache.entries());
        const candidates = entries
            .map(([key, entry]) => ({ key, entry }))
            .filter(({ entry }) => entry.hits < 2)
            .sort((a, b) => a.entry.timestamp - b.entry.timestamp);
        const toRemove = Math.min(candidates.length, Math.floor(this.cache.size * 0.1));
        for (let i = 0; i < toRemove; i++) {
            this.cache.delete(candidates[i].key);
        }
        this.emit('cleanup', { removed: toRemove });
    }
}
class LazyModuleLoader extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.loadedModules = new Set();
        this.preloadQueue = [];
        this.isLoading = new Map();
        this.setupPreloading();
    }
    async loadModule(modulePath) {
        if (this.loadedModules.has(modulePath)) {
            this.emit('hit', { module: modulePath });
            return __webpack_require__("./src/performance sync recursive")(modulePath);
        }
        // Check if already loading
        const existingLoad = this.isLoading.get(modulePath);
        if (existingLoad) {
            return existingLoad;
        }
        const loadPromise = this.performLoad(modulePath);
        this.isLoading.set(modulePath, loadPromise);
        try {
            const module = await loadPromise;
            this.loadedModules.add(modulePath);
            this.emit('load', { module: modulePath });
            return module;
        }
        finally {
            this.isLoading.delete(modulePath);
        }
    }
    preloadModule(modulePath) {
        if (!this.loadedModules.has(modulePath) && !this.preloadQueue.includes(modulePath)) {
            this.preloadQueue.push(modulePath);
            this.processPreloadQueue();
        }
    }
    isModuleLoaded(modulePath) {
        return this.loadedModules.has(modulePath);
    }
    getLoadedModules() {
        return Array.from(this.loadedModules);
    }
    async performLoad(modulePath) {
        const startTime = performance.now();
        try {
            const module = await Promise.resolve(`${modulePath}`).then(s => __importStar(__webpack_require__("./src/performance sync recursive")(s)));
            const loadTime = performance.now() - startTime;
            this.emit('loadComplete', {
                module: modulePath,
                loadTime,
                success: true
            });
            return module;
        }
        catch (error) {
            const loadTime = performance.now() - startTime;
            this.emit('loadComplete', {
                module: modulePath,
                loadTime,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    setupPreloading() {
        if (!this.config.enabled)
            return;
        // Preload based on usage patterns
        setInterval(() => {
            this.processPreloadQueue();
        }, 5000);
    }
    async processPreloadQueue() {
        if (this.preloadQueue.length === 0)
            return;
        const module = this.preloadQueue.shift();
        try {
            await this.loadModule(module);
        }
        catch (error) {
            console.warn(`Failed to preload module ${module}:`, error);
        }
    }
}
class ResourcePool extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.workers = [];
        this.availableWorkers = [];
        this.workerTasks = new Map();
        this.languageServers = new Map();
        this.webviews = new Set();
        this.initializeWorkerPool();
        this.setupCleanup();
    }
    async getWorker() {
        if (this.availableWorkers.length > 0) {
            const worker = this.availableWorkers.pop();
            this.emit('workerAssigned', { workerId: this.getWorkerId(worker) });
            return worker;
        }
        if (this.workers.length < this.config.maxWorkers) {
            const worker = await this.createWorker();
            this.workers.push(worker);
            this.emit('workerCreated', { workerId: this.getWorkerId(worker) });
            return worker;
        }
        // Wait for available worker
        return new Promise((resolve) => {
            const checkAvailable = () => {
                if (this.availableWorkers.length > 0) {
                    const worker = this.availableWorkers.pop();
                    this.emit('workerAssigned', { workerId: this.getWorkerId(worker) });
                    resolve(worker);
                }
                else {
                    setTimeout(checkAvailable, 100);
                }
            };
            checkAvailable();
        });
    }
    releaseWorker(worker) {
        const task = this.workerTasks.get(worker);
        if (task) {
            this.workerTasks.delete(worker);
        }
        this.availableWorkers.push(worker);
        this.emit('workerReleased', { workerId: this.getWorkerId(worker) });
    }
    async getLanguageServer(languageId) {
        if (this.languageServers.has(languageId)) {
            this.emit('languageServerHit', { languageId });
            return this.languageServers.get(languageId);
        }
        if (this.languageServers.size >= this.config.maxLanguageServers) {
            // Remove least recently used
            const lru = Array.from(this.languageServers.keys())[0];
            this.languageServers.delete(lru);
            this.emit('languageServerEvicted', { languageId: lru });
        }
        const server = await this.createLanguageServer(languageId);
        this.languageServers.set(languageId, server);
        this.emit('languageServerCreated', { languageId });
        return server;
    }
    registerWebview(webview) {
        this.webviews.add(webview);
        webview.onDidDispose(() => {
            this.webviews.delete(webview);
            this.emit('webviewDisposed', { title: webview.title });
        });
        this.emit('webviewRegistered', { title: webview.title });
    }
    getResourceUsage() {
        return {
            extensions: 0, // Would track actual extension instances
            languageServers: this.languageServers.size,
            workers: this.workers.length,
            webviews: this.webviews.size
        };
    }
    async createWorker() {
        // In a real implementation, this would create an actual Worker
        // For now, return a mock worker object
        return {};
    }
    async createLanguageServer(languageId) {
        // In a real implementation, this would start the language server
        return { languageId, startTime: Date.now() };
    }
    getWorkerId(worker) {
        return `worker_${this.workers.indexOf(worker)}`;
    }
    initializeWorkerPool() {
        // Pre-create some workers
        const initialWorkers = Math.min(2, this.config.maxWorkers);
        for (let i = 0; i < initialWorkers; i++) {
            this.createWorker().then(worker => {
                this.workers.push(worker);
                this.availableWorkers.push(worker);
            });
        }
    }
    setupCleanup() {
        setInterval(() => {
            this.cleanupIdleResources();
        }, 60000); // Every minute
    }
    cleanupIdleResources() {
        const now = Date.now();
        // Cleanup idle language servers
        this.languageServers.forEach((server, languageId) => {
            if (now - server.startTime > this.config.workerIdleTimeout) {
                this.languageServers.delete(languageId);
                this.emit('languageServerCleanup', { languageId });
            }
        });
    }
}
class PerformanceOptimizer extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.performanceTimings = new Map();
        this.cache = new IntelligentCache(config.cache);
        this.lazyLoader = new LazyModuleLoader(config.lazyLoading);
        this.resourcePool = new ResourcePool(config.resourcePooling);
        this.metrics = {
            cacheHits: 0,
            cacheMisses: 0,
            cacheHitRate: 0,
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
            lazyLoadedModules: [],
            performanceTimings: new Map(),
            resourceUsage: {
                extensions: 0,
                languageServers: 0,
                workers: 0,
                webviews: 0
            }
        };
        this.setupEventListeners();
        this.startMonitoring();
    }
    // Cache operations
    cacheSet(key, value, ttl) {
        this.cache.set(key, value, ttl);
    }
    cacheGet(key) {
        return this.cache.get(key);
    }
    cacheHas(key) {
        return this.cache.has(key);
    }
    cacheDelete(key) {
        return this.cache.delete(key);
    }
    cacheClear() {
        this.cache.clear();
    }
    // Lazy loading operations
    async loadModule(modulePath) {
        return this.lazyLoader.loadModule(modulePath);
    }
    preloadModule(modulePath) {
        this.lazyLoader.preloadModule(modulePath);
    }
    // Resource pool operations
    async getWorker() {
        return this.resourcePool.getWorker();
    }
    releaseWorker(worker) {
        this.resourcePool.releaseWorker(worker);
    }
    async getLanguageServer(languageId) {
        return this.resourcePool.getLanguageServer(languageId);
    }
    registerWebview(webview) {
        this.resourcePool.registerWebview(webview);
    }
    // Performance measurement
    startTiming(operation) {
        this.performanceTimings.set(operation, performance.now());
    }
    endTiming(operation) {
        const startTime = this.performanceTimings.get(operation);
        if (startTime) {
            const duration = performance.now() - startTime;
            this.performanceTimings.delete(operation);
            this.emit('timing', { operation, duration });
            return duration;
        }
        return 0;
    }
    // Memory management
    forceGarbageCollection() {
        if (global.gc) {
            global.gc();
            this.emit('gc', { timestamp: Date.now() });
        }
    }
    checkMemoryUsage() {
        const usage = process.memoryUsage();
        if (usage.heapUsed > this.config.memoryManagement.gcThreshold) {
            this.forceGarbageCollection();
        }
        return usage;
    }
    // Analytics and reporting
    getMetrics() {
        const cacheStats = this.cache.getStats();
        this.metrics.cacheHits = cacheStats.hitRate * cacheStats.size;
        this.metrics.cacheMisses = cacheStats.size - this.metrics.cacheHits;
        this.metrics.cacheHitRate = cacheStats.hitRate;
        this.metrics.memoryUsage = this.checkMemoryUsage();
        this.metrics.cpuUsage = process.cpuUsage();
        this.metrics.lazyLoadedModules = this.lazyLoader.getLoadedModules();
        this.metrics.resourceUsage = this.resourcePool.getResourceUsage();
        this.metrics.performanceTimings = new Map(this.performanceTimings);
        return { ...this.metrics };
    }
    generateReport() {
        const metrics = this.getMetrics();
        return `
VSEmbed Performance Report
=========================

Cache Performance:
- Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(2)}%
- Total Hits: ${metrics.cacheHits}
- Total Misses: ${metrics.cacheMisses}

Memory Usage:
- Heap Used: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
- Heap Total: ${(metrics.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
- External: ${(metrics.memoryUsage.external / 1024 / 1024).toFixed(2)} MB
- RSS: ${(metrics.memoryUsage.rss / 1024 / 1024).toFixed(2)} MB

Resource Usage:
- Active Workers: ${metrics.resourceUsage.workers}
- Language Servers: ${metrics.resourceUsage.languageServers}
- Webviews: ${metrics.resourceUsage.webviews}

Lazy Loaded Modules: ${metrics.lazyLoadedModules.length}
${metrics.lazyLoadedModules.map(m => `- ${m}`).join('\n')}

Performance Timings:
${Array.from(metrics.performanceTimings.entries()).map(([op, time]) => `- ${op}: ${time.toFixed(2)}ms`).join('\n')}
`;
    }
    // Optimization recommendations
    getOptimizationRecommendations() {
        const recommendations = [];
        const metrics = this.getMetrics();
        if (metrics.cacheHitRate < 0.7) {
            recommendations.push('Consider increasing cache size or TTL for better hit rates');
        }
        if (metrics.memoryUsage.heapUsed > this.config.memoryManagement.maxHeapSize * 0.8) {
            recommendations.push('Memory usage is high - consider enabling more aggressive garbage collection');
        }
        if (metrics.resourceUsage.languageServers > 5) {
            recommendations.push('Many language servers active - consider reducing concurrent servers');
        }
        if (metrics.lazyLoadedModules.length < 10) {
            recommendations.push('Enable more aggressive lazy loading to improve startup performance');
        }
        return recommendations;
    }
    setupEventListeners() {
        this.cache.on('hit', () => this.metrics.cacheHits++);
        this.cache.on('miss', () => this.metrics.cacheMisses++);
        this.lazyLoader.on('load', (data) => {
            if (!this.metrics.lazyLoadedModules.includes(data.module)) {
                this.metrics.lazyLoadedModules.push(data.module);
            }
        });
    }
    startMonitoring() {
        if (this.config.memoryManagement.enableMonitoring) {
            this.memoryMonitor = setInterval(() => {
                const usage = this.checkMemoryUsage();
                this.emit('memoryUpdate', usage);
            }, 10000); // Every 10 seconds
        }
    }
    shutdown() {
        if (this.memoryMonitor) {
            clearInterval(this.memoryMonitor);
        }
        this.cache.clear();
        this.emit('shutdown');
    }
}
exports.PerformanceOptimizer = PerformanceOptimizer;
// Default configuration
exports.defaultOptimizationConfig = {
    cache: {
        maxSize: 100 * 1024 * 1024, // 100MB
        ttl: 5 * 60 * 1000, // 5 minutes
        enableCompression: true,
        persistToDisk: false
    },
    lazyLoading: {
        enabled: true,
        preloadThreshold: 3,
        modulePattern: [
            /^vscode\//,
            /^@vscode\//,
            /extensions\//
        ]
    },
    memoryManagement: {
        gcThreshold: 100 * 1024 * 1024, // 100MB
        maxHeapSize: 512 * 1024 * 1024, // 512MB
        enableMonitoring: true
    },
    resourcePooling: {
        maxWorkers: 4,
        maxLanguageServers: 10,
        workerIdleTimeout: 5 * 60 * 1000 // 5 minutes
    }
};


/***/ }),

/***/ "./src/permissions/manager.ts":
/*!************************************!*\
  !*** ./src/permissions/manager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionManager = void 0;
class PermissionManager {
    constructor() {
        this.permissions = {};
        this.auditLog = [];
        this.securityRules = [
            {
                pattern: '*.executeCommand',
                defaultAction: 'prompt',
                riskLevel: 'medium',
                description: 'Execute VS Code commands'
            },
            {
                pattern: '*.workspace.fs.*',
                defaultAction: 'prompt',
                riskLevel: 'high',
                description: 'File system access'
            },
            {
                pattern: '*.terminal.*',
                defaultAction: 'deny',
                riskLevel: 'high',
                description: 'Terminal access'
            },
            {
                pattern: '*.debug.*',
                defaultAction: 'prompt',
                riskLevel: 'medium',
                description: 'Debugger access'
            },
            {
                pattern: 'kali-*',
                defaultAction: 'deny',
                riskLevel: 'high',
                description: 'Security tools access'
            },
            {
                pattern: '*.docker.*',
                defaultAction: 'prompt',
                riskLevel: 'medium',
                description: 'Docker operations'
            }
        ];
        this.loadSavedData();
    }
    loadSavedData() {
        try {
            const savedPermissions = localStorage.getItem(PermissionManager.PERMISSIONS_KEY);
            if (savedPermissions) {
                this.permissions = JSON.parse(savedPermissions);
            }
            const savedAudit = localStorage.getItem(PermissionManager.AUDIT_KEY);
            if (savedAudit) {
                this.auditLog = JSON.parse(savedAudit);
            }
        }
        catch (error) {
            console.error('Failed to load permission data:', error);
        }
    }
    saveData() {
        try {
            localStorage.setItem(PermissionManager.PERMISSIONS_KEY, JSON.stringify(this.permissions));
            localStorage.setItem(PermissionManager.AUDIT_KEY, JSON.stringify(this.auditLog));
        }
        catch (error) {
            console.error('Failed to save permission data:', error);
        }
    }
    async requestExtensionPermission(extensionId, command, purpose) {
        const permissionKey = `${extensionId}:${command}`;
        // Check if permission already granted/denied
        if (this.permissions.hasOwnProperty(permissionKey)) {
            this.logAuditEvent(extensionId, command, purpose, this.permissions[permissionKey]);
            return this.permissions[permissionKey];
        }
        // Check security rules
        const rule = this.findMatchingRule(permissionKey);
        if (rule?.defaultAction === 'allow') {
            this.permissions[permissionKey] = true;
            this.saveData();
            this.logAuditEvent(extensionId, command, purpose, true, 'auto-allowed');
            return true;
        }
        if (rule?.defaultAction === 'deny') {
            this.permissions[permissionKey] = false;
            this.saveData();
            this.logAuditEvent(extensionId, command, purpose, false, 'auto-denied');
            return false;
        }
        // Prompt user for permission
        return this.promptUser(extensionId, command, purpose, rule?.riskLevel || 'medium');
    }
    findMatchingRule(permissionKey) {
        return this.securityRules.find(rule => {
            const pattern = rule.pattern.replace('*', '.*');
            const regex = new RegExp(pattern);
            return regex.test(permissionKey);
        }) || null;
    }
    async promptUser(extensionId, command, purpose, riskLevel) {
        return new Promise((resolve) => {
            const permissionKey = `${extensionId}:${command}`;
            // Create permission request event
            const request = {
                id: Date.now().toString(),
                extensionId,
                command,
                purpose,
                riskLevel,
                timestamp: Date.now()
            };
            // Dispatch custom event for UI to handle
            window.dispatchEvent(new CustomEvent('permissionRequest', {
                detail: {
                    request,
                    onResponse: (granted, remember = false) => {
                        request.approved = granted;
                        if (remember) {
                            this.permissions[permissionKey] = granted;
                            this.saveData();
                        }
                        this.logAuditEvent(extensionId, command, purpose, granted, 'user-prompted');
                        resolve(granted);
                    }
                }
            }));
        });
    }
    logAuditEvent(extensionId, command, purpose, granted, source = 'unknown') {
        const auditEntry = {
            id: Date.now().toString(),
            extensionId,
            command,
            purpose,
            riskLevel: this.findMatchingRule(`${extensionId}:${command}`)?.riskLevel || 'medium',
            timestamp: Date.now(),
            approved: granted
        };
        this.auditLog.unshift(auditEntry);
        // Keep only last 1000 audit entries
        if (this.auditLog.length > 1000) {
            this.auditLog = this.auditLog.slice(0, 1000);
        }
        this.saveData();
        console.log(`Permission ${granted ? 'granted' : 'denied'} for ${extensionId}:${command} (${source})`);
    }
    hasPermission(extensionId, command) {
        if (!command) {
            // Check if extension has any permissions
            return Object.keys(this.permissions).some(key => key.startsWith(extensionId) && this.permissions[key]);
        }
        const permissionKey = `${extensionId}:${command}`;
        return this.permissions[permissionKey] === true;
    }
    revokePermission(extensionId, command) {
        if (!command) {
            // Revoke all permissions for extension
            Object.keys(this.permissions)
                .filter(key => key.startsWith(extensionId))
                .forEach(key => delete this.permissions[key]);
        }
        else {
            const permissionKey = `${extensionId}:${command}`;
            delete this.permissions[permissionKey];
        }
        this.saveData();
    }
    getPermissions() {
        return { ...this.permissions };
    }
    getAuditLog() {
        return [...this.auditLog];
    }
    clearAuditLog() {
        this.auditLog = [];
        this.saveData();
    }
    exportAuditLog() {
        return JSON.stringify({
            permissions: this.permissions,
            auditLog: this.auditLog,
            exportedAt: new Date().toISOString()
        }, null, 2);
    }
    getSecurityReport() {
        const approved = this.auditLog.filter(entry => entry.approved).length;
        const denied = this.auditLog.filter(entry => !entry.approved).length;
        const riskBreakdown = this.auditLog.reduce((acc, entry) => {
            acc[entry.riskLevel] = (acc[entry.riskLevel] || 0) + 1;
            return acc;
        }, {});
        const recentActivity = this.auditLog
            .filter(entry => Date.now() - entry.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
            .slice(0, 10);
        return {
            totalRequests: this.auditLog.length,
            approvedRequests: approved,
            deniedRequests: denied,
            riskBreakdown,
            recentActivity
        };
    }
    addSecurityRule(rule) {
        this.securityRules.push(rule);
    }
    removeSecurityRule(pattern) {
        const index = this.securityRules.findIndex(rule => rule.pattern === pattern);
        if (index !== -1) {
            this.securityRules.splice(index, 1);
        }
    }
    getSecurityRules() {
        return [...this.securityRules];
    }
}
exports.PermissionManager = PermissionManager;
PermissionManager.PERMISSIONS_KEY = 'extension-permissions';
PermissionManager.AUDIT_KEY = 'permission-audit';


/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("vscode");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map