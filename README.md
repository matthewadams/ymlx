Command-line YAML processing tool

## Features

* Plain JavaScript to manipulate document(s)

## Install

```
$ npm install -g ymlx
```

## Usage

Pipe into `ymlx` any YAML and anonymous function for reducing it.

```
$ cat my.yaml | ymlx [code ...]
```

### Anonymous function

Use an anonymous function as reducer which gets YAML as an object and processes it:
```
$ echo 'foo: [bar: value]' | ymlx 'x => x.foo[0].bar'
value
```

### `this` Binding

If you don't pass anonymous function `param => ...`, code will be automatically transformed into anonymous function.
And you can get access to YAML by `this` keyword:
```
$ echo 'foo: [bar: value]' | ymlx 'this.foo[0].bar'
value
```

#### Multiple Documents

You can pass a YAML file with multiple documents (using the `---` separator), and your commands will be applied to each document.

```yaml
# test.yml
---
foo:
- bar: value
---
foo:
- bar: another
```

```
$ cat test.yml | ymlx 'this.foo[0].bar'
---
value
---
another
```

### Chain

You can pass any number of anonymous functions for reducing JSON:
```
$ echo 'foo: [bar: value]' | ymlx 'x => x.foo' 'this[0]' 'this.bar'
value
```

### Generator

If passed code contains `yield` keyword, [generator expression](https://github.com/sebmarkbage/ecmascript-generator-expression)
will be used:
```
$ curl ... | ymlx 'for (let user of this) if (user.login.startsWith("a")) yield user'
```

Access to YAML through `this` keyword:
```yaml
# test.yml
- a
- b
```

```
$ cat test.yml | ymlx 'yield* this'
- a
- b
```

```
$ cat test.yml | ymlx 'yield* this; yield "c";'
- a
- b
- c
```

### Update

You can update existing YAML using spread operator:

```
$ echo 'count: 0' | ymlx '{...this, count: 1}'
count: 1
```

### Use npm package

Use any npm package by installing globally or in the current working directory:
```
$ npm install lodash # -g if you want
$ cat 'count: 0' | ymlx 'require("lodash").keys(this)'
- count
```

### Formatting
```
$ echo '[1,2,3]' | ymlx 'this.reduce((a,n) => a += n.toString(), "concat: ")'
'concat: 123'
```

## Inspiration

`ymlx` was inspired by [`fx`](https://github.com/antonmedv/fx)

## Related

* [jq](https://github.com/stedolan/jq) – cli JSON processor on C
* [jsawk](https://github.com/micha/jsawk) – like awk, but for JSON
* [json](https://github.com/trentm/json) – another JSON manipulating cli library
* [jl](https://github.com/chrisdone/jl) – functional sed for JSON on Haskell

## License

MIT
