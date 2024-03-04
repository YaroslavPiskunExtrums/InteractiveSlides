import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { IForm, IIntegrationProperty } from '../right-menu.types'

interface IProps {
  show: boolean
  onClose: () => void
  onSync: (integrationConnections: any) => Promise<void>
  selectedIntegrationProperty: IIntegrationProperty
}

function SyncIntegrationModal({ show, onClose, onSync, selectedIntegrationProperty }: IProps) {
  const { control, watch, getValues } = useFormContext<IForm>()
  const interactiveElementsInputs = watch('answers')
    ? watch('answers').filter((answer) => answer && 'value' in answer)
    : []

  const integrationsInputs = useRef([])

  const mapToSync = async () => {
    const mappedFields = integrationsInputs.current.map((input, index) => {
      return {
        label: interactiveElementsInputs?.[index]?.label
          ? interactiveElementsInputs[index].label
          : '',
        value: input && input.value ? input.value : '',
      }
    })
    await onSync(mappedFields)
    onClose()
    return mappedFields
  }

  return (
    <Modal size={'lg'} fade={true} centered isOpen={show} toggle={onClose}>
      <ModalHeader>Synchronize hubspot values</ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <div className={'mb-2'}>
              <b>Field labels</b>
            </div>
          </Col>
          <Col>
            <div className={'mb-2'}>
              <b>Hubspot values</b>
            </div>
          </Col>
        </Row>
        {getValues('answers')?.map((optionInput, index) => (
          <Row key={index}>
            <Col>
              <div className={'mb-3'}>
                <input
                  value={optionInput?.label ? optionInput.label : ''}
                  readOnly
                  className={'form-control'}
                />
              </div>
            </Col>
            <Col>
              {!(index + 1 > selectedIntegrationProperty?.options?.length) && (
                <div className={'mb-3'}>
                  <Controller
                    name={`answers.${index}.value`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <select
                        ref={(el) => (integrationsInputs.current[index] = el)}
                        className={'form-select'}
                        value={value}
                        onChange={onChange}
                      >
                        {selectedIntegrationProperty.options.map((option, index) => {
                          return (
                            <option key={index} value={option.value}>
                              {option.label} ({option.value})
                            </option>
                          )
                        })}
                      </select>
                    )}
                  />
                </div>
              )}
            </Col>
          </Row>
        ))}
        {!selectedIntegrationProperty?.options ||
          (interactiveElementsInputs.length > selectedIntegrationProperty?.options.length && (
            <div className={'text-danger text-center'}>
              The number of Hubspot field values must be equal to the number of field options
            </div>
          ))}
      </ModalBody>
      <ModalFooter>
        <div className={'m-auto'}>
          <Button
            color="primary"
            size={'md'}
            onClick={mapToSync}
            disabled={
              !selectedIntegrationProperty?.options ||
              interactiveElementsInputs.length > selectedIntegrationProperty?.options.length
            }
          >
            Save
          </Button>
          <Button color="danger" size={'md'} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default SyncIntegrationModal
