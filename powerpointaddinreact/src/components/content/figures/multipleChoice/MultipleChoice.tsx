import { AnswerType } from '@/types/figures/figures.types'
import { MultipleChoiceSettingsType } from '@/types/figures/multipleChoice.types'
import CheckMarkSvg from '@assets/CheckMarkSvg'
import { views } from '@lib/constants/figures.constants'
import classNames from '@lib/utils/classNames'
import { getFontFamily } from '@lib/utils/getFontFamily'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import classes from './multipleChoice.module.scss'
interface IProps {
  config: MultipleChoiceSettingsType
}

const MultipleChoice = ({ config }: IProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>(
    config?.answers?.[0]?.label ?? config?.answers?.[0] ?? ''
  )

  const onToggleOpenedStatus = () => {
    if (config.view === views.multipleSelector && isOpenDropdown) {
      return
    }
    setIsOpenDropdown((prev) => !prev)
  }

  const closeDropdownFromOutside = (e: Event) => {
    const el = dropdownRef?.current
    if (!el || el.contains(e.target as Node)) {
      return
    }
    setIsOpenDropdown(false)
  }
  useEffect(() => {
    const body = document?.body
    if (!body) return
    body.addEventListener('click', closeDropdownFromOutside)
    return () => body.removeEventListener('click', closeDropdownFromOutside)
  }, [])

  const onSelected = (answer: AnswerType, index: number) => {
    if (config.view === views.dropdownList) {
      setSelectedAnswer(() => answer.label)
      return
    } else if (config.view === views.multipleSelector) {
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers((prev) => prev.filter((ind) => ind !== index))
        return
      }
      setSelectedAnswers((prev) => [...prev, index])
    }
  }

  return (
    <div
      style={
        {
          '--textConfigTextColor': config.textConfig.textColor,
          '--fontFamily': getFontFamily(config.textConfig.fontIndex),
          '--textConfigFontSize': config.textConfig.fontSize,
          '--questionConfigFontSize': config.questionConfig.fontSize,
          '--btnBackgroundColor': config.btnConfig.backColor,
          '--btnBorderColor': config.btnConfig.borderColor,
          '--btnTextColor': config.btnConfig.textColor,
          '--btnBorderRadius': config.btnConfig.borderRadius,
          '--btnHoverColor': config.btnConfig.hoverColor,
          '--btnHoverBorderColor': config.btnConfig.hoverBorderColor,
          '--btnHoverTextColor': config.btnConfig.hoverTextColor,
          '--dropdownBackgroundColor': config.dropdownConfig.backgroundColor,
          '--dropdownBorderColor': config.dropdownConfig.borderColor,
          '--dropdownBorderRadius': config.dropdownConfig.borderRadius,
          '--dropdownFontColor': config.dropdownConfig.fontColor,
          '--dropdownHoverColor': config.dropdownConfig.hoverColor,
          '--dropdownHoverTextColor': config.dropdownConfig.hoverTextColor,
        } as CSSProperties
      }
    >
      {config.imageUrl && (
        <div className="text-center">
          <img
            className="max-w-[400px] w-full max-h-[200px] h-full"
            src={config.imageUrl ?? ''}
            alt="user_img"
          />
        </div>
      )}
      <h2 className={classNames('mt-2 text-center', classes.multipleChoiceQuestion)}>
        {config.question}
      </h2>
      <div className={classes.alignCenterHorizon}>
        {config.view === views.buttonList ? (
          config.answers.map((item, index) => (
            <button
              key={index}
              className={classNames(classes.btn, 'mx-1', classes.multipleChoiceBtn)}
            >
              {item.label}
            </button>
          ))
        ) : (
          <div
            ref={dropdownRef}
            className={classNames(classes.dropdown)}
            onClick={onToggleOpenedStatus}
          >
            <input
              type="text"
              className={classes.multipleChoiceAnswer}
              value={
                config.view === views.dropdownList
                  ? selectedAnswer
                  : config.view === views.multipleSelector
                    ? `Selected ${selectedAnswers.length} item${
                        selectedAnswers.length > 1 ? 's' : ''
                      }`
                    : ''
              }
              readOnly
            />
            <div
              className={classNames(
                classes.multipleChoiceOptions,
                isOpenDropdown ? 'opacity-100 visible z-10 translate-y-0 top-0 left-0' : ''
              )}
            >
              {config.answers.map((answer, index) => (
                <div
                  key={index}
                  className={classes.multipleChoiceOption}
                  onClick={() => onSelected(answer, index)}
                >
                  <div className={classes.optionItem}>
                    <span className={classes.optionText}>{answer?.label ?? answer}</span>
                    {selectedAnswers.includes(index) && (
                      <span
                        className={classes.selectedMark}
                        style={{ marginRight: `${config.textConfig.fontSize || 20}px` }}
                      >
                        <CheckMarkSvg
                          height={config.textConfig.fontSize}
                          width={config.textConfig.fontSize}
                        />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MultipleChoice
