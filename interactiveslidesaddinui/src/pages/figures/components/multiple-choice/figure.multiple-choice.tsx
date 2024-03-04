import { useRef, useState } from 'react'
import './figure.multiple-choice.sass'
import { FigureMultipleChoiceProps } from '@src/types/figures-config.props'
import { IAddinFigure } from '@src/types/IAddinFigure'
import { useGlobalStore } from '@src/global-store'
import ActivatedButton, {
  goToAnchor,
} from '@src/pages/figures/components/button/components/activated-button'
import { PresentationAPIClient } from '@src/lib/api/presentation-api'
import { H3_DEFAULT_FONT_SIZE } from '@src/lib/constants/defaultFontSize'
import CustomSelect from '@src/pages/figures/components/customer-details/components/custom-select'

export default function FigureMultipleChoice({ figure }: { figure: IAddinFigure }) {
  const resolveFigure = useGlobalStore((state) => state.resolve)
  const { setIsLoading, setError } = useGlobalStore()

  const config: FigureMultipleChoiceProps['config'] = figure.content_config
  const session = useRef((window as any).presentation.session)
  const figures = useGlobalStore((state) => state.figures)

  const [activeIndex, setActiveIndex] = useState<number>(
    Number.isInteger(config?.selected) ? config?.selected : -1
  )
  const [selectedItems, setSelectedItems] = useState<number[]>(config?.selectedItems ?? [])

  const multipleChoiceClick = async (index: number) => {
    try {
      setIsLoading(true)
      if (config.btnConfig.linkType === 'slide_link') {
        goToAnchor(config.btnConfig.links?.[index])
        return
      }
      const figureData = figures[figure.name].content_config

      let value

      if (config.view === 'multiple-selector') {
        setSelectedItems((prev) => {
          return prev.includes(index) ? prev.filter((ind) => ind !== index) : [...prev, index]
        })
        config.selected = -1
        config.selectedItems = selectedItems.includes(index)
          ? selectedItems.filter((item) => item !== index)
          : [...selectedItems, index]
        value = figureData.answers
          .filter((_, index) => config.selectedItems.includes(index))
          .map((answer) => {
            if (typeof answer === 'string') {
              return answer
            }
            return answer.value
          })
      } else {
        setActiveIndex(index)
        config.selected = index
        value =
          typeof figureData.answers[figureData.selected] === 'object'
            ? figureData.answers[figureData.selected]?.value
            : typeof figureData.answers[figureData.selected] === 'string'
              ? figureData.answers[figureData.selected]
              : ''
      }
      resolveFigure({ ...figure, content_config: config })

      const a = await PresentationAPIClient.autoSaveFigure({
        sessionId: session.current,
        id: figure.id,
        value: value,
        fullName: null,
        email: null,
        phone: null,
        business: null,
        additionalFields: null,
        textMessage: null,
      })
      await PresentationAPIClient.sendPresentation(figures, session.current)
    } catch (e) {
      if (e instanceof Error) console.warn(JSON.stringify(e.message))
      else console.warn(JSON.stringify(e))
    } finally {
      setIsLoading(false)
    }
  }

  const MultipleChoiceView = ({ config }: { config: FigureMultipleChoiceProps['config'] }) => {
    if (!config.view) {
      config.view = 'button-list'
    }

    if (config.view === 'button-list') {
      config.btnConfig.fontSize = config.textConfig.fontSize
      return config.answers.map((answer, index) => {
        let answerText = ''

        if (typeof answer === 'object' && answer.label) {
          answerText = answer.label
        } else {
          answerText = answer as string
        }

        return (
          <div key={index} className={`answer ${answer}`}>
            <ActivatedButton
              config={{ btnConfig: config.btnConfig, btnText: answerText }}
              active={index === activeIndex}
              onClick={() => multipleChoiceClick(index)}
            />
          </div>
        )
      })
    }
    if (config.view === 'dropdown-list' || config.view === 'multiple-selector') {
      const options = config.answers.map((v, i) => {
        let answerText = ''

        if (typeof v === 'object' && v.label) {
          answerText = v.label
        } else {
          answerText = v as string
        }
        return { id: i.toString(), value: answerText }
      })

      const getValueFromDropdownConfig = (
        field: keyof typeof config.dropdownConfig,
        initValue: string
      ): string => {
        return !!config.dropdownConfig?.[field] ? config.dropdownConfig?.[field] : initValue
      }

      const fontColor = getValueFromDropdownConfig('fontColor', '#000000')
      const backgroundColor = getValueFromDropdownConfig('backgroundColor', '#ffffff')
      const borderRadius = getValueFromDropdownConfig('borderRadius', '4')
      const hoverColor = getValueFromDropdownConfig('hoverColor', '#5bc5fa')
      const borderColor = getValueFromDropdownConfig('borderColor', '#ffffff')
      const hoverTextColor = getValueFromDropdownConfig('hoverTextColor', '#ffffff')

      const fontSize = !!config.textConfig.fontSize ? config.textConfig.fontSize : '16'

      return (
        <CustomSelect
          options={options}
          onChange={multipleChoiceClick}
          fontSize={fontSize}
          background={backgroundColor}
          dropdownFontColor={fontColor}
          selectedIndex={activeIndex}
          dropdownBorderColor={borderColor}
          dropdownBorderRadius={borderRadius}
          dropdownHoverColor={hoverColor}
          dropdownHoverTextColor={hoverTextColor}
          view={config.view}
          selectedItems={selectedItems}
        />
      )
    }
  }

  return (
    <div className={`figure-multiple-choice --${config.view}`}>
      {config.imageUrl && (
        <img
          className={'figure-multiple-choice_image'}
          src={config.imageUrl}
          alt={'Multiple Choice Image'}
        />
      )}

      <h3
        className={'question'}
        style={{
          color: config.textConfig.textColor,
          fontSize: `${config?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE}px`,
        }}
      >
        {config.question}
      </h3>

      <div className={'answers-list'}>{MultipleChoiceView({ config })}</div>
    </div>
  )
}
