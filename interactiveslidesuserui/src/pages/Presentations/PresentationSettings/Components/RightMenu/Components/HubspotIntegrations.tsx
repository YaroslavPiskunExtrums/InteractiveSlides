import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { Button } from 'reactstrap'
import { FIGURES, FiguresValues } from 'src/helpers/interactive-elements'
import CustomDropdown from 'src/pages/Presentations/PresentationSettings/Components/Figures/customer-details/components/custom-dropdown'
import { IIntegrationProperty, IIntegrationPropertyForm } from '../right-menu.types'

interface IProps {
  elementType: FiguresValues
  setShowSyncModal: Dispatch<SetStateAction<boolean>>
  customIntegrationFieldName: string
  setCustomIntegrationFieldName: Dispatch<SetStateAction<string>>
  properties: any
  propertySetValue: UseFormSetValue<IIntegrationPropertyForm>

  integrationPropertiesType: string
  selectedIntegrationProperty: IIntegrationProperty
}

const HubspotIntegrations = (props: IProps) => {
  const {
    propertySetValue,
    integrationPropertiesType,
    selectedIntegrationProperty,
    elementType,
    setShowSyncModal,
    customIntegrationFieldName,
    setCustomIntegrationFieldName,

    properties,
  } = props

  const propertyOptions = Object.keys(properties || {}).map((prop: any, ind) => ({
    value: prop,
    id: prop?.id || ind,
  }))

  const integrationPropertyOptions = ((properties || {})[integrationPropertiesType] || []).map(
    (opt, ind) => ({ value: opt?.label, id: opt?.id ?? ind })
  )

  const [propInd, setPropInd] = useState(
    propertyOptions.find((prop) => prop.value === integrationPropertiesType)?.id ?? 0
  )

  const [integrationPropInd, setIntegrationPropInd] = useState(selectedIntegrationProperty?.id ?? 0)

  useEffect(() => {
    const newType = propertyOptions.find((opt) => +opt?.id === +propInd)?.value

    if (newType) {
      propertySetValue('integrationPropertiesType', newType)
    }
  }, [propInd])

  useEffect(() => {
    const currentOption = integrationPropertyOptions.find((opt) => +opt?.id === +integrationPropInd)
    const newIntegrationProp = (properties || {})[integrationPropertiesType]?.find(
      (prop) => prop?.id === currentOption?.id
    )

    if (newIntegrationProp) {
      propertySetValue('selectedIntegrationProperty', newIntegrationProp)
    }
  }, [integrationPropInd])

  useEffect(() => {
    setPropInd(propertyOptions.find((opt) => opt.value === integrationPropertiesType)?.id ?? 0)
    setIntegrationPropInd(selectedIntegrationProperty?.id ?? properties?.[0]?.id)
  }, [integrationPropertiesType, selectedIntegrationProperty])

  return (
    <div className={'mb-4'}>
      <h5>Integration</h5>
      <div>
        <h6>Hubspot</h6>
        {propertyOptions && (
          <CustomDropdown
            selectedIndex={propInd}
            onChange={(e) => setPropInd(+e.currentTarget.value)}
            options={propertyOptions}
            fontSize="16"
            optionFontSize={'12'}
            width="100"
          />
        )}
        <div className={'mb-3 mt-3'}>
          <div className={'d-flex gap-2 align-items-center'}>
            {integrationPropertyOptions.length && (
              <CustomDropdown
                selectedIndex={integrationPropInd}
                onChange={(e) => setIntegrationPropInd(+e.currentTarget.value)}
                options={integrationPropertyOptions}
                fontSize="16"
                optionFontSize={'12'}
                width="100"
                isSearch
                searchPlaceholder="Search here..."
              />
            )}
            {elementType === FIGURES.MULTIPLE_CHOICE &&
            selectedIntegrationProperty?.type === 'enumeration' ? (
              <Button
                onClick={() => setShowSyncModal(true)}
                style={{
                  height: '24px',
                  paddingTop: '0px',
                  paddingBottom: '0px',
                  boxShadow: '0 2px 5px rgb(66, 99, 245)',
                }}
              >
                Sync
              </Button>
            ) : (
              <></>
            )}
          </div>

          {elementType === FIGURES.OPEN_FIELD && selectedIntegrationProperty?.type !== 'string' ? (
            <small className={'text-center'}>
              Type of this field is <b>{selectedIntegrationProperty?.fieldType}</b> but it could be
              any value.
            </small>
          ) : (
            <></>
          )}
          {selectedIntegrationProperty?.name &&
          selectedIntegrationProperty?.name.indexOf('custom_field_') !== -1 ? (
            <input
              value={customIntegrationFieldName}
              onChange={(e) => setCustomIntegrationFieldName(e.target.value)}
              placeholder={'Custom field name'}
              className={'form-control mt-3'}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default HubspotIntegrations
