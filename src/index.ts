import { Nat, Succ, Pred, _0, _1, _2, _3, _4, _5, _6, _7, _8 } from './nat'

export type State<Cur extends Nat, Cells extends Nat[], Out extends Nat[], LoopStack extends string[]> = [
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
    ...(Ls extends [] ? Ls
      : Ls extends [infer H extends Nat, ...infer T extends Nat[]]
      ? [Operation<H>[Op], ...T] : Ls
    )
  ]
  : Ls extends [infer H extends Nat, ...(infer Tail extends Nat[])]
    ? UpdateCellAtN<Pred<N>, Tail, Op, [...Acc, H]>
  : [...Acc, ...Ls]

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

type Whitespace = ' ' | '\n' | '\t'

declare const error: unique symbol;
export type ParseError<Msg extends string> = { [error]: Msg }

export type Interpreter<St extends State<Nat, Nat[], Nat[], string[]>, Expr extends string> =
  Expr extends '' ? (St[3] extends [] ? St : ParseError<'Pending loop'>)
  : Expr extends `${Whitespace}${infer rest extends string}` ? Interpreter<St, rest>
  : Expr extends `+${infer rest extends string}` ? Interpreter<UpdateCell<St, 'Succ'>, rest>
  : Expr extends `-${infer rest extends string}` ? Interpreter<UpdateCell<St, 'Pred'>, rest>
  : Expr extends `>${infer rest extends string}` ? Interpreter<[Succ<St[0]>, St[1], St[2], St[3]], rest>
  : Expr extends `<${infer rest extends string}` ? Interpreter<[Pred<St[0]>, St[1], St[2], St[3]], rest>
  : Expr extends `.${infer rest extends string}` ? Interpreter<[St[0], St[1], [...St[2], GetCurCell<St[0], St[1]>], St[3]], rest>
  : Expr extends `[${infer rest extends string}` ? Interpreter<[St[0], St[1], St[2], [rest, ...St[3]]], rest>
  : Expr extends `]${infer rest extends string}` ?
    GetCurCell<St[0], St[1]> extends _0
      ? Interpreter<[St[0], St[1], St[2], St[3] extends [string, ...(infer stack extends string[])] ? stack : []], rest>
      : St[3] extends [infer goto extends string, ...string[]] ? Interpreter<St, goto> : ParseError<'Invalid loop'>
  : ParseError<'Invalid character'>
