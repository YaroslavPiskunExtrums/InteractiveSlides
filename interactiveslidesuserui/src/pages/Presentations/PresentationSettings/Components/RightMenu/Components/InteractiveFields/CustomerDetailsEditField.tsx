import { Button } from 'reactstrap'
import { Controller, useController, useFormContext } from 'react-hook-form'
import { IForm } from '../../right-menu.types'

const CustomerDetailsEditField = () => {
  const { control, getValues, setValue } = useFormContext<IForm>()

  const { field } = useController({ control, name: 'additionalFields' })

  const onAddField = () => {
    setValue('additionalFields', [
      ...(getValues('additionalFields') ? getValues('additionalFields') : []),
      '',
    ])
  }
  const onRemoveField = () => {
    const answersArray = getValues('additionalFields')
    answersArray.length -= 1
    setValue('additionalFields', answersArray)
  }

  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Full name</h5>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange } }) => (
            <input value={value ?? ''} onChange={onChange} className={'form-control'} type="text" />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Email</h5>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <input value={value ?? ''} onChange={onChange} className={'form-control'} type="text" />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Phone number</h5>
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <input value={value ?? ''} onChange={onChange} className={'form-control'} type="text" />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Business</h5>
        <Controller
          control={control}
          name="business"
          render={({ field: { value, onChange } }) => (
            <select value={value} onChange={onChange} className={'form-select'}>
              <option value="Architecture">Architecture</option>
              <option value="Engineering">Engineering</option>
            </select>
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Custom text message</h5>
        <Controller
          control={control}
          name="textMessage"
          render={({ field: { value, onChange } }) => (
            <textarea value={value ?? ''} onChange={onChange} className={'form-control'} />
          )}
        />
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Additional fields</h5>

        {field.value?.map((_, ind) => (
          <div key={ind} className={'right-menu_body_element-type mb-3'}>
            <Controller
              control={control}
              name={`additionalFields.${ind}`}
              render={({ field: { value, onChange } }) => (
                <input
                  value={value ?? ''}
                  onChange={onChange}
                  className={'form-control'}
                  type="text"
                />
              )}
            />
          </div>
        ))}
      </div>

      <Button onClick={onAddField} className={'w-100 mb-1'}>
        Add field
      </Button>
      <Button color={'danger'} onClick={onRemoveField} className={'w-100 mb-3'}>
        Remove field
      </Button>

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
        <h5>Form Style Settings</h5>
        <div className={'d-flex gap-2'}>
          <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
            <Controller
              control={control}
              name="formConfig.backColor"
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
              name="formConfig.borderColor"
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
        </div>
        <div className={'right-menu_body_element-type mb-2'}>
          <h6>Border radius</h6>
          <Controller
            control={control}
            name="formConfig.borderRadius"
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

export default CustomerDetailsEditField
