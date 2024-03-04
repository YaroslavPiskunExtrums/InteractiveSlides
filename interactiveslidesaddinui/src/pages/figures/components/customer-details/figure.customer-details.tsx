import React, { useState } from 'react'
import './figure.customer-details.sass'
import { FigureCustomerDetailsProps } from '../../../../types/figures-config.props'
import InputOpenField from '../open-field/input-open-field'
import { css } from '@emotion/css'
import { IAddinFigure } from '../../../../types/IAddinFigure'
import { useGlobalStore } from '../../../../global-store'
import { debounce } from '../../../../lib/utils/debounce'
import { PresentationAPIClient } from '../../../../lib/api/presentation-api'
import DropdownSelect from './components/dropdown-select'

export default function FigureCustomerDetails({ figure }: { figure: IAddinFigure }) {
  const config: FigureCustomerDetailsProps['config'] = figure.content_config
  const resolveFigure = useGlobalStore((state) => state.resolve)
  const figures = useGlobalStore((state) => state.figures)
  const { setIsLoading, setError } = useGlobalStore()
  const session = React.useRef((window as any).presentation.session)

  const [formData, setFormData] = useState({
    fullName: config?.fullName || '',
    email: config?.email || '',
    phone: config?.phone || '',
    textMessage: config?.textMessage || '',
    business: config?.business || '',
    additionalFields: config?.additionalFields || [],
  })

  const debounceFormDataChange = React.useCallback(
    debounce(async (field: string, value: string) => {
      try {
        setIsLoading(true)
        const newData = { ...formData, [field]: value }
        setFormData(newData)
        // @ts-ignore
        config[field] = value

        const figureData = figures[figure.name].content_config
        await PresentationAPIClient.autoSaveFigure({
          sessionId: session.current,
          id: figure.id,
          value: null,
          fullName: figureData.fullName ?? '',
          email: figureData.email ?? '',
          phone: figureData.phone ?? '',
          business: figureData.business ?? '',
          additionalFields: figureData.additionalFields ?? [],
          textMessage: figureData.textMessage ?? '',
        })

        resolveFigure({ ...figure, content_config: { ...figure.content_config, ...newData } })
        await PresentationAPIClient.sendPresentation(
          JSON.parse(
            JSON.stringify({
              ...figures,
              [figure.name]: {
                ...figure,
                content_config: config,
              },
            })
          ),
          session.current
        )
      } catch (e) {
        if (e instanceof Error) console.warn(JSON.stringify(e.message))
        else console.warn(JSON.stringify(e))
      } finally {
        setIsLoading(false)
      }
    }, 500),
    [figures]
  )

  const debounceAdditionalDataChange = React.useCallback(
    debounce(async (index: number, data: string) => {
      const newData = { ...formData }
      newData.additionalFields[index] = data
      setFormData(newData)
      config.additionalFields[index] = data
      resolveFigure({ ...figure, content_config: { ...figure.content_config, ...newData } })
      await PresentationAPIClient.sendPresentation(
        JSON.parse(
          JSON.stringify({
            ...figures,
            [figure.name]: {
              ...figure,
              content_config: config,
            },
          })
        ),
        session.current
      )
    }, 500),
    [figures]
  )

  const formStyles = css`
    background-color: ${config.formConfig.backColor};
    border-radius: ${config.formConfig.borderRadius}px;
    border: 1px solid ${config.formConfig.borderColor};
  `
  const selectStyles = css`
    background-color: ${config.inputConfig.backColor};
    border-radius: ${config.inputConfig.borderRadius}px;
    border: 1px solid ${config.inputConfig.borderColor};
    font-size: ${config.inputConfig.fontSize}px;
    color: ${config.inputConfig.textColor};
  `

  return (
    <div className={`figure-customer-details`}>
      <form className={`customer-details-form ${formStyles}`}>
        <h2>Customer Details</h2>
        <label>
          <span>Type your full name</span>
          <InputOpenField
            backColor={config.inputConfig.backColor}
            fontSize={config.inputConfig.fontSize}
            borderColor={config.inputConfig.borderColor}
            borderRadius={config.inputConfig.borderRadius}
            textColor={config.inputConfig.textColor}
            placeholder={''}
            onChange={(e) => debounceFormDataChange('fullName', e.target.value)}
            defaultValue={config.fullName}
          />
        </label>
        <label>
          <span>Type your email</span>
          <InputOpenField
            backColor={config.inputConfig.backColor}
            fontSize={config.inputConfig.fontSize}
            borderColor={config.inputConfig.borderColor}
            borderRadius={config.inputConfig.borderRadius}
            textColor={config.inputConfig.textColor}
            placeholder={''}
            onChange={(e) => debounceFormDataChange('email', e.target.value)}
            defaultValue={config.email}
          />
        </label>
        <label>
          <span>Provide your phone number</span>
          <InputOpenField
            backColor={config.inputConfig.backColor}
            fontSize={config.inputConfig.fontSize}
            borderColor={config.inputConfig.borderColor}
            borderRadius={config.inputConfig.borderRadius}
            textColor={config.inputConfig.textColor}
            placeholder={''}
            onChange={(e) => debounceFormDataChange('phone', e.target.value)}
            defaultValue={config.phone}
          />
        </label>
        <label>
          <span>Select your business</span>
          <DropdownSelect
            options={[
              { id: 'Architecture', value: 'Architecture' },
              { id: 'Engineering', value: 'Engineering' },
            ]}
            onChange={(e) => debounceFormDataChange('business', e.target.value)}
            className={selectStyles}
          />
        </label>

        <label>
          <span>Text your message</span>
          <InputOpenField
            backColor={config.inputConfig.backColor}
            fontSize={config.inputConfig.fontSize}
            borderColor={config.inputConfig.borderColor}
            borderRadius={config.inputConfig.borderRadius}
            textColor={config.inputConfig.textColor}
            onChange={(e) => debounceFormDataChange('textMessage', e.target.value)}
            placeholder={''}
            type={'textarea'}
            defaultValue={config.textMessage}
          />
        </label>

        {config.additionalFields.map((field, index) => {
          return (
            <label key={index}>
              <span>Additional field {index}</span>
              <InputOpenField
                backColor={config.inputConfig.backColor}
                fontSize={config.inputConfig.fontSize}
                borderColor={config.inputConfig.borderColor}
                borderRadius={config.inputConfig.borderRadius}
                textColor={config.inputConfig.textColor}
                onChange={(e) => debounceAdditionalDataChange(index, e.target.value)}
                placeholder={''}
                defaultValue={field}
              />
            </label>
          )
        })}
      </form>
    </div>
  )
}
