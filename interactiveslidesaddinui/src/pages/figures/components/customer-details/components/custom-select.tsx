import { FC, MouseEvent, useEffect, useRef, useState } from 'react'
import './custom-dropdown.sass'
import { css } from '@emotion/css'
import { useDropdown } from '@src/lib/hooks/useDropdown'
import { createPortal } from 'react-dom'

const REM = 16

interface IProps {
  options: { id: string; value: string }[]
  onChange: (index: number) => Promise<void>
  selectedIndex: number
  fontSize?: string
  background?: string
  dropdownFontColor?: string
  dropdownBorderRadius?: string
  dropdownHoverColor?: string
  dropdownBorderColor?: string
  dropdownHoverTextColor?: string
  view?: 'button-list' | 'dropdown-list' | 'multiple-selector'
  selectedItems?: number[]
}

const CustomSelect: FC<IProps> = ({
  onChange,
  options,
  fontSize = '16',
  background = '#ffffff',
  selectedIndex = 0,
  dropdownFontColor = '#000000',
  dropdownBorderColor,
  dropdownBorderRadius,
  dropdownHoverColor,
  dropdownHoverTextColor,
  selectedItems,
  view,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownWindowRef = useRef<HTMLDivElement>(null)
  const [isOpen, toggleDropdown] = useDropdown(
    dropdownRef,
    null,
    dropdownWindowRef,
    view !== 'multiple-selector'
  )

  const cssRules = {
    dropdownBorder: css`
      border: 1px solid ${dropdownBorderColor};
      border-radius: ${dropdownBorderRadius}px;
    `,
    dropdownHoverColor: css`
      &:hover {
        background: ${dropdownHoverColor} !important;
        color: ${dropdownHoverTextColor} !important;
      }
    `,
    dropdownBack: css`
      background: transparent;
    `,
    dropdownFontColor: css`
      color: ${dropdownFontColor};
    `,
    value: css`
      font-size: ${fontSize}px;
    `,
    options: css`
      font-size: ${fontSize}px;
    `,
    background: css`
      background: ${background};
    `,
    size: css`
      min-height: ${fontSize}px;
    `,
    icon_position: css`
      top: 5px;
      right: 8px;
      width: ${fontSize}px;
      height: ${fontSize}px;
    `,
    rotate: css`
      transform: rotate(180deg);
    `,
  }

  const optionHandler = (e: MouseEvent<HTMLButtonElement>) => {
    onChange(+e.currentTarget.value)
  }

  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [width, setWidth] = useState(0)

  const observe = () => {
    const observer = new IntersectionObserver(changeDropdownPosition)

    observer.observe(dropdownRef.current)
  }

  const changeDropdownPosition = () => {
    //TODO rid of timeout animation
    setTimeout(() => {
      if (!dropdownRef?.current || !dropdownWindowRef?.current) return
      const coordinates = dropdownRef.current.getBoundingClientRect()
      const dropdownHeight = dropdownWindowRef.current.clientHeight
      setTop(
        window.innerHeight < coordinates.top + dropdownHeight
          ? coordinates.top - dropdownHeight + +fontSize + REM
          : coordinates.top
      )
      setLeft(coordinates.left)
      setWidth(coordinates.width)
    }, 500)
  }

  useEffect(() => {
    if (!window) return

    //@ts-ignore
    window.Reveal.on('overviewhidden', (event) => {
      observe()
    })
    //@ts-ignore
    window.Reveal.on('overviewshown', (event) => {
      observe()
    })
  }, [])

  useEffect(() => {
    if (!window) return

    observe()
    window.addEventListener('resize', observe)

    return () => {
      window.removeEventListener('resize', observe)
    }
  }, [dropdownRef?.current, dropdownRef])

  const value =
    view === 'multiple-selector'
      ? `Selected ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}`
      : options.find((opt) => opt.id === selectedIndex.toString())?.value

  return (
    <div className={`dropdown ${cssRules.dropdownBack}`} onClick={toggleDropdown} ref={dropdownRef}>
      <div
        className={`dropdown_value ${cssRules.value} ${cssRules.background} ${cssRules.size} ${
          cssRules.dropdownFontColor
        } ${dropdownBorderRadius && dropdownBorderColor && cssRules.dropdownBorder}`}
      >
        {value ? value : ''}
      </div>
      <div
        className={`dropdown_icon ${!isOpen && cssRules.rotate} ${cssRules.icon_position} ${
          cssRules.dropdownFontColor
        } `}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {createPortal(
        <div
          className={`options ${isOpen ? 'open' : ''} ${cssRules.options} ${cssRules.background} ${
            dropdownBorderRadius && dropdownBorderColor && cssRules.dropdownBorder
          }`}
          style={{ top, left, width }}
          ref={dropdownWindowRef}
        >
          {options.map((opt, ind) => (
            <button
              key={opt.id}
              className={`option ${cssRules.options} ${cssRules.background} ${
                cssRules.dropdownFontColor
              } ${dropdownHoverColor && dropdownHoverTextColor && cssRules.dropdownHoverColor}`}
              onClick={optionHandler}
              value={opt.id}
            >
              <span className="option-text">{opt.value}</span>
              {selectedItems.includes(ind) && (
                <span className="option-selected-mark">
                  <svg
                    id="copy-to-clipboard-copied-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

export default CustomSelect
