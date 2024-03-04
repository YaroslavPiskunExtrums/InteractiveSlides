import { Controller, useFormContext } from 'react-hook-form'
import { IForm, layouts, personalizationFigureType } from '../../right-menu.types'
import { capitalizeFirstLetter } from 'src/lib/util/capitalizeFirstLetter'
import { useEffect, useState } from 'react'
import './personalization.styles.scss'
import { fontFamilyList } from 'src/lib/constants/fontFamily'

export const PersonalizationEdit = () => {
  const { control, getValues } = useFormContext<IForm>()
  const [type, setType] = useState(getValues('type') || 'text')
  const [fileName, setFileName] = useState(getValues('fileName') || '')
  useEffect(() => {
    setType(getValues('type') ?? 'text')
    setFileName(getValues('fileName'))
  }, [getValues('type'), getValues('fileName')])
  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Select type</h5>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <select
              value={field.value || 'text'}
              onChange={(e) => {
                field.onChange(e)
                setType(e.target.value)
              }}
              className={'form-select d-block w-100'}
            >
              {Object.values(personalizationFigureType).map((figure, index) => {
                return (
                  <option key={index} value={figure}>
                    {capitalizeFirstLetter(figure)}
                  </option>
                )
              })}
            </select>
          )}
        />
      </div>
      {type === 'text' && (
        <>
          <div className={'right-menu_body_element-type mb-3'}>
            <h5>Text</h5>
            <Controller
              name="text"
              control={control}
              render={({ field: { value, onChange } }) => (
                <textarea className={'form-control'} value={value ?? ''} onChange={onChange} />
              )}
            />
          </div>
          <div className={'right-menu_body_element-type mb-3'}>
            <h5>Text style settings</h5>
            <div className={'right-menu_body_element-type flex-1 mb-2'}>
              <h6>Text align</h6>
              <Controller
                control={control}
                name="textConfig.layout"
                render={({ field }) => (
                  <select
                    value={field.value}
                    onChange={field.onChange}
                    className={'form-select d-block w-100'}
                  >
                    {Object.values(layouts).map((layout, index) => {
                      return (
                        <option key={index} value={layout}>
                          {capitalizeFirstLetter(layout)}
                        </option>
                      )
                    })}
                  </select>
                )}
              />
            </div>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                name="textConfig.textColor"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    onChange={onChange}
                    value={value ?? '#ffffff'}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Text color</h6>
            </div>
            <div className={'right-menu_body_element-type flex-1 mb-2 text-start'}>
              <h6>Font family</h6>
              <Controller
                name="textConfig.fontIndex"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <select value={value ?? '0'} onChange={onChange} className={'form-select'}>
                    {fontFamilyList.map(({ name, value }) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            <div className={'right-menu_body_element-type flex-1 mb-2'}>
              <h6>Text font size</h6>
              <Controller
                name="textConfig.fontSize"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    value={value ?? '22'}
                    onChange={onChange}
                    className={'form-control'}
                    type="number"
                  />
                )}
              />
            </div>
          </div>
        </>
      )}
      {type === 'image' && (
        <>
          <div className="right-menu_body_element-type mb-3">
            <div className="personalization-container-for-file">
              <input
                type="text"
                className="form-control personalization-input-file-name"
                value={fileName}
                readOnly
              />
              <label
                htmlFor="personalization-add-file"
                className="personalization-add-file-container"
              >
                <Controller
                  name="fileName"
                  control={control}
                  render={({ field: { onChange: onChangeFileName } }) => (
                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <input
                          type="file"
                          id="personalization-add-file"
                          className="personalization-file-input"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            let ImageType = /image.*/
                            if (!file?.type?.match(ImageType)) {
                              onChange('')
                              setFileName('')
                              onChangeFileName('')
                              return
                            }
                            let reader = new FileReader()
                            reader.onloadend = (event) => {
                              onChange((event.target?.result as string) ?? '')
                              setFileName(file.name)
                              onChangeFileName(file.name)
                            }
                            reader.readAsDataURL(file)
                          }}
                        />
                      )}
                    />
                  )}
                />

                <div className="personalization-icon-container">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 2V16H2V2H16ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM11.14 8.86L8.14 12.73L6 10.14L3 14H15L11.14 8.86Z"
                      fill="#484848"
                    />
                  </svg>
                </div>
              </label>
            </div>
          </div>
          <div className={'right-menu_body_element-type mb-3'}>
            <h5>Image style settings</h5>
            <div className={'right-menu_body_element-type flex-1 mb-2'}>
              <h6>Border radius</h6>
              <Controller
                name="imageConfig.borderRadius"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    value={value ?? '4'}
                    onChange={onChange}
                    className={'form-control'}
                    type="number"
                  />
                )}
              />
            </div>
          </div>
        </>
      )}
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Background Settings</h5>
        <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
          <Controller
            name="backgroundConfig.backgroundColor"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                value={value ?? '#ffffff'}
                onChange={onChange}
                className={'form-control'}
                type="color"
              />
            )}
          />
          <h6>Background Color</h6>
        </div>
      </div>
    </div>
  )
}
