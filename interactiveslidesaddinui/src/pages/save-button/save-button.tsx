import React, { useEffect, useState } from 'react'
import './save-button.sass'
import { useGlobalStore } from '../../global-store'
import { PresentationAPIClient } from '../../lib/api/presentation-api'

function SaveButton({
  disabledButton,
  savePresentation,
  buttonColor,
}: {
  disabledButton: boolean
  savePresentation: () => void
  buttonColor: string
}) {
  //@ts-ignore
  const isDisableButton = window.presentation.isDisableBtn

  return (
    <button
      style={{ color: buttonColor }}
      disabled={disabledButton || isDisableButton}
      onClick={savePresentation}
      className="save-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <title>content-save-outline</title>
        <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z" />
      </svg>
    </button>
  )
}

function PopUpMessage({
  message,
  show,
  status,
}: {
  message: string
  show: boolean
  status: 'success' | 'error'
}) {
  const StatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <svg
            className={'pop-up_icon --success'}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>check-circle</title>
            <path
              fill={'currentColor'}
              d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
            />
          </svg>
        )
      case 'error':
        return (
          <svg
            className={'pop-up_icon --error'}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>alert-circle</title>
            <path
              fill={'currentColor'}
              d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
        )
    }
  }

  return (
    <div className={`pop-up ${show ? '--show' : '--hide'}`}>
      <StatusIcon />
      <div className="pop-up_message">
        <p>{message}</p>
      </div>
    </div>
  )
}

export default function SaveButtonContainer({ buttonColor }: { buttonColor: string }) {
  const [isShowSave, setIsShowSave] = useState(false)

  useEffect(() => {
    if (window) {
      // @ts-ignore
      Boolean(window.presentation.isShowSave) ? setIsShowSave(true) : setIsShowSave(false)
    }
  }, [])

  const [showPopUp, setShowPopUp] = useState<boolean>(false)
  const [popUpStatus, setPopUpStatus] = useState<'success' | 'error'>('success')
  const [timer, setTimer] = useState<NodeJS.Timeout>(null)
  const popUpMessage = () => {
    switch (popUpStatus) {
      case 'success':
        return 'Presentation saved'
      case 'error':
        return 'Error while saving presentation'
    }
  }

  const [disabledButton, setDisabledButton] = useState<boolean>(
    /*(window as any).presentation.saved*/ false
  )

  const figures = useGlobalStore((state) => state.figures)
  const { setIsLoading } = useGlobalStore()

  const savePresentation = async () => {
    if (!(window as any).presentation.saved) {
      const session = (window as any).presentation.session
      await PresentationAPIClient.sendPresentation(figures, session)
      if (timer) clearTimeout(timer)

      try {
        setIsLoading(true)
        await PresentationAPIClient.finishPresentation(session)
        setPopUpStatus('success')
        setShowPopUp(true)
        setTimer(setTimeout(() => setShowPopUp(false), 3000))
      } catch (e) {
        console.error(e)
        setPopUpStatus('error')
        setShowPopUp(true)
        setTimer(setTimeout(() => setShowPopUp(false), 3000))
      } finally {
        setIsLoading(false)
      }
      // @ts-ignore
      // window.presentation.saved = true
      // setDisabledButton(true)
    } else {
    }
  }

  const { isLoading, error, setError } = useGlobalStore()

  useEffect(() => {
    if (error) {
      setPopUpStatus('error')
      setShowPopUp(true)
      setTimer(
        setTimeout(() => {
          setError(null)
          setShowPopUp(false)
        }, 3000)
      )
    }
  }, [error])

  return (
    <>
      <PopUpMessage message={popUpMessage()} show={showPopUp} status={popUpStatus} />
      <SaveButton
        buttonColor={buttonColor}
        disabledButton={disabledButton}
        savePresentation={savePresentation}
      />
      {isLoading && <div className="loader"></div>}
    </>
  )
}
