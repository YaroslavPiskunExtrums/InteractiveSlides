import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import './more-menu.styles.scss'
import { css } from '@emotion/css'
import MoreMenuItem, { MoreMenuItemProps } from 'src/Components/Common/MoreMenu/MoreMenuItem'


type MoreMenuProps = {
  children?: ReactElement<MoreMenuItemProps> | Array<ReactElement<MoreMenuItemProps>>,
  size?: string,
  minContentWidth?: string,
  className?: string
}

const MoreMenu = ({ size, className, children, minContentWidth }: MoreMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const contentRef = useRef<HTMLDivElement>()
  const containerRef = useRef<HTMLDivElement>()
  const triggerRef = useRef<HTMLDivElement>()


  useEffect(() => {
    const closeMenuOutside = () => {
      setIsOpen(false)
    }

    window.addEventListener('click', closeMenuOutside)

    return () => {
      window.removeEventListener('click', closeMenuOutside)
    }

  }, [])


  const styles = {
    more_menu_icon: css`
      width: ${size};
      height: ${size};
      font-size: ${size};
    `,
    more_menu_content: css`
      display: ${isOpen ? 'block' : 'none'};
      top: calc(${size} + 0.75rem);
      min-width: ${minContentWidth};
    `,
  }


  return (
    <div ref={containerRef} className={`more-menu ${className}`}>
      <div ref={triggerRef} onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(!isOpen)
      }} className={`more-menu_icon ${styles.more_menu_icon}`}>
        <i className={'ri-more-2-line'}></i>
        {/*{isOpen.toString()}*/}
      </div>
      <div ref={contentRef} className={`more-menu_content ${styles.more_menu_content}`}>
        {children}
      </div>
    </div>
  )
}

export default MoreMenu