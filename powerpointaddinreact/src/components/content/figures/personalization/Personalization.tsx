import { PersonalizationSettingsType } from '@/types/figures/personalization.types'
import PlusSvg from '@assets/PlusSvg'
import { personalizationFigureType } from '@lib/constants/figures.constants'
import { getFontFamily } from '@lib/utils/getFontFamily'
import { CSSProperties, ChangeEvent, useRef, useState } from 'react'
import classes from './personalization.module.scss'

interface IProps {
  config: PersonalizationSettingsType
}

const Personalization = ({ config }: IProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [newImage, setNewImage] = useState('')

  const handleImage = (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files?.[0]
    if (!file) return
    const ImageType = /image.*/
    if (file.type.match(ImageType)) {
      const reader = new FileReader()
      reader.onloadend = (event) => {
        setNewImage((event.target?.result as string) ?? '')
      }
      reader.readAsDataURL(file)
    } else {
      setNewImage('')
    }
  }

  const [textArea, setTextArea] = useState(config.text ?? '')

  return (
    <div
      className="w-full h-full"
      style={
        {
          '--fontFamily': getFontFamily(config.textConfig.fontIndex),
          '--fontSize': config.textConfig.fontSize,
          '--fontColor': config.textConfig.textColor,
          '--layout': config.textConfig.layout,
          '--borderRadius': config.imageConfig.borderRadius,
        } as CSSProperties
      }
    >
      {config.type === personalizationFigureType.text ? (
        <textarea
          value={textArea}
          className={classes.personalizationTextarea}
          placeholder="Type your text"
          ref={textAreaRef}
          onChange={(e) => {
            setTextArea(e.target.value)
          }}
          onFocus={() => {
            if (!textAreaRef.current) return
            console.log('focus')
            textAreaRef.current.style.border = '1px dashed #495057'
          }}
          onBlur={() => {
            if (!textAreaRef.current) return

            if (textAreaRef.current.value !== '') {
              console.log('blur')
              textAreaRef.current.style.border = 'none'
            }
          }}
        />
      ) : (
        <label htmlFor="add-file-to-presentation" className={classes.fileContainer}>
          <input
            type="file"
            id="add-file-to-presentation"
            className={classes.fileInput}
            onChange={handleImage}
          />
          {newImage || config.imageUrl ? (
            <img
              src={newImage ? newImage : config.imageUrl}
              className={classes.personalizationImage}
              alt=""
            />
          ) : (
            <div className={classes.addFileBtn}>
              <PlusSvg />
              <span className="block my-5"> Add image </span>
            </div>
          )}
        </label>
      )}
    </div>
  )
}

export default Personalization
