declare global {
  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
  }

  type NumberORString = number | string

  export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T
  }
}

export {}
