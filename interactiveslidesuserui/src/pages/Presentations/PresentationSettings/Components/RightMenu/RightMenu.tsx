import './_rightMenu.scss'
import usePresentationSettingsStore from '../../presentation-settings.store'
import {
  FIGURES,
  FiguresValues,
  MultipleChoiceType,
  figuresArray,
} from 'src/helpers/interactive-elements'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'reactstrap'
import { toast } from 'react-toastify'
import apiLink from '../../../../../helpers/api_links'
import OpenFieldEdit from './Components/InteractiveFields/OpenFieldEdit'
import ButtonsFieldEdit from './Components/InteractiveFields/ButtonsFieldEdit'
import CalculatorEditField from './Components/InteractiveFields/CalculatorEditField'
import CustomerDetailsEditField from './Components/InteractiveFields/CustomerDetailsEditField'
import MultipleChoiceEditField from './Components/InteractiveFields/MultipleChoiceEditField'
import RangeSelectorEditField from './Components/InteractiveFields/RangeSelectorEditField'
import SyncIntegrationModal from './Components/SyncIntegrationModal'
import HubspotIntegrations from './Components/HubspotIntegrations'
import getUserObjectFromSession from '../../../../../helpers/userObjectFromJwt'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { IElementTypeForm, IForm, IIntegrationPropertyForm } from './right-menu.types'
import SelectElementType from './Components/SelectElementType'
import { rightMenuValidation } from './right-menu.resolver'
import { getFigureConfig } from 'src/lib/util/getFigureConfig'
import { updateAddInStatus } from 'src/lib/api/contentAddIn'
import { saveDefaultStyles } from 'src/lib/api/html'
import DateFieldEdit from 'src/pages/Presentations/PresentationSettings/Components/RightMenu/Components/InteractiveFields/DateFieldEdit'
import { PersonalizationEdit } from './Components/InteractiveFields/Personalization'

type Answer = ({ label: string; value: string } | string)[]

const updateNewFigure = async (newActiveMenuConfig, activeFigure, presentationSettings) => {
  try {
    const response = await updateAddInStatus(
      newActiveMenuConfig,
      activeFigure?.name,
      presentationSettings?.unique_Id
    )

    const res = await response.json()
    if (response.status === 200) {
      toast.success('Config was saved')
    } else {
      toast.error('Error while saving config')
    }
  } catch (e) {
    toast.error('Error while saving config')
    console.log('ERROR', e)
  }
}

