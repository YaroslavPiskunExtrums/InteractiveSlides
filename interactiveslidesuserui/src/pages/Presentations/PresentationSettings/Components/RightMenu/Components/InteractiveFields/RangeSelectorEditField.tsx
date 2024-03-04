import { Button, Col, Row } from 'reactstrap'
import { IForm } from '../../right-menu.types'
import { Controller, useController, useFormContext } from 'react-hook-form'
import { fontFamilyList } from 'src/lib/constants/fontFamily'

const RangeSelectorEditField = () => {
  const { control, watch } = useFormContext<IForm>()

  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Question</h5>
        <Controller
          control={control}
          name="question"
          render={({ field: { value, onChange } }) => (
            <input value={value ?? ''} onChange={onChange} className={'form-control'} type="text" />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Subheading</h5>
        <Controller
          control={control}
          name="subheading"
          render={({ field: { value, onChange } }) => (
            <input value={value ?? ''} onChange={onChange} className={'form-control'} type="text" />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Label</h5>
        <Controller
          control={control}
          name="label"
          render={({ field: { value, onChange } }) => (
            <input className={'form-control'} value={value ?? ''} onChange={onChange} />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Question style settings</h5>
        <div className={'d-flex gap-2'}>
          <div className={'right-menu_body_element-type mb-3'}>
            <h6>Question font size</h6>
            <Controller
              control={control}
              name="questionConfig.fontSize"
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
        <h5>Range Selector Style Settings</h5>
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <select className={'form-control'} value={value ?? '0'} onChange={onChange}>
              <option value={'0'}>Range Selector Number</option>
              <option value={'1'}>Range Selected Option</option>
            </select>
          )}
        />
      </div>

      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Range Selector Settings</h5>
        {watch('type') === '1' ? <RangeOption /> : <RangeNumber />}
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Text Style Settings</h5>
        <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
          <Controller
            control={control}
            name="textConfig.textColor"
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
          <h6>Font size</h6>
          <Controller
            control={control}
            name="textConfig.fontSize"
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
      <div>
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
    </div>
  )
}

const RangeNumber = () => {
  const { control } = useFormContext<IForm>()
  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type d-flex gap-3 text-center mb-2'}>
        <Controller
          control={control}
          name="rangeConfig.0.min"
          render={({ field: { value, onChange } }) => (
            <input
              className={'flex-1 w-75'}
              value={value ?? 0}
              onChange={onChange}
              placeholder={'min'}
              type={'number'}
            />
          )}
        />
        <Controller
          control={control}
          name="rangeConfig.0.max"
          render={({ field: { value, onChange } }) => (
            <input
              className={'flex-1 w-75'}
              placeholder={'max'}
              value={value ?? 100}
              onChange={onChange}
              type={'number'}
            />
          )}
        />
        <Controller
          control={control}
          name="rangeConfig.0.step"
          render={({ field: { value, onChange } }) => (
            <input
              className={'flex-1 w-75'}
              placeholder={'step'}
              value={value ?? 1}
              onChange={onChange}
              type={'number'}
            />
          )}
        />
      </div>
      <div>
        <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
          <Controller
            control={control}
            name="rangeConfig.0.primaryColor"
            render={({ field: { value, onChange } }) => (
              <input
                value={value ?? '#000000'}
                onChange={onChange}
                className={'form-control'}
                type="color"
              />
            )}
          />
          <h6>Primary color</h6>
        </div>
      </div>
    </div>
  )
}

const RangeOption = () => {
  const { control, setValue, getValues } = useFormContext<IForm>()

  const { field } = useController({ control, name: 'rangeConfig.1.options' })

  const onAddOption = () => {
    const previouslyValues = getValues('rangeConfig.1.options') ?? []
    setValue('rangeConfig.1.options', [...previouslyValues, ''])
  }
  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type mb-3'}>
        <h6>Options</h6>

        {field.value?.map((_, index) => (
          <div key={index} className={'right-menu_body_element-type mb-3'}>
            <Controller
              control={control}
              name={`rangeConfig.1.options.${index}`}
              render={({ field: { value, onChange } }) => (
                <input
                  onChange={onChange}
                  value={value ?? ''}
                  className={'form-control'}
                  type="text"
                />
              )}
            />
          </div>
        ))}

        <Button onClick={onAddOption} className={'w-100 mb-3'}>
          Add option
        </Button>
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h6>Range Selector Style Settings</h6>

        <Row>
          <Col xs={6}>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                control={control}
                name="rangeConfig.1.primaryColor"
                render={({ field: { value, onChange } }) => (
                  <input
                    onChange={onChange}
                    value={value ?? '#000000'}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Primary color</h6>
            </div>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                control={control}
                name="rangeConfig.1.pointerBorderColor"
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Pointer border color</h6>
            </div>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                control={control}
                name="rangeConfig.1.optionTextConfig.checkedTextColor"
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Checked text color</h6>
            </div>
          </Col>
          <Col xs={6}>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                control={control}
                name="rangeConfig.1.pointerColor"
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    onChange={onChange}
                    className={'form-control'}
                    type="color"
                  />
                )}
              />
              <h6>Pointer color</h6>
            </div>
            <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
              <Controller
                control={control}
                name="rangeConfig.1.optionTextConfig.textColor"
                render={({ field: { value, onChange } }) => (
                  <input
                    value={value ?? '#000000'}
                    className={'form-control'}
                    type="color"
                    onChange={onChange}
                  />
                )}
              />
              <h6>Text color</h6>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default RangeSelectorEditField
