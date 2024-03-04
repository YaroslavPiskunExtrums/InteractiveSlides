import { FC, MouseEvent } from 'react'
import './notes-icon.sass'
import FileSVG from '@src/pages/notes/components/assets/file'

interface IProps {
  buttonColor: string
  onClick: (e: MouseEvent<HTMLDivElement>) => void
}

const NotesIcon: FC<IProps> = (props) => {
  return (
    <div className={'icon-wrapper'} style={{ color: props.buttonColor }} onClick={props.onClick}>
      <FileSVG />
    </div>
  )
}

export default NotesIcon
