
type ZustandSetterCallback<T> = (state: Partial<IAuthGlobalStore>) => Partial<IAuthGlobalStore>

declare global {
  type ZustandSetter<T> = (arg: Partial<IAuthGlobalStore> | ZustandSetterCallback<T>) => void
}

export {}
