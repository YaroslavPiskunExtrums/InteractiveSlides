import { create } from 'zustand'
import apiUrl from "../../helpers/api_links"
import getUserObjectFromSession from "../../helpers/userObjectFromJwt"
import { getCompaniesPresentations } from 'src/lib/api/html'

type ObjectType = {
  bounds: string
  content_config: { itemConfig: any[], currentPage: number, selectedItem: number }
  figureName: string
  id: string
  name: string
  presentation_id: string
  size: string
  slide: number
}

export type PresentationType = {
  controls_colors: string
  date_time_stamp: string
  device_id: string
  id: string
  integration_fields: string
  name: string
  presentation_color: string
  presentation_icon: string
  save_color: string
  transition: string
  unique_Id: string
  user_id: string
  tags: {
    company_id: string
    created_at: string
    id: number
    tag_title: string
    updated_at: string
  }[]

}

type PresentationAndObjectType = {
  objects: ObjectType[]
} & PresentationType

type PresentationStoreType = {
  presentations: PresentationAndObjectType[]
  properties: { contact: [], company: [], deals: [] }

  setPresentations: (presentations: PresentationAndObjectType[]) => void
  addPresentation: (presentation: PresentationAndObjectType) => void
  removePresentation: (presentation: PresentationAndObjectType) => void
  updatePresentation: (presentation: PresentationAndObjectType) => void
  clearPresentations: () => void
  downloadPresentations: () => Promise<void>
  downloadProperties: () => Promise<void>
}


const usePresentationStore = create<PresentationStoreType>((set) => ({
  presentations: [],
  properties: { contact: [], company: [], deals: [] },

  setPresentations: (presentations) => set({ presentations }),
  addPresentation: (presentation) => set((state) => ({ presentations: [...state.presentations, presentation] })),
  removePresentation: (presentation) => set((state) => ({ presentations: state.presentations.filter((p) => p.id !== presentation.id) })),
  updatePresentation: (presentation) => set((state) => ({ presentations: state.presentations.map((p) => p.id === presentation.id ? presentation : p) })),
  clearPresentations: () => set((state) => ({ presentations: [], ...state })),
  downloadPresentations: async () => {
    try {
      const userObj = getUserObjectFromSession()
      const res = await getCompaniesPresentations(userObj.saas_company_id)
      console.log(res)
      set({ presentations: res })
    } catch (e) {
      console.log(e)
      set({ presentations: [] })
    }
  },

  downloadProperties: async () => {
    const userObj = getUserObjectFromSession()

    const companyPropertiesResponse = fetch(`${apiUrl}/api/integrations/hubspot/get-company-properties?userId=${userObj.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${JSON.parse(sessionStorage.getItem("authUser")).accessToken}`
      }
    })

    const contactPropertiesResponse = fetch(`${apiUrl}/api/integrations/hubspot/get-contact-properties?userId=${userObj.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${JSON.parse(sessionStorage.getItem("authUser")).accessToken}`
      }
    })

    const dealsPropertiesResponse = fetch(`${apiUrl}/api/integrations/hubspot/get-deals-properties?userId=${userObj.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${JSON.parse(sessionStorage.getItem("authUser")).accessToken}`
      }
    })

    const res = await Promise.all([companyPropertiesResponse, contactPropertiesResponse, dealsPropertiesResponse])
    let companyProperties = null
    let contactProperties = null
    let dealsProperties = null


    if (res.map(res => res.status).includes(500)) {

      companyProperties = []
      contactProperties = []
      dealsProperties = []

      console.warn('Error', res)
    }
    else {
      companyProperties = await res[0].json()
      contactProperties = await res[1].json()
      dealsProperties = await res[2].json()
      companyProperties = [{ label: "Null", name: 'null', type: "string" }, {
        label: "Add new custom field",
        name: "custom_field_company",
        type: "string"
      }, ...companyProperties]
      contactProperties = [{ label: "Null", name: 'null', type: "string" }, {
        label: "Add new custom field",
        name: "custom_field_contact",
        type: "string"
      }, ...contactProperties]
      dealsProperties = [{ label: "Null", name: 'null', type: "string" }, {
        label: "Add new custom field",
        name: "custom_field_deal",
        type: "string"
      }, ...dealsProperties]
    }

    set((state) => ({
      ...state,
      properties: { company: companyProperties, contact: contactProperties, deals: dealsProperties }
    }))
  }
}))

export default usePresentationStore
