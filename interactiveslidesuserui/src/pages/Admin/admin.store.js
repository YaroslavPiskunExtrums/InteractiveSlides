import {create} from "zustand"
import apiUrl from "../../helpers/api_links"
import getUserObjectFromSession from "../../helpers/userObjectFromJwt"
import {toast} from "react-toastify"
import {removeUser} from 'src/lib/api/saasUsers'
import {authFetch} from 'src/lib/util/auth'

const adminStore = create((set) => ({
  users: [],

  addUser: async (user) => {
    try {
      const addUserRequest = await authFetch(`/api/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...user, company_id: getUserObjectFromSession()?.saas_company_id})
      }
      )
      set((state) => ({users: [...state.users, user]}))
      toast.success("User is added")
    } catch(e) {
      console.log(e)
      toast.error("Error while adding user")
    }
  },
  removeUser: async (user) => {
    try {
      const removeUserRequest = await removeUser(user.id)
      if(removeUserRequest.status === 200) {
        set((state) => ({users: state.users.filter((u) => u.id !== user.id)}))
        toast.success("User is removed")
      }
    } catch(e) {
      console.log(e)
      toast.error("Error while removing user")
    }

  },
  updateUserPassword: (user) => set((state) => ({users: state.users.map((u) => u.id === user.id ? user : u)})),
  getUsers: async () => {
    try {
      const presentationRequest = await authFetch(`/api/super-user/users-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const res = await presentationRequest.json()
      console.log("ALL USERS ARE", res)
      set({users: res})
    } catch(e) {
      console.log(e)
      set({users: []})
    }
  }
}))

export default adminStore