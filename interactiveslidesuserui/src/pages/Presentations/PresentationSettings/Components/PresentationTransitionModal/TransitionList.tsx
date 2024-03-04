import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Control, Controller, UseFormGetValues } from 'react-hook-form'
import { IForm } from './PresentationTransitionModal'

interface IProps {
  control: Control<IForm, any>
  getValues: UseFormGetValues<IForm>
  isOpen: boolean
  saveHandler: (transition: string) => Promise<void>
}

interface TransitionItem {
  id: string
  value: string
  label: string
}

const transitionList: TransitionItem[] = [
  { id: '0', value: 'none', label: 'No transitions' },
  { id: '1', value: 'fade', label: 'Fade' },
  { id: '2', value: 'slide', label: 'Slide' },
  { id: '3', value: 'convex', label: 'Convex' },
  { id: '4', value: 'concave', label: 'Concave' },
  { id: '5', value: 'zoom', label: 'Zoom' },
]

const transitionMix = () => {
  const mix = transitionList.reduce<TransitionItem[]>((acc, IN) => {
    const outs = transitionList.reduce<TransitionItem[]>((outsAcc, OUT) => {
      if (IN.value === OUT.value) {
        //prevent pure transition
        return outsAcc
      }
      const value = `${IN.value}-in ${OUT.value}-out`
      const label = value
        .split(' ')
        .map((substr) => substr.at(0).toUpperCase() + substr.slice(1))
        .join(' ')
      const id = OUT.id + IN.id

      return [...outsAcc, { id, value, label }]
    }, [])

    return [...acc, ...outs]
  }, [])
  return mix
}

const tabs = [
  { id: 0, label: 'Pure', value: 'pure', transitionList: transitionList },
  { id: 1, label: 'Mixed', value: 'mixed', transitionList: transitionMix() },
]

const TransitionList = (props: IProps) => {
  const currentTransitionRef = useRef(null)
  const [currentTab, setCurrentTab] = useState(0)

  const scrollToElement = (elementRef: MutableRefObject<HTMLDivElement>) => {
    if (!elementRef?.current) return
    elementRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  useEffect(() => {
    if (!props.isOpen) return
    const calculateTab = tabs.find((tab) =>
      tab.transitionList.find((item) => item.value === props.getValues('transition'))
    )?.id

    //for scroll animation
    setTimeout(() => {
      setCurrentTab(calculateTab ?? 0)
    }, 500)
  }, [props.isOpen])

  useEffect(() => {
    scrollToElement(currentTransitionRef)
  }, [currentTab])

  return (
    <div className="transition-container">
      <div className="transition-container-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`transition-container-tabs-tab ${
              currentTab === tab.id ? 'transition-container-tabs-tab-selected' : ''
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="transition-container-list">
        <Controller
          name="transition"
          control={props.control}
          render={({ field: { onChange } }) => (
            <>
              {tabs[currentTab].transitionList.map((item) => (
                <div
                  key={item.id}
                  ref={props.getValues('transition') === item.value ? currentTransitionRef : null}
                  className={`transition-container-list-item ${
                    props.getValues('transition') === item.value
                      ? 'transition-container-list-item-selected'
                      : ''
                  }`}
                  onClick={() => {
                    onChange(item.value)
                    props.saveHandler(item.value)
                  }}
                >
                  {item.label}
                </div>
              ))}
            </>
          )}
        />
      </div>
    </div>
  )
}

export default TransitionList
