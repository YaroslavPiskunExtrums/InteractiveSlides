import { FC } from 'react'
import { ImagePersonalization, TextPersonalization } from './components'
import { getConfig } from 'src/lib/util/getConfig'
import { PersonalizationSettingsType } from 'src/lib/types/personalizationConfig.types'
import './personalization.styles.scss'
import classNames from 'src/lib/util/classNames'
import { css } from '@emotion/css'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'

type PersonalizationProps = {
  figureActualSize: SizeType

  figure: {
    slide: number
    size: string
    presentation_id: string
    name: string
    id: string
    bounds: string
    content_config: string | null
  }
}

const Personalization: FC<PersonalizationProps> = (props) => {
  const config = getConfig(props.figure) as PersonalizationSettingsType

  const start = css`
    display: flex;
    align-items: start;
  `

  const calculateActualFontDecorator = (defaultFontSize: string | number) => {
    return calculateActualFont(props.figureActualSize, JSON.parse(props.figure.size) as SizeType, defaultFontSize)
  }

  const getPersonalizationType = {
    image: <ImagePersonalization config={config} />,
    text: <TextPersonalization config={config} />,
  }
  console.log(config)
  return (
    <div className={classNames('personalization-container', config.type === 'image' && !config.imageUrl && start)}>
      {getPersonalizationType[config.type]}
    </div>
  )
}

export default Personalization
