#!/usr/bin/env node
'use strict'

const os = require('os')
const EOL = os.EOL
const stdin = require('get-stdin')
const yml = require('js-yaml')
const meow = require('meow')
const cli = meow({
  flags: {
    indent: {
      description: 'The number of spaces to indent yaml with',
      type: 'string',
      alias: 'i',
      default: 2
    }
  }
})

const reduce = require('./reduce')

async function main () {
  const text = (await stdin()).trim()
  if (!text) return cli.showHelp()

  const docs = yml.safeLoadAll(text)
  const separator = docs.length > 1 ? `---${EOL}` : ''

  docs.forEach(doc => {
    process.stdout.write(separator)
    let result = yml.safeDump(
      cli.input.reduce(reduce, doc), {
        indent: cli.flags.indent
      })
    process.stdout.write(result)
  })
}

main()
