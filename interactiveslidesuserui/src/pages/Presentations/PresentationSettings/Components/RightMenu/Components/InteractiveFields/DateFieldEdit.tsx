import { Controller, useFormContext } from 'react-hook-form'
import { IForm } from '../../right-menu.types'
import { fontFamilyList } from 'src/lib/constants/fontFamily'

const OpenFieldEdit = () => {
  const { control } = useFormContext<IForm>()

  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Question</h5>
        <Controller
          name={'question'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <input value={value ?? ''} onChange={onChange} className={'form-control'} type="text" />
          )}
        />
      </div>

      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Label</h5>
        <Controller
          name={'label'}
          control={control}
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
              name={'questionConfig.fontSize'}
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
              name={'inputConfig.backColor'}
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
              name={'inputConfig.borderColor'}
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
              name={'inputConfig.textColor'}
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
        </div>

        <div className={'right-menu_body_element-type mb-2'}>
          <h6>Border radius</h6>
          <Controller
            name={'inputConfig.borderRadius'}
            control={control}
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
            name={'inputConfig.fontSize'}
            control={control}
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
            name={'textConfig.textColor'}
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
              name={'backgroundConfig.backgroundColor'}
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
            <h6>Background Color</h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenFieldEdit
