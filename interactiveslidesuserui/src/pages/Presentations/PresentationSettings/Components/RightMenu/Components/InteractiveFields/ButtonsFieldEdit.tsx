import { Controller, useFormContext } from 'react-hook-form'
import { Col, Row } from 'reactstrap'
import { IForm } from '../../right-menu.types'
import { useEffect, useState } from 'react'

const ButtonsFieldEdit = () => {
  const {
    control,
    formState: { defaultValues },
    getValues,
    setValue,
  } = useFormContext<IForm>()

  const [isLink, setIsLink] = useState(
    Boolean(defaultValues?.btnConfig?.linkType && defaultValues?.btnConfig?.link)
  )

  useEffect(() => {
    if (!isLink) {
      setValue('btnConfig.linkType', undefined)
      setValue('btnConfig.link', undefined)
    } else {
      setValue('btnConfig.linkType', defaultValues?.btnConfig?.linkType)
      setValue('btnConfig.link', defaultValues?.btnConfig?.link)
    }
  }, [isLink])

  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Button Text</h5>
        <Controller
          name={'btnText'}
          control={control}
          render={({ field: { value, onChange } }) => (
            <input className={'form-control'} value={value ?? ''} onChange={onChange} />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Label</h5>
        <Controller
          name={'label'}
          control={control}
          render={({ field: { value, onChange } }) => (
            <input className={'form-control'} value={value ?? ''} onChange={onChange} />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <label htmlFor="checkbox_link" style={{ display: 'inline-flex', gap: '10px' }}>
          <input
            id="checkbox_link"
            type="checkbox"
            onChange={(e) => setIsLink((prev) => !prev)}
            checked={isLink}
          />
          Is link
        </label>
      </div>
      {isLink && (
        <>
          <div className={'right-menu_body_element-type mb-3'}>
            <h5>Select type of link</h5>
            <Controller
              control={control}
              name="btnConfig.linkType"
              render={({ field }) => (
                <select className={'form-control'} value={field.value ?? 'slide_link'} onChange={field.onChange}>
                  <option value={'slide_link'}>Slide link</option>
                  <option value={'hyperlink'}>Hyperlink</option>
                </select>
              )}
            />
          </div>
          <div className={'right-menu_body_element-type mb-3'}>
            <h5>
              {getValues('btnConfig.linkType') === 'hyperlink'
                ? 'Hyperlink url'
                : 'Link to the slide'}
            </h5>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                name="btnConfig.link"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? undefined}
                    onChange={onChange}
                    className={'form-control'}
                  />
                )}
              />
            </div>
          </div>
        </>
      )}
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Button Config</h5>
        <Row className={'mb-2'}>
          <Col xs={6}>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                name="btnConfig.backColor"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Background color</h6>
            </div>
            <div className={'right-menu_body_element-type  flex-1 text-center mb-2'}>
              <Controller
                name="btnConfig.borderColor"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Border color</h6>
            </div>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                name="btnConfig.textColor"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Text color</h6>
            </div>
          </Col>
          <Col xs={6}>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                name="btnConfig.hoverColor"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Hover color</h6>
            </div>
            <div className={'right-menu_body_element-type  flex-1 text-center mb-2'}>
              <Controller
                control={control}
                name="btnConfig.hoverBorderColor"
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Hover border color</h6>
            </div>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                control={control}
                name="btnConfig.hoverTextColor"
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Hover text color</h6>
            </div>
          </Col>
        </Row>
        <div className={'right-menu_body_element-type mb-2'}>
          <h6>Font size</h6>
          <Controller
            control={control}
            name="btnConfig.fontSize"
            render={({ field: { value, onChange } }) => (
              <input
                value={value ?? ''}
                onChange={onChange}
                className={'form-control'}
                type="number"
              />
            )}
          />
        </div>
        <div className={'right-menu_body_element-type mb-2'}>
          <h6>Border radius</h6>
          <Controller
            control={control}
            name="btnConfig.borderRadius"
            render={({ field: { value, onChange } }) => (
              <input
                value={value ?? ''}
                onChange={onChange}
                className={'form-control'}
                type="number"
              />
            )}
          />
        </div>
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Background Settings</h5>
        <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
          <Controller
            control={control}
            name="backgroundConfig.backgroundColor"
            render={({ field: { value, onChange } }) => (
              <input
                value={value ?? '#000000'}
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

export default ButtonsFieldEdit