const RightMenu = () => {
  const {
    isEditMenuActive,
    properties,
    setIsEditMenuActive,
    activeFigure,
    updateFigureConfig,
    presentationSettings,
    setActiveFigure,
    downloadProperties,
    updatePresentationSettings,
  } = usePresentationSettingsStore() as any

  function closeMenu() {
    setIsEditMenuActive(false)
    setActiveFigure({})
  }

  const [activeMenuConfig, setActiveMenuConfig] = useState(
    typeof activeFigure?.content_config === 'string'
      ? JSON.parse(activeFigure?.content_config)
      : activeFigure?.content_config
  )

  useEffect(() => {
    setActiveMenuConfig(
      typeof activeFigure?.content_config === 'string'
        ? JSON.parse(activeFigure?.content_config)
        : activeFigure?.content_config
    )
  }, [activeFigure])

  const [showSyncModal, setShowSyncModal] = useState(false)

  const [customIntegrationFieldName, setCustomIntegrationFieldName] = useState('')

  const {
    reset: propertyReset,
    getValues: propertyGetValues,
    setValue: propertySetValue,
    watch: propertyWatch,
  } = useForm<IIntegrationPropertyForm>({
    mode: 'onChange',
    defaultValues: {
      integrationPropertiesType: 'company',
      selectedIntegrationProperty: properties?.['company']?.[0] ?? {
        type: 'text',
        fieldType: 'string',
        name: 'null',
        label: 'Null',
        id: 0,
      },
    },
  })

  const {
    control: elementTypeControl,
    reset: elementTypeReset,
    getValues: getElementTypeValues,
    watch: watchElementType,
  } = useForm<IElementTypeForm>({
    mode: 'onChange',
    defaultValues: {
      elementType: figuresArray[activeMenuConfig?.selectedItem],
    },
  })

  const answersFromElementConfig = useRef(null)

  const methods = useForm<IForm>({
    resolver: yupResolver(rightMenuValidation),
    mode: 'onChange',
    defaultValues: {},
  })

  useEffect(() => {
    const itemsConfigs = activeMenuConfig?.itemConfig

    const selectedItemConfig = itemsConfigs?.length
      ? itemsConfigs[activeMenuConfig?.selectedItem]
      : {}

    if (selectedItemConfig?.answers) {
      const answers = (selectedItemConfig.answers as Answer).map((answer) =>
        typeof answer === 'string' ? { label: answer, value: answer } : answer
      )

      methods.reset({
        ...selectedItemConfig,
        answers,
      })
    } else {
      methods.reset(selectedItemConfig)
    }
  }, [watchElementType('elementType'), activeMenuConfig])

  useEffect(() => {
    downloadProperties()
  }, [])

  useEffect(() => {
    const scope = activeFigure?.integration?.scope
    const integrationFieldName = activeFigure?.integration?.integrationFieldName

    propertyReset({
      integrationPropertiesType: scope ?? 'company',
      selectedIntegrationProperty:
        scope && integrationFieldName
          ? properties[scope].find((property) => property.name === integrationFieldName)
          : properties[0],
    })
  }, [activeFigure, properties, activeMenuConfig])

  useEffect(() => {
    const selectedItem = activeMenuConfig?.selectedItem
    elementTypeReset({ elementType: figuresArray[selectedItem] })

    methods.reset(activeMenuConfig?.itemConfig ? activeMenuConfig.itemConfig[selectedItem] : {})
  }, [activeMenuConfig?.selectedItem])

  const onSaveConfigState = async () => {
    let config = methods.watch()

    const view = config?.view

    if (
      view === MultipleChoiceType.buttonList ||
      view === MultipleChoiceType.dropdownList ||
      view === MultipleChoiceType.multipleSelector
    ) {
      let oldAnswers = methods.formState.defaultValues.answers
      if (answersFromElementConfig.current) {
        oldAnswers = answersFromElementConfig.current
      }

      const answers = config.answers?.map((answer, index) => {
        if (oldAnswers && oldAnswers[index] && oldAnswers[index].value) {
          return { label: answer?.label, value: oldAnswers[index].value }
        }
        return { label: answer.label, value: answer.label }
      })

      config = { ...config, answers: answers }
    }

    config = getFigureConfig({
      conf: config,
      figure: getElementTypeValues('elementType') as FiguresValues,
      type: 'data',
    })

    const newActiveMenuConfig = JSON.parse(JSON.stringify(activeMenuConfig))

    newActiveMenuConfig.selectedItem = figuresArray.indexOf(
      getElementTypeValues('elementType') as FiguresValues
    )
    newActiveMenuConfig.itemConfig[newActiveMenuConfig.selectedItem] = config

    await updateNewFigure(newActiveMenuConfig, activeFigure, presentationSettings)

    if (
      activeFigure.integration.integrationFieldName !==
        propertyGetValues('selectedIntegrationProperty')?.name &&
      propertyGetValues('selectedIntegrationProperty')
    ) {
      let integrationConfig = presentationSettings?.integration_fields
        ? JSON.parse(presentationSettings?.integration_fields)
        : {
            deals: [],
            company: [],
            contact: [],
          }

      if (integrationConfig) {
        //DELETE OLD INTEGRATION VALUES OF THE ELEMENT
        for (const scope in integrationConfig) {
          const scopeFields = integrationConfig[scope]
          for (const field of scopeFields) {
            const [integrationFieldName, fieldValue] = Object.entries(field)[0] as any
            if (fieldValue.id === activeFigure.id) {
              integrationConfig[scope] = integrationConfig[scope].filter((field) => {
                const fieldProperty = Object.values(field)[0] as any
                return activeFigure?.id !== fieldProperty?.id
              })
            }
          }
        }

        //ADD NEW INTEGRATION VALUES OF THE ELEMENT

        if (propertyGetValues('selectedIntegrationProperty')?.name !== 'null') {
          if (
            customIntegrationFieldName &&
            propertyGetValues('selectedIntegrationProperty')?.name.indexOf('custom_field_') !== -1
          ) {
            const fieldName = customIntegrationFieldName.toLowerCase().split(' ').join('_')
            integrationConfig[propertyGetValues('integrationPropertiesType')].push({
              [fieldName]: {
                id: activeFigure.id,
              },
            })
          } else {
            integrationConfig[propertyGetValues('integrationPropertiesType')].push({
              [propertyGetValues('selectedIntegrationProperty')?.name]: {
                id: activeFigure.id,
              },
            })
          }
        }

        if (
          customIntegrationFieldName &&
          propertyGetValues('selectedIntegrationProperty')?.name.indexOf('custom_field_') !== -1
        ) {
          const customFieldData = {
            label: customIntegrationFieldName,
            scope: propertyGetValues('integrationPropertiesType'),
            userId: getUserObjectFromSession().id,
          }

          try {
            const response = await fetch(
              `${apiLink}/api/integrations/hubspot/create-custom-field`,
              {
                method: 'POST',
                body: JSON.stringify(customFieldData),
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `${
                    JSON.parse(sessionStorage.getItem('authUser') as any).accessToken
                  }`,
                },
              }
            )
            const res = await response.json()

            if (response.status !== 200) {
              toast.error('Error while creating custom property')
            }
            await downloadProperties()
          } catch (e) {
            console.log('ERROR', e)
            toast.error('Error while creating custom property')
            return
          }
        }
      }

      updatePresentationSettings({ integration_fields: JSON.stringify(integrationConfig) })
      try {
        const updateConfigResponse = await fetch(
          `${apiLink}/api/integrations/hubspot/update-integration-config`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${JSON.parse(sessionStorage.getItem('authUser') as any).accessToken}`,
            },
            body: JSON.stringify({
              presentationId: presentationSettings?.id,
              integrationConfig,
            }),
          }
        )
        if (updateConfigResponse.status !== 200) {
          toast.error('Error while updating integration config')
        }
      } catch (e) {
        console.log('ERROR', e)
        toast.error('Error while updating integration config')
      }
    }
    updateFigureConfig(newActiveMenuConfig)

    setCustomIntegrationFieldName('')
    propertySetValue('selectedIntegrationProperty', {
      type: 'text',
      fieldType: 'string',
      name: 'null',
      id: 0,
      label: 'Null',
    })
    closeMenu()
  }

  const saveAsDefault = async () => {
    await onSaveConfigState()

    let conf = methods.watch()

    conf = getFigureConfig({
      conf,
      figure: getElementTypeValues('elementType') as FiguresValues,
      type: 'styles',
    })

    const styleConfig = {
      [FIGURES.BUTTON]: { target: FIGURES.BUTTON, styles: JSON.stringify(conf) },
      [FIGURES.CALCULATOR]: { target: FIGURES.CALCULATOR, styles: JSON.stringify(conf) },
      [FIGURES.CUSTOMER_DETAILS]: {
        target: FIGURES.CUSTOMER_DETAILS,
        styles: JSON.stringify(conf),
      },
      [FIGURES.MULTIPLE_CHOICE]: { target: FIGURES.MULTIPLE_CHOICE, styles: JSON.stringify(conf) },
      [FIGURES.OPEN_FIELD]: { target: FIGURES.OPEN_FIELD, styles: JSON.stringify(conf) },
      [FIGURES.RANGE_SELECTOR]: { target: FIGURES.RANGE_SELECTOR, styles: JSON.stringify(conf) },
      [FIGURES.DATE_FIELD]: { target: FIGURES.DATE_FIELD, styles: JSON.stringify(conf) },
    }
    const key = Object.values(FIGURES).find((ent) => ent === getElementTypeValues('elementType'))
    const styleConfigForSave = styleConfig[key]
    if (!styleConfigForSave) {
      toast.error('Error while saving default property')
      return
    }

    try {
      const response = await saveDefaultStyles(styleConfigForSave)

      if (response.status !== 200) {
        toast.error('Error while saving default property')
        return
      }
      toast.success('Success saving default properties')
    } catch (e) {
      toast.error('Error while saving default property')
    }
  }

  const figuresObj = {
    [FIGURES.OPEN_FIELD]: <OpenFieldEdit />,
    [FIGURES.BUTTON]: <ButtonsFieldEdit />,
    [FIGURES.CALCULATOR]: <CalculatorEditField />,
    [FIGURES.CUSTOMER_DETAILS]: <CustomerDetailsEditField />,
    [FIGURES.MULTIPLE_CHOICE]: <MultipleChoiceEditField />,
    [FIGURES.RANGE_SELECTOR]: <RangeSelectorEditField />,
    [FIGURES.DATE_FIELD]: <DateFieldEdit />,
    [FIGURES.PERSONALIZATION]: <PersonalizationEdit />,
  }

  return (
    <div className={`right-menu ${isEditMenuActive ? '--active' : ''}`}>
      <div className="right-menu_header mb-2">
        <div onClick={closeMenu} className={'right-menu_close-button'}>
          <i className={'ri-close-line align-middle fw-medium'}></i>
        </div>
      </div>
      <div className="right-menu_body mt-4 pt-4">
        <SelectElementType elementTypeControl={elementTypeControl} />
        <FormProvider {...methods}>{figuresObj[getElementTypeValues('elementType')]}</FormProvider>
        {getElementTypeValues('elementType') !== FIGURES.PERSONALIZATION && (
          <HubspotIntegrations
            propertySetValue={propertySetValue}
            integrationPropertiesType={propertyWatch('integrationPropertiesType')}
            selectedIntegrationProperty={propertyWatch('selectedIntegrationProperty')}
            properties={properties}
            elementType={watchElementType('elementType') as FiguresValues}
            setShowSyncModal={setShowSyncModal}
            customIntegrationFieldName={customIntegrationFieldName}
            setCustomIntegrationFieldName={setCustomIntegrationFieldName}
          />
        )}
      </div>
      <div className={'right-menu_footer'}>
        <Button
          disabled={
            !customIntegrationFieldName &&
            propertyGetValues('selectedIntegrationProperty')?.name &&
            propertyGetValues('selectedIntegrationProperty')?.name.indexOf('custom_field_') !== -1
          }
          onClick={onSaveConfigState}
          className={'w-100 fs-5 mt-4'}
          color={'success'}
        >
          Save
        </Button>
        <Button onClick={saveAsDefault} className={'w-100 fs-5 mt-3'} color={'primary'}>
          Save as default
        </Button>
      </div>

      {watchElementType('elementType') === FIGURES.MULTIPLE_CHOICE && (
        <FormProvider {...methods}>
          <SyncIntegrationModal
            show={showSyncModal}
            selectedIntegrationProperty={propertyGetValues('selectedIntegrationProperty')}
            onClose={() => {
              setShowSyncModal(!showSyncModal)
            }}
            onSync={async (integrationConnections) => {
              const newActiveMenuConfig = JSON.parse(JSON.stringify({ ...activeMenuConfig }))

              const elementConfig =
                newActiveMenuConfig?.itemConfig[newActiveMenuConfig.selectedItem]
              elementConfig.answers = integrationConnections

              answersFromElementConfig.current = integrationConnections

              await updateNewFigure(newActiveMenuConfig, activeFigure, presentationSettings)
            }}
          />
        </FormProvider>
      )}
    </div>
  )
}
export default RightMenu
