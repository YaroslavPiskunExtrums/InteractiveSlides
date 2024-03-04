import PlusSvg from '@assets/PlusSvg'
import { MouseEvent } from 'react'
import classes from './settingBtn.module.scss'
import classNames from '@lib/utils/classNames'

interface IProps {
  btnTitle: string
  isShowIcon?: boolean
  clickHandler: (e: MouseEvent<HTMLButtonElement>) => void
  isAddItem?: boolean
}

const SettingBtn = ({ btnTitle, clickHandler, isShowIcon = false, isAddItem = false }: IProps) => {
  return (
    <button
      onClick={clickHandler}
      className={classNames(classes.btn, isAddItem ? classes.addBtn : classes.moveBtn)}
    >
      {isShowIcon ? <PlusSvg /> : <></>}
      <span>{btnTitle}</span>
    </button>
  )
}
export default SettingBtn
