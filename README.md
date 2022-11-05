# Brainfuck TS Types
A brainfuck interpreter running within the typescript type system


Multiplication example -
```ts
type InitState = [_0, [_4, _2, _0, _0], [], []]
type result = Interpreter<InitState, '[>[->+>+<<]>[-<+>]<<-]>>>.'>

type output = result[2] // :: [_8]
```
