'use strict';

var path = require('path')
, basename = path.basename(path.dirname(__filename))
, debug = require('debug')('mill:contrib:' + basename)
, Segmenter = require('segmenter')
, Transform = require("stream").Transform
;

function Command(options)
{
  Transform.call(this, options);
  this.begin = true;
  this.seg = new Segmenter({delimiter: options.delimiter});
  this.lines =  options.lines || 10;
  this.offset =  options.offset || 0;
  this.invert = options.invert || false;
  this.counter = 0;
  this.disabled = false;
  this.remainder = 0;
}

Command.prototype = Object.create(
  Transform.prototype, { constructor: { value: Command }});

Command.prototype.parse = function (rows, done) {
  var r;


  if (Array.isArray(rows)) {
    var start = this.counter;
    var begin = this.offset - start;
    var large = begin + this.lines;
    var depth = (this.lines - this.remainder) + start;
    this.counter += rows.length;
    debug('start', start)
    debug('begin', begin)
    debug('large', large)
    debug('depth', depth)
    debug('lines', this.lines)
    debug('offset', this.offset)
    debug('counter', this.counter)
    debug('length', rows.length)
    debug('remainder', this.remainder)
    if (!this.invert) {
      if (this.offset > this.counter) {
        debug('case #1');
        //            [===========>
        // |--------|
        r = '';
      }
      else if (this.offset < this.counter && large >= this.counter && this.remainder === 0) {
        debug('case #2');
        //   [===========>
        // |--------|
        r = rows.slice(begin).join(this.seg.delimiter());
        this.remainder = this.counter - this.offset;
      }
      else if (this.offset < this.counter && large < this.counter && this.remainder === 0) {
        debug('case #3');
        //   [====>
        // |--------|
        r = rows.slice(begin, begin + this.lines).join(this.seg.delimiter());
        this.remainder = 0;
      }
      else if (this.offset <= start && depth <= this.counter && this.remainder > 0) {
        debug('case #4');
        //   [===========>
        // |........|--------|
        r = rows.slice(0, this.lines - this.remainder).join(this.seg.delimiter());
        this.remainder = 0;
      }
      else if (this.offset <= start && depth > this.counter && this.remainder > 0) {
        debug('case #5');
        //   [==================>
        // |........|--------|
        r = rows.join(this.seg.delimiter());
        this.remainder += rows.length;
      }
      else if (this.offset < start && this.offset + this.lines < start && this.remainder === 0) {
        debug('case #6');
        //   [===========>
        //                   |--------|
        r = '';
        this.remainder = 0;
      }
    }
    else {
      if (this.offset > this.counter) {
        debug('case i#1');
        //            [===========>
        // |--------|
        r = rows.join(this.seg.delimiter());
        this.remainder = 0;
      }
      else if (this.offset < this.counter && large >= this.counter && this.remainder === 0) {
        debug('case i#2');
        //   [===========>
        // |--------|
        r = rows.slice(0, begin).join(this.seg.delimiter());
        this.remainder = this.counter - this.offset;
      }
      else if (this.offset < this.counter && large < this.counter && this.remainder === 0) {
        debug('case i#3');
        //   [====>
        // |--------|
        r = rows.slice(0, begin).concat(rows.slice(begin + this.lines)).join(this.seg.delimiter());
        this.remainder = 0;
      }
      else if (this.offset <= start && depth <= this.counter && this.remainder > 0) {
        debug('case i#4');
        //   [===========>
        // |........|--------|
        r = rows.slice(this.lines - this.remainder).join(this.seg.delimiter());
        this.remainder = 0;
      }
      else if (this.offset <= start && depth > this.counter && this.remainder > 0) {
        debug('case i#5');
        //   [==================>
        // |........|--------|
        r = '';
        this.remainder += rows.length;
      }
      else if (this.offset < start && this.offset + this.lines < start && this.remainder === 0) {
        debug('case i#6');
        //   [===========>
        //                   |--------|
        r = rows.join(this.seg.delimiter());
        this.remainder = 0;
      }
    }
    if (r) {
      r += this.seg.delimiter();
      this.push(r);
    }
  }
  done();
};


Command.prototype._transform = function (chunk, encoding, done) {
  if (this.begin) {
    this.begin = false;
    this.emit('begin');
  }
  this.parse(this.seg.fetch(chunk, encoding), done);
}
Command.prototype.end = function () {
  var that = this;
  that.parse(that.seg.fetch(), function () {
      that.emit('end');
    }
  );
};

module.exports = function (options, si) {
  var cmd = new Command(options);
  return si.pipe(cmd);
}
