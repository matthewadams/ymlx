/* eslint-env mocha */
'use strict'

const {execSync} = require('child_process')
const os = require('os')
const EOL = os.EOL
const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const test = (input, expected) => {
  input.args = input.args || ''
  if (!Object.prototype.hasOwnProperty.call(input, 'eol')) input.eol = true
  if (!Array.isArray(input.scripts)) input.scripts = [input.scripts]

  const stdout = execSync(
    `echo '${input.yaml}' | "${__dirname}/../index.js" ${input.args} ${input.scripts.map(it => `'${it}'`).join(' ')}`)
    .toString()

  expect(stdout).to.equal(`${expected}${input.eol ? EOL : ''}`)
}

describe('integration tests', function () {
  this.timeout(10 * 1000)

  describe('with single documents', () => {
    const y = `
a:
  b:
    c: d`

    it('should work', () => {
      const hello = 'hello: world'
      test({yaml: hello, scripts: 'this'}, hello)
      test({yaml: hello, scripts: 'x => x'}, hello)
      test({yaml: hello, scripts: 'this.hello'}, 'world')
      test({yaml: hello, scripts: 'x => x.hello'}, 'world')
      test({yaml: hello, scripts: 'this.hello[0]'}, 'w')
      test({yaml: hello, scripts: 'x => x.hello[0]'}, 'w')
      test({yaml: y, scripts: 'this.a.b.c'}, 'd')
      test({yaml: y, scripts: 'x => x.a.b.c'}, 'd')
      test({yaml: y, scripts: ['this.a', 'this.b', 'this.c']}, 'd')
      test({yaml: y, scripts: ['x => x.a', 'x => x.b', 'x => x.c']}, 'd')

      const yy = `
items:
  - foo
  - bar`
      test({ yaml: yy, scripts: ['this.items', 'yield* this', 'x => x[1]'] }, 'bar')
    })
  })
  describe('with multiple documents', () => {
    const y = `---
a:
  b:
    c: d
---
a:
  b:
    c: e`

    it('should work', () => {
      test({ yaml: y, scripts: ['this'] }, y)
      test({ yaml: y, scripts: ['x => x'] }, y)
      test({ yaml: y, scripts: ['this.a.b.c'] }, `---
d
---
e`)
      test({ yaml: y, scripts: ['x => x.a.b.c'] }, `---
d
---
e`)
    })
  })
})
