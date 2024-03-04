import React, { FC, useState } from 'react'
import './figure.customer-details.sass'
import InputOpenField from '../open-field/input-open-field'
import { css } from '@emotion/css'
import DropdownSelect from './components/dropdown-select'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'

type FigureCustomerDetailsProps = {
  figure: { content_config: string | object; size: string }
  figureActualSize: SizeType
}

const FigureCustomerDetails: FC<FigureCustomerDetailsProps> = ({ figure, figureActualSize }) => {
  const config =
    typeof figure?.content_config === 'string'
      ? JSON.parse(figure.content_config)
      : typeof figure.content_config === 'object'
        ? figure.content_config
        : {}

  const calculateActualFontDecorator = (defaultFontSize: string | number) => {
    return calculateActualFont(figureActualSize, JSON.parse(figure.size) as SizeType, defaultFontSize)
  }

  const figureConfig = config?.itemConfig[config.selectedItem]

  const formStyles = css`
    background-color: ${figureConfig.formConfig.backColor};
    border-radius: ${figureConfig.formConfig.borderRadius}px;
    border: 1px solid ${figureConfig.formConfig.borderColor};
  `
  const selectStyles = css`
    background-color: ${figureConfig.inputConfig.backColor};
    border-radius: ${figureConfig.inputConfig.borderRadius}px;
    border: 1px solid ${figureConfig.inputConfig.borderColor};
    font-size: ${calculateActualFontDecorator(figureConfig.inputConfig.fontSize)}px;
    color: ${figureConfig.inputConfig.textColor};
  `

  return (
    <div className={`figure-customer-details`}>
      <form className={`customer-details-form ${formStyles}`}>
        <h2 style={{ fontSize: `${calculateActualFontDecorator(32)}px` }}>Customer Details</h2>
        <label>
          <span style={{ fontSize: `${calculateActualFontDecorator(16)}px` }}>Type your full name</span>
          <InputOpenField
            backColor={figureConfig.inputConfig.backColor}
            fontSize={String(calculateActualFontDecorator(figureConfig.inputConfig.fontSize))}
            borderColor={figureConfig.inputConfig.borderColor}
            borderRadius={figureConfig.inputConfig.borderRadius}
            textColor={figureConfig.inputConfig.textColor}
            placeholder={''}
            defaultValue={figureConfig.fullName}
            onChange={() => {}}
          />
        </label>
        <label>
          <span style={{ fontSize: `${calculateActualFontDecorator(16)}px` }}>Type your email</span>
          <InputOpenField
            backColor={figureConfig.inputConfig.backColor}
            fontSize={String(calculateActualFontDecorator(figureConfig.inputConfig.fontSize))}
            borderColor={figureConfig.inputConfig.borderColor}
            borderRadius={figureConfig.inputConfig.borderRadius}
            textColor={figureConfig.inputConfig.textColor}
            placeholder={''}
            defaultValue={figureConfig.email}
            onChange={() => {}}
          />
        </label>
        <label>
          <span style={{ fontSize: `${calculateActualFontDecorator(16)}px` }}>Provide your phone number</span>
          <InputOpenField
            backColor={figureConfig.inputConfig.backColor}
            fontSize={String(calculateActualFontDecorator(figureConfig.inputConfig.fontSize))}
            borderColor={figureConfig.inputConfig.borderColor}
            borderRadius={figureConfig.inputConfig.borderRadius}
            textColor={figureConfig.inputConfig.textColor}
            placeholder={''}
            defaultValue={figureConfig.phone}
            onChange={() => {}}
          />
        </label>
        <label>
          <span style={{ fontSize: `${calculateActualFontDecorator(16)}px` }}>Select your business</span>
          <DropdownSelect
            options={[
              { id: 'Architecture', value: 'Architecture' },
              { id: 'Engineering', value: 'Engineering' },
            ]}
            className={selectStyles}
            onChange={() => {}}
          />
        </label>

        <label>
          <span style={{ fontSize: `${calculateActualFontDecorator(16)}px` }}>Text your message</span>
          <InputOpenField
            backColor={figureConfig.inputConfig.backColor}
            fontSize={String(calculateActualFontDecorator(figureConfig.inputConfig.fontSize))}
            borderColor={figureConfig.inputConfig.borderColor}
            borderRadius={figureConfig.inputConfig.borderRadius}
            textColor={figureConfig.inputConfig.textColor}
            placeholder={''}
            type={'textarea'}
            defaultValue={figureConfig.textMessage}
            onChange={() => {}}
          />
        </label>

        {figureConfig.additionalFields.map((field, index) => {
          return (
            <label key={index}>
              <span>Additional field {index}</span>
              <InputOpenField
                backColor={figureConfig.inputConfig.backColor}
                fontSize={String(calculateActualFontDecorator(figureConfig.inputConfig.fontSize))}
                borderColor={figureConfig.inputConfig.borderColor}
                borderRadius={figureConfig.inputConfig.borderRadius}
                textColor={figureConfig.inputConfig.textColor}
                placeholder={''}
                defaultValue={field}
                onChange={() => {}}
              />
            </label>
          )
        })}
      </form>
    </div>
  )
}

export default FigureCustomerDetails
