import { Nat, Succ, Pred, _0, _1, _2, _3, _4, _5 } from './nat'

type GenerateList<Size extends Nat, Item extends Nat, Acc extends Nat[] = []> =
  Size extends _0 ? Acc
  : [Nat] extends [Size] ? Nat[]
  : GenerateList<Pred<Size>, Item, [...Acc, Item]>

type State<Cur extends Nat, Cells extends Nat[], Out extends Nat[]> = [Cur, Cells, Out]

type Operation<N extends Nat> = {
  Succ: Succ<N>,
  Pred: Pred<N>,
}

type UpdateCellAt0<Ls extends Nat[], Op extends keyof Operation<Nat>> =
  Ls extends [] ? [] : Ls extends [infer H extends Nat, ...infer T extends Nat[]] ? [Operation<H>[Op], ...T] : Ls

type UpdateCellAtN<N extends Nat, Ls extends Nat[], Op extends keyof Operation<Nat>, Acc extends Nat[] = []> =
  N extends _0 ? [...Acc, ...UpdateCellAt0<Ls, Op>]
  : Ls extends [infer H extends Nat, ...(infer Tail extends Nat[])]
    ? UpdateCellAtN<Pred<N>, Tail, Op, [...Acc, H]>
  : never
  
type UpdateCell<St extends State<Nat, Nat[], Nat[]>, Op extends keyof Operation<Nat>> = [
  St[0],
  UpdateCellAtN<St[0], St[1], Op>,
  St[2]
]

// type DecrementCell<St extends State<Nat, Nat[], Nat[]>> = [
//   St[0],
//   St[1] extends [infer H extends Nat, ...infer T extends Nat[]] ? [Succ<H>, ...T] : St[1],
//   St[2]
// ]

type Interpreter<St extends State<Nat, Nat[], Nat[]>, Expr extends string> =
  Expr extends '' ? St
  : Expr extends `+${infer rest extends string}` ? Interpreter<UpdateCell<St, 'Succ'>, rest>
  : Expr extends `-${infer rest extends string}` ? Interpreter<St, rest>
  : never


type Assert<T extends true> = T
type IsEq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false

type _x = Interpreter<State<_1, GenerateList<_3, _0>, []>, '+++++'>

export type _tests = [
  Assert<IsEq<Interpreter<State<_0, GenerateList<_3, _0>, []>, '+++++'>, State<_0, [_5, _0, _0], []>>>,
  Assert<IsEq<Interpreter<State<_1, GenerateList<_3, _0>, []>, '+++++'>, State<_1, [_0, _5, _0], []>>>,
  // Assert<IsEq<Interpreter<State<_0, GenerateList<_3, _0>, []>, '+++++--'>, State<_0, [_3, _0, _0], []>>>,
]

