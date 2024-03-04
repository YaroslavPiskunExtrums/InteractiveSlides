import { FC, useRef } from 'react'
import { PersonalizationSettingsType } from 'src/lib/types/personalizationConfig.types'
import './text-personalization.styles.scss'
import { css } from '@emotion/css'
import classNames from 'src/lib/util/classNames'
import apiLink from 'src/helpers/api_links'
import { fontsList } from 'src/lib/constants/fontFamily'

type TextPersonalizationProps = {
  config: PersonalizationSettingsType
}
const doubleBorder = 4

export const TextPersonalization: FC<TextPersonalizationProps> = ({ config }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const styles = css`
    font-size: ${config.textConfig.fontSize}px;
    color: ${config.textConfig.textColor};
    text-align: ${config.textConfig.layout};
  `

  const fontIndex = config?.textConfig?.fontIndex || '0'

  const fontFace = css`
    @font-face {
      font-family: ${fontsList[Number(fontIndex)].name};
      font-style: normal;
      font-weight: 400;
      src: url(${apiLink}${fontsList[Number(fontIndex)].link}) format('truetype');
    }

    font-family: ${fontsList[Number(fontIndex)].name};
  `
  return (
    <textarea
      ref={textAreaRef}
      value={config.text}
      placeholder="Type your text"
      className={classNames('personalization-textarea', styles, fontFace)}
      readOnly
      onFocus={(e) => {
        if (!textAreaRef.current) return
        textAreaRef.current.style.border = '2px dashed #969696'
      }}
      onInput={(e) => {
        if (!textAreaRef.current) return
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + doubleBorder + 'px'
      }}
      onBlur={(e) => {
        if (!textAreaRef.current?.value) return
        textAreaRef.current.style.border = 'none'
      }}
    />
  )
}
