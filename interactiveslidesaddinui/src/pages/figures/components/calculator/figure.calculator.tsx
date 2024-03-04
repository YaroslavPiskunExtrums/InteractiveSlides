import React, { useEffect, useRef, useState } from 'react'

import { FigureCalculatorProps } from '../../../../types/figures-config.props'
import { IAddinFigure } from '../../../../types/IAddinFigure'
import { useGlobalStore } from '../../../../global-store'
import { PresentationAPIClient } from '../../../../lib/api/presentation-api'
import InputOpenField from '../open-field/input-open-field'
import { H3_DEFAULT_FONT_SIZE } from '../../../../lib/constants/defaultFontSize'
import './figure.calculator.sass'
import getVariablesFromEquation from '../../../../lib/utils/get-variables-from-equation'
import { Figures } from '../../../../enums/figures'

const getVariablesValue = (answer: IAddinFigure) => {
  let answerValue = ''
  const answerFigure = answer.figureName
  const contentConfig = answer.content_config

  if (answerFigure === Figures.OPEN_FIELD || answerFigure === Figures.CALCULATOR) {
    answerValue = contentConfig.value ? contentConfig.value : ''
  }
  if (answerFigure === Figures.MULTIPLE_CHOICE) {
    if (Number.isInteger(contentConfig?.selected) && contentConfig.selected !== -1) {
      const selected = contentConfig.answers[contentConfig.selected]

      if (typeof selected === 'object' && selected?.value) {
        answerValue = selected.value
      } else {
        answerValue = selected
      }
    } else {
      answerValue = '0'
    }
  }
  if (answerFigure === Figures.RANGE_SELECTOR) {
    if (+contentConfig.type === 0) {
      answerValue = contentConfig.rangeConfig[0]?.value
      if (!answer) {
        answerValue = '0'
      }
    }
    if (+contentConfig.type === 1) {
      const selected = contentConfig.rangeConfig[1].options[contentConfig.rangeConfig[1]?.selected]
      if (typeof selected === 'object' && selected?.value) {
        answerValue = selected.value
      } else {
        answerValue = selected
      }
    }
  }

  return answerValue
}

export default function FigureCalculator({ figure }: { figure: IAddinFigure }) {
  const config: FigureCalculatorProps['config'] = figure.content_config

  const resolveFigure = useGlobalStore((state) => state.resolve)
  const figures = useGlobalStore((state) => state.figures) as any
  const { setIsLoading, setError } = useGlobalStore()
  const [equationState, setEquationState] = useState<string>('')

  const session = React.useRef((window as any).presentation.session)

  const getEquationCalculation = (equation: string) => {
    let equationCalculation = equation.replaceAll(' ', '')
    const variables = getVariablesFromEquation(equationCalculation)

    console.log('VARIABLES', variables)

    const variablesFigures = Object.values(figures)
      .map((figure: IAddinFigure | any) => {
        return figure?.content_config?.label
          ? {
              ...figure,
              content_config: {
                ...figure.content_config,
                label: figure.content_config.label.replaceAll(' ', ''),
              },
            }
          : null
      })
      .filter((figure: IAddinFigure | any) => {
        return variables.includes(figure?.content_config?.label)
      })

    const variablesFiguresValues = variablesFigures.map((figure: IAddinFigure | any) => {
      const value = getVariablesValue(figure)

      return {
        value: !isNaN(+value) || isFinite(+value) ? +value : 0,
        variable: figure?.content_config?.label,
      }
    })
    let result

    if (variablesFiguresValues.length < variables.length) {
      variables.forEach((variable) => {
        equationCalculation = equationCalculation.replaceAll(new RegExp('\\b' + variable, 'g'), '0')
      })
    } else {
      variablesFiguresValues.forEach((variable) => {
        if (+variable.value < 0) {
          equationCalculation = equationCalculation.replaceAll(
            new RegExp('\\b' + variable.variable, 'g'),
            `(${variable.value})`
          )
        } else {
          equationCalculation = equationCalculation.replaceAll(
            new RegExp('\\b' + variable.variable, 'g'),
            variable.value.toString()
          )
        }
      })
    }

    console.log('EQUATION FINAL OF', equation, 'IS', equationCalculation)

    result = +eval(equationCalculation)
    result = !isNaN(result) && isFinite(result) ? result.toFixed(2) : ''
    setEquationState(result.toString())
    config.value = result.toString()

    return result
  }

  const autosaveHandler = async () => {
    try {
      setIsLoading(true)
      const figureData = figures[figure.name]?.content_config

      await PresentationAPIClient.autoSaveFigure({
        sessionId: session.current,
        id: figure.id,
        value: figureData?.value ?? '',
        fullName: null,
        email: null,
        phone: null,
        business: null,
        additionalFields: null,
        textMessage: null,
      })
    } catch (e) {
      if (e instanceof Error) console.warn(JSON.stringify(e.message))
      else console.warn(JSON.stringify(e))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getEquationCalculation(config?.equation || '')
  }, [figures])

  useEffect(() => {
    resolveFigure({ ...figure, content_config: config })
    PresentationAPIClient.sendPresentation(
      {
        ...figures,
        [figure.name]: { ...figure, content_config: config },
      },
      session.current
    )

    //@ts-ignore
    const isSessionFinished = window?.presentation?.isSessionFinished !== '1'

    if (session.current && isSessionFinished) autosaveHandler()
  }, [config.value])

  useEffect(() => {
    setEquationState(figure.content_config?.value)
  }, [figure])

  return (
    <div className={'figure-calculator'}>
      <h3
        style={{
          color: config.textConfig.textColor,
          fontSize: `${config?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE}px`,
        }}
      >
        {config.question}
      </h3>
      <h4>{config.subheading}</h4>
      <InputOpenField
        defaultValue={equationState}
        fontSize={config?.inputConfig?.fontSize || '16'}
        backColor={config?.inputConfig?.backColor}
        borderColor={config?.inputConfig?.borderColor}
        borderRadius={config?.inputConfig?.borderRadius}
        textColor={config?.inputConfig?.textColor}
        placeholder={''}
        type={'text'}
        readonly
      />
    </div>
  )
}
