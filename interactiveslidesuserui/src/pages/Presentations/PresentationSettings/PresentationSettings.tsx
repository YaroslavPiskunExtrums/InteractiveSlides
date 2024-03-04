import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'reactstrap'
import { useParams } from 'react-router-dom'
import usePresentationSettingsStore from './presentation-settings.store'
import './_presentation-settings.scss'
import InteractiveFigure from './Components/Figures/Figure'
import RightMenu from './Components/RightMenu/RightMenu'
import apiLink from '../../../helpers/api_links'
import { toast } from 'react-toastify'
import presentationsColorsScope from '../../../lib/constants/scopeForPresentationsColors'
import PresentationTitle from 'src/pages/Presentations/PresentationSettings/Components/PresentationTitle/PresentationTitle'
import PresentationTransitionModal from './Components/PresentationTransitionModal/PresentationTransitionModal'
import { authFetch } from 'src/lib/util/auth'
import PresentationEditColor from 'src/pages/Presentations/PresentationSettings/Components/PresentationColorModal/PresentationEditColor'

const PresentationSettings = () => {
  const { presentationId } = useParams()

  const {
    presentationSettings,
    downloadPresentationSettings,
    activeSlide,
    setActiveSlide,
    setIsEditMenuActive,
    setActiveFigure,
    updatePresentationSettings,
  } = usePresentationSettingsStore() as any

  const selectedSlideRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (presentationId) {
      downloadPresentationSettings(presentationId)
    }
    setIsEditMenuActive(false)
    setActiveFigure({})
  }, [])
  const [editColorsModal, setEditColorsModal] = useState(false)
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const onEditPresentationColor = async (id, color, scope) => {
    try {
      const presentationRequest = await authFetch(`/api/HTML/edit-presentation-color`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          color,
          id,
          scope,
        }),
      })
      const changeColorStatus = await presentationRequest.json()

      if (scope === presentationsColorsScope.SAVE_BUTTON) {
        updatePresentationSettings({ save_color: color })
      }
      if (scope === presentationsColorsScope.BACKGROUND) {
        updatePresentationSettings({ presentation_color: color })
      }
      if (scope === presentationsColorsScope.CONTROLS) {
        updatePresentationSettings({ controls_colors: color })
      }
      iFrameRef.current.src += ''
    } catch (e) {
      console.log(e)
      toast.error('Error while editing presentation color')
    }
  }

  const [editPresentationTransition, setEditPresentationTransition] = useState<boolean>(false)

  return (
    <Fragment>
      <div className="page-content presentations-settings-page">
        <Container fluid>
          <div>
            <PresentationTitle presentationId={presentationId} title={presentationSettings?.name} />
            <div className={'mb-3 d-flex gap-3 align-items-center'}>
              <div>
                <a
                  href={`${apiLink}/api/HTML/view-presentation-origin/${presentationId}`}
                  target={'_blank'}
                  referrerPolicy={'no-referrer'}
                  className={'fs-5 fw-normal link-dark menu-interactive-item'}
                  rel="noreferrer"
                >
                  View presentation
                </a>
              </div>
              <div onClick={() => setEditColorsModal(!editColorsModal)}>
                <h5 className={'mb-0 fs-5 fw-normal link-dark menu-interactive-item'}>Edit Presentation Colors</h5>
              </div>
              <div
                className="mb-0 fs-5 fw-normal link-dark menu-interactive-item"
                onClick={() => setEditPresentationTransition((prev) => !prev)}
              >
                Edit Presentation Transition
              </div>
            </div>
          </div>
          <Row>
            <Col xs={2}>
              <div className="presentations-settings-page_slides">
                {presentationSettings &&
                  presentationSettings.slides.map((slide, index) => {
                    return (
                      <div
                        onClick={() => setActiveSlide(index)}
                        className={`presentations-settings-page_slides_slide --${slide.slide}`}
                        key={index}
                      >
                        <div>{slide.slide}.</div>
                        <div
                          className={`presentations-settings-page_slides_slide_content ${
                            activeSlide === index ? '--active' : ''
                          }`}
                        >
                          <img src={slide.url} alt={`slide #${slide.slide}`} />
                          <span className={`presentations-settings-page_slides_slide_number`}>
                            {slide.figures.length}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Col>
            <Col xs={10}>
              <div className="presentations-slide-page">
                {presentationSettings && (
                  <div
                    style={{ backgroundColor: presentationSettings.presentation_color }}
                    className={'presentations-settings-page_active-slide'}
                  >
                    <img
                      ref={selectedSlideRef}
                      className={'presentations-settings-page_active-slide_image'}
                      src={presentationSettings?.slides[activeSlide]?.url}
                      alt={`slide #${presentationSettings.slides[activeSlide]?.slide}`}
                    />
                    <div className={'presentations-settings-page_active-slide_figures'}>
                      {presentationSettings.slides[activeSlide]?.figures.map((figure, index) => {
                        return (
                          <div className={'presentations-settings-page_active-slide_figures_figure'} key={figure.id}>
                            <InteractiveFigure
                              figureConfig={figure}
                              slideConfig={presentationSettings.slides[activeSlide]}
                              slideRef={selectedSlideRef}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          {editColorsModal && (
            <PresentationEditColor
              presentation={presentationSettings}
              isOpen={editColorsModal}
              onClose={() => setEditColorsModal(!editColorsModal)}
              onPresentationColorsEdit={onEditPresentationColor}
              iFrameRef={iFrameRef}
            />
          )}
          {editPresentationTransition && (
            <PresentationTransitionModal
              isOpen={editPresentationTransition}
              onClose={() => setEditPresentationTransition((prev) => !prev)}
            />
          )}
        </Container>
        <RightMenu />
      </div>
    </Fragment>
  )
}

export default PresentationSettings
