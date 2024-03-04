import React from 'react'
import { FigureOpenFieldProps } from '../../../../types/figures-config.props'
import { css } from '@emotion/css'
import hexToRgba from '../../../../lib/utils/hex-to-rgba'

type InputProps = {
  type?: 'text' | 'textarea'
  placeholder?: string
  defaultValue?: string
  onChange?: (e: any) => void
  readonly?: boolean
}

export default function InputOpenField({
  backColor,
  textColor,
  borderColor,
  borderRadius,
  defaultValue = '',
  fontSize = '16',
  type = 'text',
  placeholder = '',
  onChange,
  readonly = false,
}: InputProps & FigureOpenFieldProps['config']['inputConfig']) {
  const inputStyle = css`
    background-color: ${backColor};
    color: ${textColor};
    border: 1px solid ${borderColor};
    border-radius: ${borderRadius}px;
    font-size: ${fontSize}px;

    &:focus {
      box-shadow: 0 0 0 0.2rem ${hexToRgba(borderColor, 0.25)};
    }

    &:read-only {
      background-color: ${backColor};
      color: ${textColor};
      border-color: ${borderColor};
      border-radius: ${borderRadius}px;
      font-size: ${fontSize}px;
    }
  `
  return (
    <div className={'figure-answer-input_openField'}>
      {type === 'textarea' ? (
        <textarea
          onChange={(e) => onChange && onChange(e)}
          className={`answer_input ${inputStyle}`}
          defaultValue={defaultValue}
          placeholder={placeholder}
          readOnly={readonly}
        />
      ) : (
        <input
          onChange={(e) => onChange && onChange(e)}
          defaultValue={defaultValue}
          className={`answer_input_openField ${inputStyle}`}
          type={'text'}
          placeholder={placeholder}
          readOnly={readonly}
        />
      )}
    </div>
  )
}
