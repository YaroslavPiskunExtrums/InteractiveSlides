import React, {useEffect, useState} from 'react'
import './finish-presentation.sass'

import {PresentationAPIClient} from '../../lib/api/presentation-api'
import {useGlobalStore} from "../../global-store";

function FinishButton({
                          disabledButton,
                          finishPresentation,
                          buttonColor,
                      }: {
    disabledButton: boolean
    finishPresentation: () => void
    buttonColor: string
}) {
    //@ts-ignore
    const isDisableButton = window.presentation.isDisableBtn

    return (
        <button
            style={{color: buttonColor}}
            disabled={disabledButton || isDisableButton}
            onClick={finishPresentation}
            className="finish-button"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill={"currentColor"} viewBox="0 0 24 24">
                <title>checkbox-marked-outline</title>
                <path
                    d="M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"/>
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
            <StatusIcon/>
            <div className="pop-up_message">
                <p>{message}</p>
            </div>
        </div>
    )
}


const ConfirmPopUp = ({show, setShow, confirmAction}: {
    show: boolean,
    setShow: (show: boolean) => void,
    confirmAction: () => void
}) => {
    return (
        <>
            <div className={`confirm-pop-up_fade`}></div>
            <div className={`confirm-pop-up ${show ? '--show' : '--hide'}`}>

                <div className="confirm-pop-up_message">
                    <p>Are you sure you want to finish the presentation session?</p>
                    <p>You can not change the presentation answers anymore</p>
                </div>
                <div className="confirm-pop-up_buttons">
                    <button onClick={confirmAction} className="confirm-button">Confirm</button>
                    <button onClick={() => setShow(false)} className="cancel-button">Cancel</button>
                </div>
            </div>
        </>

    )
}

export default function FinishPresentationButtonContainer({buttonColor}: { buttonColor: string }) {
    const [isShowFinish, setIsShowFinish] = useState(false)

    useEffect(() => {
        if (window) {
            // @ts-ignore
            Boolean((window as any).presentation.saved) ? setIsShowFinish(true) : setIsShowFinish(false)
        }
    }, [])


    const [showConfirm, setShowConfirm] = useState<boolean>(false)
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
        (window as any).presentation.saved
    )

    const figures = useGlobalStore((state) => state.figures)
    const {setIsLoading} = useGlobalStore()

    const finishSession = async () => {
        if (!(window as any).presentation.saved) {
            const session = (window as any).presentation.session
            await PresentationAPIClient.sendPresentation(figures, session)
            if (timer) clearTimeout(timer)

            try {
                setIsLoading(true)
                await PresentationAPIClient.finishSession(session)

                setPopUpStatus('success')
                setShowPopUp(true)
                setTimer(setTimeout(() => setShowPopUp(false), 3000))
                //@ts-ignore
                window.presentation.saved = true
                setDisabledButton(true)
            } catch (e) {
                console.error(e)
                setPopUpStatus('error')
                setShowPopUp(true)
                setTimer(setTimeout(() => setShowPopUp(false), 3000))
            } finally {
                setIsLoading(false)
                setShowConfirm(false)
            }

        } else {
        }
    }

    const {isLoading, error, setError} = useGlobalStore()

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
            {showConfirm && <ConfirmPopUp show={showConfirm} setShow={setShowConfirm} confirmAction={finishSession}/>}
            <PopUpMessage message={popUpMessage()} show={showPopUp} status={popUpStatus}/>
            <FinishButton
                buttonColor={buttonColor}
                disabledButton={disabledButton}
                finishPresentation={() => setShowConfirm(true)}
            />
            {isLoading && <div className="loader"></div>}
        </>
    )
}
