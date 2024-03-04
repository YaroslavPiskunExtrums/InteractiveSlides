import { Controller, useFormContext } from 'react-hook-form'
import { IForm } from '../../right-menu.types'
import { fontFamilyList } from 'src/lib/constants/fontFamily'

const CalculatorEditField = () => {
  const { control } = useFormContext<IForm>()
  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Calculator title</h5>
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
        <h5>Equation</h5>
        <Controller
          control={control}
          name="equation"
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
            <input value={value ?? ''} onChange={onChange} className={'form-control'} type="text" />
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
        <h5>Input style settings</h5>
        <div className={'d-flex gap-2'}>
          <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
            <Controller
              control={control}
              name="inputConfig.backColor"
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
              control={control}
              name="inputConfig.borderColor"
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
              control={control}
              name="inputConfig.textColor"
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
        </div>
        <div className={'right-menu_body_element-type mb-2'}>
          <h6>Border radius</h6>
          <Controller
            control={control}
            name="inputConfig.borderRadius"
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
        <div className={'right-menu_body_element-type mb-3'}>
          <h6>Text font size</h6>
          <Controller
            control={control}
            name="inputConfig.fontSize"
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

export default CalculatorEditField
