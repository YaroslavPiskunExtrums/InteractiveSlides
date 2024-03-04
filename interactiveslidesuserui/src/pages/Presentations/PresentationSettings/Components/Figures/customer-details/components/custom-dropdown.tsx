import './custom-dropdown.sass'
import { css } from '@emotion/css'
import { MouseEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import { useDropdown } from 'src/lib/hooks/useDropdown'
import { useDebounce } from 'src/lib/hooks/useDebounce'
import { MultipleChoiceType } from 'src/helpers/interactive-elements'
import index from 'src/pages/Email/EmailTemplates/BasicAction'

interface IProps {
  options: { id: number; value: string }[]
  onChange: (e: MouseEvent<HTMLButtonElement>) => void
  selectedIndex: number
  fontSize?: string
  background?: string
  isSearch?: boolean
  width?: string
  searchPlaceholder?: string
  optionFontSize?: string
  dropdownFontColor?: string
  dropdownBorderRadius?: string
  dropdownHoverColor?: string
  dropdownBorderColor?: string
  dropdownHoverTextColor?: string
  view?: MultipleChoiceType
}

const CustomDropdown = ({
  onChange,
  options = [],
  selectedIndex = 0,
  fontSize = '16',
  background = 'white',
  isSearch = false,
  width = '50',
  searchPlaceholder = '',
  optionFontSize = fontSize,
  dropdownFontColor = '#000000',
  dropdownBorderColor,
  dropdownBorderRadius,
  dropdownHoverColor,
  dropdownHoverTextColor,
  view,
}: IProps) => {
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

    dropdownFontColor: css`
      color: ${dropdownFontColor};
    `,
    input: css`
      padding: ${fontSize}px 10px;
      font-size: ${fontSize}px;
    `,
    options: css`
      font-size: ${optionFontSize}px;
    `,
    background: css`
      background: ${background};
    `,
    size: css`
      width: ${width}%;
      height: ${+fontSize * 2}px;
    `,
    selected: css`
      background: rgba(236, 82, 47, 1);
      color: white;
    `,
    icon: css`
      cursor: pointer;
      height: ${+fontSize * 2}px;
      width: ${+fontSize * 2}px;
    `,
    position: css`
      top: ${+fontSize * 2 + 2}px;
    `,
    rotate: css`
      transform: rotate(180deg);
    `,
    dropdownBack: css`
      background: transparent;
    `,
  }

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)

  const [searchValue, setSearchValue] = useState('')
  const [isOpen, toggleDropdown] = useDropdown(dropdownRef, searchRef)
  const debounceSearchValue = useDebounce(searchValue, 200)

  const focusInputHandler = (ref: MutableRefObject<HTMLInputElement>) => {
    if (searchInputRef?.current && isOpen && isSearch) {
      ref?.current.focus()
    }
  }

  useEffect(() => {
    focusInputHandler(searchInputRef)
  }, [isOpen])

  const [selectedItems, setSelectedItems] = useState([])

  const onChangeSelectedItems = (index: number) => {
    setSelectedItems((prev) => {
      return prev.includes(index) ? prev.filter((ind) => ind !== index) : [...prev, index]
    })
  }

  const value =
    view === MultipleChoiceType.multipleSelector
      ? `Selected ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}`
      : options.find((opt) => +opt?.id === +selectedIndex)?.value || options[0]?.value

  return (
    <div
      className={`dropdown ${cssRules.size} ${cssRules.dropdownBack} ${isOpen && 'open'}`}
      onClick={toggleDropdown}
      ref={dropdownRef}
    >
      <input
        readOnly
        type="text"
        className={`input ${cssRules.input} ${cssRules.background} ${cssRules.dropdownFontColor} ${
          dropdownBorderRadius && dropdownBorderColor && cssRules.dropdownBorder
        }`}
        value={value}
      />
      <i
        className={`ri-arrow-up-s-line position-absolute end-0 ${cssRules.icon} ${
          !isOpen && cssRules.rotate
        } ${cssRules.dropdownFontColor}`}
      />
      <div
        className={`options ${cssRules.options} ${cssRules.background} ${!isSearch && 'pt-1'} ${
          cssRules.position
        } ${dropdownBorderRadius && dropdownBorderColor && cssRules.dropdownBorder} `}
      >
        {isSearch && (
          <div
            className="d-flex align-items-center position-sticky top-0 search pb-1 pt-1 border-bottom border-1"
            ref={searchRef}
          >
            <i className="ri-search-line ms-2" onClick={(e) => focusInputHandler(searchInputRef)} />
            <input
              className="w-100 ps-2 border border-0"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              ref={searchInputRef}
            />
          </div>
        )}
        {options.length ? (
          options
            .filter((item) => {
              if (debounceSearchValue.length) {
                return item.value.toLowerCase().startsWith(debounceSearchValue.toLowerCase())
              }
              return true
            })
            .map((opt, ind) => (
              <button
                key={opt.id}
                className={`dropdown-option ${cssRules.options} ${cssRules.background} ${
                  opt.id === selectedIndex && cssRules.selected
                } ${cssRules.dropdownFontColor} ${
                  dropdownHoverColor && dropdownHoverTextColor && cssRules.dropdownHoverColor
                }`}
                onClick={
                  view === MultipleChoiceType.multipleSelector
                    ? () => onChangeSelectedItems(ind)
                    : onChange
                }
                value={opt.id}
              >
                <span className="option-text">
                  {opt.value.length > 30 ? opt.value.substring(0, 30) + '...' : opt.value}
                </span>
                {selectedItems.includes(ind) && (
                  <i className=" ri-check-line option-selected-mark" />
                )}
              </button>
            ))
        ) : (
          <div className={`no-results ${cssRules.options} ${cssRules.background}`}>
            No results found
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomDropdown
