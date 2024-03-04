import { MouseEvent } from 'react'
import { Control, Controller } from 'react-hook-form'
import { Modal, ModalBody } from 'reactstrap'
import { CreateSessionFormType } from './Sessions'

type IProps = {
  items?: { id: string; name: string }[]
  onAdd: (e: MouseEvent<HTMLButtonElement>) => void
  onClose: (e: MouseEvent<HTMLButtonElement>) => void
  show: boolean
  control: Control<CreateSessionFormType, any>
  presentationName?: string
}

function CreateSessionModal(props: IProps) {
  const { onAdd, onClose, items, show, control, presentationName } = props

  return (
    <Modal fade={true} isOpen={show} toggle={onClose} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Add a new presentation session</h4>
            <p className="text-muted mx-4 mb-0">Please choose a presentation and name session.</p>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="presentation" className="form-label">
              Presentation
            </label>
            {items && (
              <Controller
                name="selectedPresentationId"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <select
                    onChange={onChange}
                    name="presentation"
                    className="form-select"
                    aria-label="Default select example"
                    value={value}
                  >
                    {items.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      )
                    })}
                  </select>
                )}
              />
            )}
            {presentationName && <h5>{presentationName}</h5>}
          </div>
          <div className="mt-2">
            <label htmlFor="link_name" className="form-label">
              Link Name
            </label>
            <Controller
              name="linkName"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  onChange={onChange}
                  name="link_name"
                  className="form-control"
                  placeholder="Link name"
                  value={value}
                />
              )}
            />
          </div>
          <div className="mt-2">
            <label htmlFor="company" className="form-label">
              Company Name
            </label>
            <Controller
              name="companyName"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  onChange={onChange}
                  name="company"
                  className="form-control"
                  placeholder="Company name"
                  value={value}
                />
              )}
            />
          </div>
          <div className="mt-2">
            <label htmlFor="sales" className="form-label">
              Sales Name
            </label>
            <Controller
              control={control}
              name="salesName"
              render={({ field: { value, onChange } }) => (
                <input
                  onChange={onChange}
                  name="sales"
                  className="form-control"
                  placeholder="Sales name"
                  value={value}
                />
              )}
            />
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={onClose}
          >
            Close
          </button>
          <button type="button" className="btn w-sm btn-success" id="delete-record" onClick={onAdd}>
            Add
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}
export default CreateSessionModal
