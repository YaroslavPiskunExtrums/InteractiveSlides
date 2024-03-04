import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import TransitionList from './TransitionList'
import './transition-modal.sass'
import { useForm } from 'react-hook-form'
import usePresentationSettingsStore from '../../presentation-settings.store'
import React, { useEffect, useRef } from 'react'
import apiLink from 'src/helpers/api_links'
import { toast } from 'react-toastify'
import { patchPresentationTransition } from 'src/lib/api/html'

interface IProps {
  isOpen: boolean
  onClose: () => void
}

export type IForm = { transition: string }

const PresentationTransitionModal = (props: IProps) => {
  const { presentationSettings, changePresentationTransition } =
    usePresentationSettingsStore() as any

  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const { control, reset, getValues } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {},
  })

  useEffect(() => {
    reset({ transition: presentationSettings.transition })
  }, [presentationSettings])

  const saveHandler = async (transition: string) => {
    const res = await patchPresentationTransition(presentationSettings.id, transition)
    if (!res.ok) {
      toast.error('Transition has not saved')
      return
    }
    changePresentationTransition(transition)
    toast.success('Transition has saved')
    iFrameRef.current.src += ''
  }

  return (
    <div className={'presentation-edit-color'}>
      <Modal size={'lg'} isOpen={props.isOpen} toggle={props.onClose} fade centered>
        <ModalHeader>Edit presentations transition</ModalHeader>
        <ModalBody>
          <div className="transition-presentation-modal">
            <div className="transition-presentation-modal-container">
              <TransitionList
                control={control}
                getValues={getValues}
                isOpen={props.isOpen}
                saveHandler={saveHandler}
              />
              <div className="w-100 p-3" style={{ background: '#808080FF', borderRadius: '10px' }}>
                <iframe
                  src={`${apiLink}/api/HTML/view-presentation-preview/${presentationSettings.id}`}
                  width={'100%'}
                  height={'100%'}
                  ref={iFrameRef}
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default PresentationTransitionModal
