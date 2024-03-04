import { create } from 'zustand'
import apiUrl from 'src/helpers/api_links'
import getUserObjectFromSession from 'src/helpers/userObjectFromJwt'
import { getPresentationSettings } from 'src/lib/api/html'


const usePresentationSettingsStore = create((set) => ({
  presentationSettings: null,
  activeSlide: 0,
  isEditMenuActive: false,
  activeFigure: {},
  properties: { contact: [], company: [], deals: [] },
  integrationFields: {
    contact: [],
    company: [],
    deals: [],
  },


  downloadPresentationSettings: async (presentationId) => {
    try {
      const data = await getPresentationSettings(presentationId)
      set((state) => ({ ...state, presentationSettings: data.presentation }))
    } catch (e) {
      console.log(e)
      set((state) => ({ ...state, presentationSettings: [] }))
    }
  },
  setActiveSlide: (slide) => {
    set((state) => ({ ...state, activeSlide: slide, activeFigure: {}, isEditMenuActive: false }))
  },
  setActiveFigure: (figure) => {

    set((state) => {

      let integrationConfig = state.presentationSettings?.integration_fields

      if (integrationConfig) {
        integrationConfig = JSON.parse(integrationConfig)

        for (const scope in integrationConfig) {
          const scopeFields = integrationConfig[scope]
          for (const field of scopeFields) {
            const [integrationFieldName, fieldValue]: [integrationFieldName: string, fieldValue: any] = Object.entries(field)[0]
            if (fieldValue.id === figure.id) {
              return { ...state, activeFigure: { ...figure, integration: { scope, integrationFieldName } } }
            }
          }

        }

      }
      return { ...state, activeFigure: { ...figure, integration: { scope: null, integrationFieldName: null } } }

    })
  },
  updateFigureConfig: (figureConfig) => {
    set((state) => {

      const figureIndex = state.presentationSettings.slides[state.activeSlide].figures.findIndex((figure) => figure.id === state.activeFigure.id)
      const newSlides = [...state.presentationSettings.slides]
      newSlides[state.activeSlide].figures[figureIndex].content_config = figureConfig

      const newPresentationSettings = {
        ...state.presentationSettings, slides: newSlides,
      }


      return {
        ...state,
        activeFigure: { ...state.activeFigure, content_config: figureConfig },
        presentationSettings: newPresentationSettings,
      }
    })
  },
  setIsEditMenuActive: (isActive) => {
    set((state) => ({ ...state, isEditMenuActive: isActive }))
  },
  updatePresentationSettings: (updatedSettings) => {
    set((state) => ({ ...state, presentationSettings: { ...state.presentationSettings, ...updatedSettings } }))
  },
  downloadProperties: async () => {
    const userObj = getUserObjectFromSession()

    const companyPropertiesResponse = fetch(`${apiUrl}/api/integrations/hubspot/get-company-properties?userId=${userObj.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${JSON.parse(sessionStorage.getItem('authUser')).accessToken}`,
      },
    })

    const contactPropertiesResponse = fetch(`${apiUrl}/api/integrations/hubspot/get-contact-properties?userId=${userObj.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${JSON.parse(sessionStorage.getItem('authUser')).accessToken}`,
      },
    })

    const dealsPropertiesResponse = fetch(`${apiUrl}/api/integrations/hubspot/get-deals-properties?userId=${userObj.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${JSON.parse(sessionStorage.getItem('authUser')).accessToken}`,
      },
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
    } else {
      companyProperties = await res[0].json()
      contactProperties = await res[1].json()
      dealsProperties = await res[2].json()
      companyProperties = [{
        label: 'Null', name: 'null', type: 'string',
        id: 0,
      }, {
        label: 'Add new custom field',
        name: 'custom_field_company',
        type: 'string',
        id: 1,
      }, ...companyProperties.map((prop, ind) => ({ ...prop, id: ind + 2 }))]
      contactProperties = [{
        label: 'Null', name: 'null', type: 'string',
        id: 0,
      }, {
        label: 'Add new custom field',
        name: 'custom_field_contact',
        type: 'string',
        id: 1,
      }, ...contactProperties.map((prop, ind) => ({ ...prop, id: ind + 2 }))]
      dealsProperties = [{
        label: 'Null', name: 'null', type: 'string',
        id: 0,
      }, {
        label: 'Add new custom field',
        name: 'custom_field_deal',
        type: 'string',
        id: 1,
      }, ...dealsProperties.map((prop, ind) => ({ ...prop, id: ind + 2 }))]
    }

    set((state) => ({
      ...state,
      properties: { company: companyProperties, contact: contactProperties, deals: dealsProperties },
    }))
  },
  changePresentationTitle: (newTitle: string) => {
    set(state => {
      if (state.presentationSettings) {
        return { ...state, presentationSettings: { ...state.presentationSettings, name: newTitle } }
      }
      return state
    })
  },
  changePresentationTransition: (transition: string) => {
    set(state => {
      if (state.presentationSettings) {
        return { ...state, presentationSettings: { ...state.presentationSettings, transition } }
      }
      return state
    })

  }
}
))

export default usePresentationSettingsStore