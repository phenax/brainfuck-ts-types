import { Interpreter, State, ParseError } from '.'
import { Succ, _0, _1, _2, _3, _4, _5, _6, _7, _8, GenerateList } from './nat'

type Assert<T extends true> = T
type IsEq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false

export type _tests = {
  '### Increment/Decrement': [
    Assert<IsEq<
      Interpreter<State<_0, GenerateList<_3, _0>, [], []>, '+++++'>,
      State<_0, [_5, _0, _0], [], []>
    >>,
    Assert<IsEq<
      Interpreter<State<_1, GenerateList<_3, _0>, [], []>, '+++++'>,
      State<_1, [_0, _5, _0], [], []>
    >>,
    Assert<IsEq<
      Interpreter<State<_0, GenerateList<_3, _0>, [], []>, '+++++--'>,
      State<_0, [_3, _0, _0], [], []>
    >>,
  ],

  '### Shifts': [
    Assert<IsEq<
      Interpreter<State<_1, GenerateList<_3, _0>, [], []>, '+>++'>,
      State<_2, [_0, _1, _2], [], []>
    >>,
    Assert<IsEq<
      Interpreter<State<_2, GenerateList<_3, _0>, [], []>, '++<+'>,
      State<_1, [_0, _1, _2], [], []>
    >>,
  ],

  '### Loops': [
    Assert<IsEq<
      Interpreter<State<_0, [_3, _1, _1], [], []>, '[->+<]'>,
      State<_0, [_0, _4, _1], [], []>
    >>,
    Assert<IsEq<
      Interpreter<State<_0, [_3, _1, _1], [], []>, '[->.+<]'>,
      State<_0, [_0, _4, _1], [_1, _2, _3], []>
    >>,
    Assert<IsEq<
      Interpreter<[_0, [_0, _0, _0], [], []], '+++--+++++- [>+ <-]'>,
      State<_0, [_0, _5, _0], [], []>
    >>,
  ],

  '### Complex': [
    'Add 3 numbers',
    Assert<IsEq<
      Interpreter<[_0, [_0, _0, _0], [], []], '+++>++++>++++<<[>+<-]>.[>+<-]>.'>,
      State<_2, [_0, _0, Succ<Succ<Succ<_8>>>], [_7, Succ<Succ<Succ<_8>>>], []>
    >>,
    'Swap',
    Assert<IsEq<
      Interpreter<[_0, GenerateList<_3, _0>, [], []], '+++>++++<<[>>+<<-]>[<+>-]>[<+>-]'>,
      State<_2, [_4, _3, _0], [], []>
    >>,
    'Multiplication',
    Assert<IsEq<
      Interpreter<[_0, GenerateList<_4, _0>, [], []], '++++>+++<[>[->+>+<<]>[-<+>]<<-]>>>.'>,
      State<_3, [_0, _3, _0, Succ<Succ<Succ<Succ<_8>>>>], [Succ<Succ<Succ<Succ<_8>>>>], []>
    >>,
  ],

  '### Sad path': [
    'Parse errors',
    Assert<IsEq<
      Interpreter<[_0, [_0, _0, _0], [], []], 'klshjklsd'>,
      ParseError<'Invalid character'>
    >>,
    Assert<IsEq<
      Interpreter<[_0, [_0, _0, _0], [], []], '++++]'>,
      ParseError<'Invalid loop'>
    >>,
    Assert<IsEq<
      Interpreter<[_0, [_0, _0, _0], [], []], '+++[++'>,
      ParseError<'Pending loop'>
    >>,
    'Out of bounds',
    Assert<IsEq<
      Interpreter<[_0, [_0, _0], [], []], '<<<+'>,
      State<_0, [_1, _0], [], []>
    >>,
    Assert<IsEq<
      Interpreter<[_0, [_0, _0], [], []], '>>>>>>+'>,
      State<_6, [_0, _0], [], []>
    >>,
  ],
}

