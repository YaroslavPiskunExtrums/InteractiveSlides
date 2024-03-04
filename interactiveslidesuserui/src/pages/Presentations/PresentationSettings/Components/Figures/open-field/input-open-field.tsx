import React from 'react'
import { css } from '@emotion/css'
import hexToRgba from '../../../../../../helpers/hexToRgba'
import classNames from 'src/lib/util/classNames'

export default function InputOpenField({
  backColor,
  textColor,
  borderColor,
  borderRadius = 0,
  defaultValue = '',
  fontSize = '16',
  type = 'text',
  placeholder = 'Type here...',
  onChange,
  readonly = false,
}) {
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
    <div className={'figure-answer-input'}>
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
          className={classNames(inputStyle, `answer_input`)}
          type={'text'}
          placeholder={placeholder}
          readOnly={readonly}
        />
      )}
    </div>
  )
}
