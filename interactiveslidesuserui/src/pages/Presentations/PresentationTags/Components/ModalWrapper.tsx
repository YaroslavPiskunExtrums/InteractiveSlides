import { MouseEvent, ReactNode } from 'react'
import { Modal, ModalBody } from 'reactstrap'

type PropsType = {
  isOpen: boolean
  onSave: (e: MouseEvent<HTMLButtonElement>) => void
  onCloseModal: (e: MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  title: string
}

const ModalWrapper = (props: PropsType) => {
  return (
    <Modal fade={true} isOpen={props.isOpen} toggle={props.onCloseModal} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center mt-4 pt-2 fs-15 mx-4 mx-sm-5">
          <h4>{props.title}</h4>
        </div>
        {props.children}
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button type="button" className="btn w-sm btn-light" onClick={props.onCloseModal}>
            Close
          </button>
          <button type="button" className="btn w-sm btn-success" onClick={props.onSave}>
            Save
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalWrapper
