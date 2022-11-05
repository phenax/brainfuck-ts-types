import { Nat, Succ, Pred, _0, _1, _2, _3, _4, _5, _6, _7, _8, GenerateList } from './nat'

type State<Cur extends Nat, Cells extends Nat[], Out extends Nat[], LoopStack extends string[]> = [
  Cur,
  Cells,
  Out,
  LoopStack
]

type Operation<N extends Nat> = {
  Succ: Succ<N>,
  Pred: Pred<N>,
}

type UpdateCellAtN<N extends Nat, Ls extends Nat[], Op extends keyof Operation<Nat>, Acc extends Nat[] = []> =
  N extends _0 ? [
    ...Acc,
    ...(Ls extends [] ? []
      : Ls extends [infer H extends Nat, ...infer T extends Nat[]]
      ? [Operation<H>[Op], ...T] : Ls
    )
  ]
  : Ls extends [infer H extends Nat, ...(infer Tail extends Nat[])]
    ? UpdateCellAtN<Pred<N>, Tail, Op, [...Acc, H]>
  : Ls

type UpdateCell<St extends State<Nat, Nat[], Nat[], string[]>, Op extends keyof Operation<Nat>> = [
  St[0],
  UpdateCellAtN<St[0], St[1], Op>,
  St[2],
  St[3]
]

type GetCurCell<Cur extends Nat, Cells extends Nat[]> =
  Cur extends _0 ? Cells[0]
  : Cells extends [Nat, ...(infer tail extends Nat[])]
    ? GetCurCell<Pred<Cur>, tail>
    : never

type whitespace = ' ' | '\n' | '\t'

type Interpreter<St extends State<Nat, Nat[], Nat[], string[]>, Expr extends string> =
  Expr extends '' ? St
  : Expr extends `${whitespace}${infer rest extends string}` ? Interpreter<St, rest>
  : Expr extends `+${infer rest extends string}` ? Interpreter<UpdateCell<St, 'Succ'>, rest>
  : Expr extends `-${infer rest extends string}` ? Interpreter<UpdateCell<St, 'Pred'>, rest>
  : Expr extends `>${infer rest extends string}` ? Interpreter<[Succ<St[0]>, St[1], St[2], St[3]], rest>
  : Expr extends `<${infer rest extends string}` ? Interpreter<[Pred<St[0]>, St[1], St[2], St[3]], rest>
  : Expr extends `.${infer rest extends string}` ? Interpreter<[St[0], St[1], [...St[2], GetCurCell<St[0], St[1]>], St[3]], rest>
  : Expr extends `[${infer rest extends string}` ? Interpreter<[St[0], St[1], St[2], [rest, ...St[3]]], rest>
  : Expr extends `]${infer rest extends string}` ?
    GetCurCell<St[0], St[1]> extends _0
      ? Interpreter<[St[0], St[1], St[2], St[3] extends [string, ...(infer stack extends string[])] ? stack : []], rest>
      : St[3] extends [infer goto extends string, ...string[]] ? Interpreter<St, goto> : never
  : never

type _x = Interpreter<[_0, GenerateList<_6, _0>, [], []], '+++>++++>++++<<[>+<-]>.[>+<-]>.'>

type Assert<T extends true> = T
type IsEq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false

export type _tests = [
  'Increment/Decrement',
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

  'Shifts',
  Assert<IsEq<
    Interpreter<State<_1, GenerateList<_3, _0>, [], []>, '+>++'>,
    State<_2, [_0, _1, _2], [], []>
  >>,
  Assert<IsEq<
    Interpreter<State<_2, GenerateList<_3, _0>, [], []>, '++<+'>,
    State<_1, [_0, _1, _2], [], []>
  >>,

  'Loops',
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

  'Complex',
  Assert<IsEq<
    Interpreter<[_0, [_0, _0, _0], [], []], '+++>++++>++++<<[>+<-]>.[>+<-]>.'>,
    State<_2, [_0, _0, Succ<Succ<Succ<_8>>>], [_7, Succ<Succ<Succ<_8>>>], []>
  >>,
]

