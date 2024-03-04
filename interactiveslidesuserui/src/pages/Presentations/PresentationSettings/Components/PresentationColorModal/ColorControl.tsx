import ColorInput from './ColorInput'

interface IProps {
  defaultValue: string
  onChange: () => void
  controlName: string
}

const ColorControl = (props: IProps) => {
  return (
    <div className={'color-setting-item'}>
      <div className={'text-center'} style={{ fontSize: '12px' }}>
        {props.controlName}
      </div>
      <ColorInput defaultValue={props.defaultValue} onChange={props.onChange} />
    </div>
  )
}

export default ColorControl
