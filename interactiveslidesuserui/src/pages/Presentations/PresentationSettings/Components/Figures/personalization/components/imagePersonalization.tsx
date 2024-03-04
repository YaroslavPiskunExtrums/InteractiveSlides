import { FC } from 'react'
import { PersonalizationSettingsType } from 'src/lib/types/personalizationConfig.types'
import './image-personalization.styles.scss'
import { css } from '@emotion/css'
import classNames from 'src/lib/util/classNames'

type ImagePersonalizationProps = {
  config: PersonalizationSettingsType
}

export const ImagePersonalization: FC<ImagePersonalizationProps> = ({ config }) => {
  const imageCss = css`
    border-radius: ${config.imageConfig.borderRadius}%;
  `

  return config.imageUrl ? (
    <img src={config.imageUrl} className={classNames('personalization-image', imageCss)} alt="" />
  ) : (
    <div className="personalization-add-file">
      <span>
        <svg
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 6.75H7.25V12H5.75V6.75H0.5V5.25H5.75V0H7.25V5.25H12.5V6.75Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span> Add image </span>
    </div>
  )
}
