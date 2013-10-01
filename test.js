'use strict';
var  path = require('path')
, basename = path.basename(path.dirname(__filename))
, util = require('util')
, should = require('should')
, tester = require('dm-core').tester
, command = require('./index.js')
;


describe(basename, function () {

    var prepend = ''

    describe('PUT empty string', function () {
        it('should return 400', function (done) {
            tester(command, {})
            .send(' \n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal(' \n')
                done()
              }
            )
          }
        )
      }
    )

    describe('PUT string without expression', function () {
        it('should return 200', function (done) {
            tester(command, {})
            .send('xxx\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('xxx\n')
                done()
              }
            )
          }
        )
      }
    )

    describe('PUT simple string', function () {
        it('should return one line', function (done) {
            tester(command, {lines : 1})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('aaa\n')
                done()
              }
            )
          }
        )
        it('should return two line', function (done) {
            tester(command, {lines : 2})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('aaa\nbbb\n')
                done()
              }
            )
          }
        )
        it('should return three lines', function (done) {
            tester(command, {lines : 3})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('aaa\nbbb\nccc\n')
                done()
              }
            )
          }
        )
        it('should return three lines (limit is over)', function (done) {
            tester(command, {lines : 4})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('aaa\nbbb\nccc\n')
                done()
              }
            )
          }
        )
        it('should return two line (invert)', function (done) {
            tester(command, {lines : 1, invert : true})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('bbb\nccc\n')
                done()
              }
            )
          }
        )
        it('should return one line (invert)', function (done) {
            tester(command, {lines : 2, invert : true})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('ccc\n')
                done()
              }
            )
          }
        )

        it('should return zero line (invert)', function (done) {
            tester(command, {lines : 3, invert : true})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('')
                done()
              }
            )
          }
        )

        it('should return zero line (invert) (limit is over)', function (done) {
            tester(command, {lines : 4, invert : true})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('')
                done()
              }
            )
          }
        )



      }
    )
    describe('PUT simple string (change delimiter)', function () {
        it('should return one line', function (done) {
            tester(command, {lines : 1, delimiter : "\\t"})
            .send('aaa\tbbb\tccc')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('aaa\t')
                done()
              }
            )
          }
        )
        it('should return two line', function (done) {
            tester(command, {lines : 2, delimiter : "\\t"})
            .send('aaa\tbbb\tccc')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('aaa\tbbb\t')
                done()
              }
            )
          }
        )
        it('should return two line (invert)', function (done) {
            tester(command, {lines : 1, invert : true, delimiter : "\\t"})
            .send('aaa\tbbb\tccc')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('bbb\tccc\t')
                done()
              }
            )
          }
        )
        it('should return one line (invert)', function (done) {
            tester(command, {lines : 2, invert : true, delimiter : "\\t"})
            .send('aaa\tbbb\tccc')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('ccc\t')
                done()
              }
            )
          }
        )

      }
    )
    describe('PUT simple string (offset changing)', function () {
        it('should return one line', function (done) {
            tester(command, {lines : 1, offset : 1})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('bbb\n')
                done()
              }
            )
          }
        )
      }
    )
    describe('PUT medium string (offset changing)', function () {
        
        it('should return one line', function (done) {
            for (var i = 1, prepend = ''; i <= 20000; i++) {
              prepend += 'x\n';
            }
            tester(command, {lines : 1, offset : 20001})
            .send(prepend + 'aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('bbb\n')
                done()
              }
            )
          }
        )
      }
    )

    describe('PUT large string (offset changing)', function () {
        it('should return one line', function (done) {
            for (var i = 1, prepend = ''; i <= 100000; i++) {
              prepend += 'x\n'
            }
            tester(command, {lines : 1, offset : 100001})
            .send(prepend + 'aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('bbb\n')
                done()
              }
            )
          }
        )
        it('should return two line', function (done) {
            for (var i = 1, prepend = ''; i <= 100000; i++) {
              prepend += 'x\n'
            }
            tester(command, {lines : 2, offset : 100001})
            .send(prepend + 'aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('bbb\nccc\n')
                done()
              }
            )
          }
        )
        it('should return three line', function (done) {
            for (var i = 1, prepend = ''; i <= 100000; i++) {
              prepend += 'x\n'
            }
            tester(command, {lines : 3, offset : 100000})
            .send(prepend + 'aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('aaa\nbbb\nccc\n')
                done()
              }
            )
          }
        )
      }
    )

    describe('PUT simple string (offset changing & invert)', function () {
        it('should return two line', function (done) {
            tester(command, {lines : 1, offset : 1, invert: true})
            .send('aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal('aaa\nccc\n')
                done()
              }
            )
          }
        )
      }
    )
    describe('PUT medium string (offset changing & invert)', function () {

        it('should ignore one line', function (done) {
            for (var i = 1, prepend = ''; i <= 20000; i++) {
              prepend += 'x\n';
            }
            tester(command, {lines : 1, offset : 20001, invert: true})
            .send(prepend + 'aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal(prepend + 'aaa\nccc\n')
                done()
              }
            )
          }
        )
      }
    )
    describe('PUT large string (offset changing & invert)', function () {
        it('should ignore one line', function (done) {
            for (var i = 1, prepend = ''; i <= 100000; i++) {
              prepend += 'x\n'
            }
            tester(command, {lines : 1, offset : 100001, invert: true})
            .send(prepend + 'aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal(prepend + 'aaa\nccc\n')
                done()
              }
            )
          }
        )
        it('should return two line', function (done) {
            for (var i = 1, prepend = ''; i <= 100000; i++) {
              prepend += 'x\n'
            }
            tester(command, {lines : 2, offset : 100001, invert: true})
            .send(prepend + 'aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal(prepend + 'aaa\n')
                done()
              }
            )
          }
        )
        it('should ignore three line', function (done) {
            for (var i = 1, prepend = ''; i <= 100000; i++) {
              prepend += 'x\n'
            }
            tester(command, {lines : 3, offset : 100000, invert: true})
            .send(prepend + 'aaa\nbbb\nccc\n')
            .end(function (err, res) {
                should.not.exist(err)
                res.should.equal(prepend)
                done()
              }
            )
          }
        )
      }
    )
  }
);
