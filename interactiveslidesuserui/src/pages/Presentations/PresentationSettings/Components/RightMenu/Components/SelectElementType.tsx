import { Control, Controller } from 'react-hook-form'
import { figuresUserNames } from 'src/helpers/interactive-elements'
import { IElementTypeForm } from '../right-menu.types'

interface IProps {
  elementTypeControl: Control<IElementTypeForm, any>
}
const SelectElementType = ({ elementTypeControl }: IProps) => {
  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <h5>Select element type</h5>
      <Controller
        control={elementTypeControl}
        name="elementType"
        render={({ field }) => (
          <select
            value={field.value}
            onChange={field.onChange}
            className={'form-select d-block w-100'}
          >
            {figuresUserNames.map((figure, index) => {
              return (
                <option key={index} value={figure.name}>
                  {figure.label}
                </option>
              )
            })}
          </select>
        )}
      />
    </div>
  )
}
export default SelectElementType
