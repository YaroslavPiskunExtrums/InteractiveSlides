import { Control, Controller } from 'react-hook-form'

type InputType = {
  control: Control<any, any>
  name: string
  placeholder: string
  label: string
}

const Input = (props: InputType) => {
  return (
    <div className="mt-2">
      <label htmlFor={props.name} className="form-label">
        {props.label}
      </label>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field: { value, onChange } }) => (
          <input
            onChange={onChange}
            value={value ?? ''}
            name={props.name}
            className="form-control"
            placeholder={props.placeholder}
          />
        )}
      />
    </div>
  )
}

export default Input
