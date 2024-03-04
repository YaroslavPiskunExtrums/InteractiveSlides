import { ReactNode, useState } from 'react'
import classes from './figureWrapper.module.scss'
import classNames from '@lib/utils/classNames'

interface IProps {
  children: ReactNode
  backgroundColor: string
  justifyContent?: string
  isHide: boolean
  backLink: string
}

const FigureWrapper = ({
  children,
  backgroundColor = '#fff',
  justifyContent = 'center',
  isHide,
  backLink = '',
}: IProps) => {
  const [isShowModal, setIsShowModal] = useState(false)
  return (
    <main style={{ backgroundColor, justifyContent }} className={classes.main}>
      <div
        className={classNames(classes.dropdown, isHide ? classes.hide : '')}
        onClick={() => {
          setIsShowModal((prev) => !prev)
        }}
      >
        <div className={classes.dropdownIcon}>
          <svg
            width="16"
            height="16"
            fill="currentColor"
            className={classes.biDotsVertical}
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </div>
        <div
          className={classNames(classes.dropdownMenu, isShowModal ? classes.openModalDropdown : '')}
        >
          <a className={classes.dropdownItem} href={backLink}>
            Back to edit
          </a>
        </div>
      </div>
      <div className={classes.content}>{children}</div>
    </main>
  )
}

export default FigureWrapper
