import { create } from "zustand"
import apiUrl from "../../helpers/api_links"
import getUserObjectFromSession from "../../helpers/userObjectFromJwt"
import { toast } from "react-toastify"
import { getCompanyUsers, removeUser } from 'src/lib/api/saasUsers'

const useUsersStore = create((set) => ({
  users: [],

  addUser: async (user) => {
    try {
      const addUserRequest = await fetch(`${apiUrl}/api/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${JSON.parse(sessionStorage.getItem("authUser")).accessToken}`
        },
        body: JSON.stringify({ ...user, company_id: getUserObjectFromSession()?.saas_company_id })
      }
      )
      set((state) => ({ users: [...state.users, user] }))
      toast.success("User is added")
    } catch (e) {
      console.log(e)
      toast.error("Error while adding user")
    }
  },
  removeUser: async (user) => {
    try {
      const removeUserRequest = await removeUser(user.id)
      if (removeUserRequest.status === 200) {
        set((state) => ({ users: state.users.filter((u) => u.id !== user.id) }))
        toast.success("User is removed")
      }
    } catch (e) {
      console.log(e)
      toast.error("Error while removing user")
    }

  },
  updateUserPassword: (user) => set((state) => ({ users: state.users.map((u) => u.id === user.id ? user : u) })),
  getUsers: async () => {
    try {
      const res = await getCompanyUsers(getUserObjectFromSession()?.saas_company_id)
      console.log(res)
      set({ users: res })
    } catch (e) {
      console.log(e)
      set({ users: [] })
    }
  }
}))

export default useUsersStore