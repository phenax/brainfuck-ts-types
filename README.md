# Brainfuck TS Types
A brainfuck interpreter running within the typescript type system


Multiplication example -
```ts
type InitState = [_0, [_4, _2, _0, _0], [], []]
type result = Interpreter<InitState, '[>[->+>+<<]>[-<+>]<<-]>>>.'>

type output = result[2] // :: [_8]
```

[Stream archive playlist](https://www.youtube.com/watch?v=5c5J1eLJj-0&list=PLOJGAjhcTPJzcrymSNjyawkoajywpRA9j)

[Built live on twitch](https://twitch.tv/ediblemonad)
