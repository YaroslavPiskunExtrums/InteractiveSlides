import { MouseEvent, ReactNode } from 'react'
import { Modal, ModalBody } from 'reactstrap'

interface IProps {
  isShow: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  onCloseClick: (e: MouseEvent<HTMLButtonElement>) => void
  buttonMessage?: string
  children?: ReactNode
  confirmButtonColor?: string
}

const CustomModal = ({
  isShow,
  onClick,
  onCloseClick,
  buttonMessage = 'Confirm',
  children,
  confirmButtonColor,
}: IProps) => {
  return (
    <Modal fade={true} isOpen={isShow} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        {children ? (
          children
        ) : (
          <div className="mt-2 text-center">
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4>Are you sure?</h4>
              <p className="text-muted mx-4 mb-0">Are you sure you want to remove this record ?</p>
            </div>
          </div>
        )}
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            Close
          </button>
          {onClick && (
            <button
              type="button"
              className={`btn w-sm ${confirmButtonColor ? confirmButtonColor : 'btn-danger'} `}
              id="delete-record"
              onClick={onClick}
            >
              {buttonMessage}
            </button>
          )}
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CustomModal
