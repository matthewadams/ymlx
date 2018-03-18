/* eslint-disable no-eval */
'use strict'
const FN_RX = /^\s*(\w+|\(\s*([$\w]+\s*(,\s*[$\w]+\s*)*)?\s*\))\s*=>/

function reduce (o, js) {
  if (FN_RX.test(js)) {
    const fn = eval(js)
    return fn(o)
  }
  if (/yield/.test(js)) {
    const fn = eval(`
      function fn() {
        const gen = (function*(){ 
          ${js.replace(/\\\n/g, '')} 
        }).call(this)
        return [...gen]
      }; fn
    `)
    return fn.call(o)
  }
  const fn = eval(`function fn() { return ${js} }; fn`)
  return fn.call(o)
}

module.exports = reduce
