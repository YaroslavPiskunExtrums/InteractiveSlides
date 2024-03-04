import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import '../../_presentation-settings.scss'
import debounce from '../../../../../helpers/debounce'
import presentationsColorsScope from '../../../../../lib/constants/scopeForPresentationsColors'
import ColorControl from './ColorControl'
import apiLink from 'src/helpers/api_links'


const PresentationEditColor = ({
  isOpen,
  onClose,
  presentation,
  onPresentationColorsEdit,
  iFrameRef,
}) => {
  return (
    <div className={'presentation-edit-color'}>
      <Modal size={'lg'} isOpen={isOpen} toggle={onClose} fade centered>
        <ModalHeader>Edit presentations colors</ModalHeader>
        <ModalBody>
          <div className={'d-flex'} style={{ height: '300px', gap: '15px' }}>
            <div className={'d-flex gap-2 flex-column'} style={{ width: '310px' }}>
              <ColorControl
                controlName="Presentation background color"
                defaultValue={presentation?.presentation_color}
                onChange={debounce((e) => {
                  onPresentationColorsEdit(
                    presentation.id,
                    e.target.value,
                    presentationsColorsScope.BACKGROUND
                  )
                })}
              />
              <ColorControl
                controlName="Save button color"
                defaultValue={presentation?.save_color}
                onChange={debounce((e) => {
                  onPresentationColorsEdit(
                    presentation.id,
                    e.target.value,
                    presentationsColorsScope.SAVE_BUTTON
                  )
                })}
              />
              <ColorControl
                controlName="Controls color"
                defaultValue={presentation?.controls_colors}
                onChange={debounce((e) => {
                  onPresentationColorsEdit(
                    presentation.id,
                    e.target.value,
                    presentationsColorsScope.CONTROLS
                  )
                })}
              />
            </div>
            <div className="w-100 p-3" style={{ background: '#808080FF', borderRadius: '10px' }}>
              <iframe
                src={`${apiLink}/api/HTML/view-presentation-preview/${presentation.id}`}
                width={'100%'}
                height={'100%'}
                ref={iFrameRef}
                className='iframe'
              />
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default PresentationEditColor
