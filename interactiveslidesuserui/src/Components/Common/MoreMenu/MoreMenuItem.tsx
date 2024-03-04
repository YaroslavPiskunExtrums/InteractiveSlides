import './more-menu.styles.scss'

export type MoreMenuItemProps = {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  icon?: string
  disabled?: boolean
}


const MoreMenuItem = ({ children, className, onClick, icon, disabled }: MoreMenuItemProps) => {
  return (
    <div onClick={!disabled && onClick} className={`more-menu_item ${className}`}>
      <div>
        <i className={`more-menu_item_icon ${icon}`}></i>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default MoreMenuItem