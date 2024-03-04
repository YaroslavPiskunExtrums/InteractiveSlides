import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {devtools, persist} from "zustand/middleware";

interface IAuthGlobalStore {
  user: {
    id: number
    email: string
    language: string
    lastLogin: string
    firstName: string
    lastName: string
  }
}

function authStoreDef(set: ZustandSetter<IAuthGlobalStore>): IAuthGlobalStore {
  return {
    user: null,
  }
}

export const useAuthStore = create<IAuthGlobalStore>()(
  devtools(immer(persist(authStoreDef, { name: 'authStore' })))
)

