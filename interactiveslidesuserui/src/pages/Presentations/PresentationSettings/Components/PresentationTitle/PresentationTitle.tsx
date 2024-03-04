import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import './presentation-title.scss'
import apiLink from 'src/helpers/api_links'
import { toast } from 'react-toastify'
import usePresentationSettingsStore from '../../presentation-settings.store'
import { patchPresentationTitle } from 'src/lib/api/html'

interface IProps {
  title?: string
  presentationId: string
}

const PresentationTitle = ({ presentationId, title = '' }: IProps) => {
  const { changePresentationTitle } = usePresentationSettingsStore() as any
  const [startChange, setStartChange] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    setNewTitle(title)
  }, [title])

  const saveNewTitleHandler = async () => {
    const res = await patchPresentationTitle(presentationId, newTitle)
    if (!res.ok) {
      toast.error('Title has not saved')
      setStartChange(false)
      return
    }
    changePresentationTitle(newTitle)
    setStartChange(false)
    toast.success('Title has saved')
  }

  return (
    <div className="presentation-title-wrapper">
      <div className="presentation-title-container">
        {startChange ? (
          <Input
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            setStartChange={setStartChange}
            title={title}
            saveNewTitleHandler={saveNewTitleHandler}
          />
        ) : (
          <Title setStartChange={setStartChange} title={title} />
        )}
      </div>
    </div>
  )
}

interface IInputProps {
  title: string
  newTitle: string
  setStartChange: Dispatch<SetStateAction<boolean>>
  setNewTitle: Dispatch<SetStateAction<string>>
  saveNewTitleHandler: () => void
}

const Input = (props: IInputProps) => {
  const closeChangeHandler = () => {
    props.setStartChange(false)
    props.setNewTitle(props.title)
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    props.setNewTitle(e.target.value)
  }

  return (
    <>
      <input
        value={props.newTitle}
        onChange={onChangeHandler}
        className="presentation-title-input"
      />
      <i
        className="ri-check-line presentation-title-confirm-icon"
        onClick={props.saveNewTitleHandler}
      />
      <i className="ri-close-line presentation-title-close-icon" onClick={closeChangeHandler} />
    </>
  )
}

interface ITitleProps {
  title: string
  setStartChange: Dispatch<SetStateAction<boolean>>
}

const Title = (props: ITitleProps) => {
  const startChangeHandler = () => {
    props.setStartChange(true)
  }
  return (
    <>
      <div className="presentation-title-text">{props.title}</div>
      <i className="ri-pencil-line presentation-title-change-icon" onClick={startChangeHandler} />
    </>
  )
}

export default PresentationTitle
