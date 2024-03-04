interface IProps {
  defaultValue: string
  onChange: () => void
}

const ColorInput = (props: IProps) => {
  return (
    <input
      onChange={props.onChange}
      defaultValue={props.defaultValue || '#ffffff'}
      type={'color'}
      style={{ height: '20px', padding: '5px' }}
      className={'form-control-color w-100'}
    />
  )
}

export default ColorInput
