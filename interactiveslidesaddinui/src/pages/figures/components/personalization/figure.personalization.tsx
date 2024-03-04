import { IAddinFigure } from '@src/types/IAddinFigure'
import { FigurePersonalization } from '@src/types/figures-config.props'
import { useGlobalStore } from '@src/global-store'
import React, { useState } from 'react'
import { PresentationAPIClient } from '@src/lib/api/presentation-api'
import { debounce } from '@src/lib/utils/debounce'
import { css } from '@emotion/css'
import './figure.personalization.sass'
import { getBase64 } from '@src/lib/utils/get-input-base64'

export default function FigurePersonalization({ figure }: { figure: IAddinFigure }) {
  const readOnlyMode = (window as any).presentation.readonly

  const config: FigurePersonalization['config'] = figure.content_config
  const resolveFigure = useGlobalStore((state) => state.resolve)
  const figures = useGlobalStore((state) => state.figures)
  const session = React.useRef((window as any).presentation.session)
  const { setIsLoading, setError } = useGlobalStore()
  const [image, setImage] = useState<string>(config?.imageUrl || '')
  const [text, setText] = useState<string>(config?.text || '')

  const textAreaStyles = css`
    font-size: ${config.textConfig.fontSize}px;
    width: 100%;
    height: 100%;
    border: ${text ? 'none' : '1px dashed #000'};
    resize: vertical;
    color: ${config.textConfig.textColor};
    background-color: ${config.backgroundConfig.backgroundColor};
    text-align: ${config.textConfig.layout};
    display: block;
  `
  const onTextareaChange = async (e: React.ChangeEvent<HTMLTextAreaElement & HTMLElement>) => {
    try {
      setIsLoading(true)
      config.text = e.target.value
      setText(e.target.value)

      resolveFigure({ ...figure, content_config: config })

      await PresentationAPIClient.autoSaveFigure({
        sessionId: session.current,
        id: figure.id,
        value: e.target.value,
        fullName: null,
        email: null,
        phone: null,
        business: null,
        additionalFields: null,
        textMessage: null,
      })
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
  }
  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true)

      const file = e.target.files?.[0]
      const imageBase64 = await getBase64(file)
      config.imageUrl = imageBase64.toString()
      config.fileName = file?.name || ''
      setImage(imageBase64.toString())

      resolveFigure({ ...figure, content_config: config })

      await PresentationAPIClient.autoSaveFigure({
        sessionId: session.current,
        id: figure.id,
        value: imageBase64.toString(),
        fullName: null,
        email: null,
        phone: null,
        business: null,
        additionalFields: null,
        textMessage: null,
      })
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
  }

  const renderPersonalizationType = (type: FigurePersonalization['config']['type']) => {
    switch (type) {
      case 'text':
        return (
          <div className={'figure-personalization_personalization --text'}>
            <textarea
              readOnly={readOnlyMode}
              className={textAreaStyles}
              placeholder={text ? '' : 'Type your text'}
              defaultValue={text}
              onChange={debounce(!readOnlyMode && onTextareaChange, 700)}
            ></textarea>
          </div>
        )
      case 'image':
        return (
          <div className={'figure-personalization_personalization --image'}>
            {image ? (
              <label className={'figure-personalization_personalization_image-upload'}>
                {!readOnlyMode && (
                  <input style={{ display: 'none' }} type={'file'} onChange={onImageChange} />
                )}
                <img
                  style={{ borderRadius: `${config?.imageConfig?.borderRadius}px` }}
                  src={image}
                  alt={'personalization-image'}
                />
              </label>
            ) : (
              <label className={'figure-personalization_personalization_image-upload --empty'}>
                {!readOnlyMode && (
                  <input
                    style={{
                      display: 'none',
                      borderRadius: `${config?.imageConfig?.borderRadius}`,
                    }}
                    type={'file'}
                    onChange={onImageChange}
                  />
                )}
                <svg
                  className={'plus-icon'}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M13 11V7a1 1 0 0 0-2 0v4H7a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0v-4h4a1 1 0 0 0 0-2h-4z" />
                </svg>
                <div className={'placeholder'}>Upload Image</div>
              </label>
            )}
          </div>
        )
    }
  }

  return <div className={'figure-personalization'}>{renderPersonalizationType(config.type)}</div>
}
