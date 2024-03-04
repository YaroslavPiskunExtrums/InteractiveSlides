import './_presentations.scss'
import { Button, Col, Container, Row } from 'reactstrap'
import JSONPretty from 'react-json-pretty'
import DeleteModal from '../../Components/Common/DeleteModal'
import CreateSessionModal from './CreateSessionModal'
import React, { useEffect, useState } from 'react'
import CustomModal from '../../Components/Common/CustomModal'
import apiLink from '../../helpers/api_links'
import { toast } from 'react-toastify'
import {
  createPresentationSession,
  deletePresentationSession,
  finishSession,
  getCompaniesPresentationSession,
  getCompaniesPresentations,
} from 'src/lib/api/html'
import Search from 'src/Components/Common/Search'
import { useSearchDebounce } from 'src/lib/hooks/useSearch'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createSessionSchema } from './session.resolver'
import { usePagination } from 'src/lib/hooks/usePagination'
import Pagination from 'src/Components/Common/Pagination'
import MoreMenuItem from 'src/Components/Common/MoreMenu/MoreMenuItem'
import MoreMenu from 'src/Components/Common/MoreMenu/MoreMenu'
import { figuresArray, FiguresValues } from 'src/helpers/interactive-elements'
import { authFetch } from 'src/lib/util/auth'

type ISession = {
  answers: []
  company_name: string
  finished: number
  id: string
  link: string
  linkName: string
  name: string
  sales_id: string
  sales_name: string
  read_only_id?: string
}

type NoteType = {
  note: string
  id: string
}

type ISlide = {
  slide: number
  notes: null | NoteType[]
}

type ISlidesNotes = {
  slides: ISlide[]
}

type SessionAnswer = {
  figureName: string,
  label: string,
  value: string,
}


export type CreateSessionFormType = {
  companyName?: string
  linkName?: string
  salesName?: string
  selectedPresentationId?: string
}

const Sessions = () => {
  const obj = JSON.parse(sessionStorage.getItem('authUser')).accessToken
  const userObj = JSON.parse(atob(obj.split('.')[1]))

  const [presentations, setPresentations] = useState([])
  const [presentationsLinks, setPresentationsLinks] = useState<ISession[]>([])
  const [deletePresentation, setDeletePresentation] = useState(false)
  const [deletedPresentationId, setDeletedPresentationId] = useState(null)
  const [isCreateSession, setIsCreateSession] = useState(false)
  const [showFinishSessionModal, setShowFinishSessionModal] = useState<boolean>(false)
  const [finishingSessionId, setFinishingSessionId] = useState<string>(null)
  const [showSlidesNotesModal, setShowSlidesNotesModal] = useState<boolean>(false)
  const [slidesNotes, setSlidesNotes] = useState<ISlide[]>(null)
  const [showAnswersModal, setShowAnswersModal] = useState<boolean>(false)
  const [sessionAnswers, setSessionAnswers] = useState<SessionAnswer[]>([])

  const { resetField, reset, watch, control } = useForm<CreateSessionFormType>({
    defaultValues: {
      companyName: '',
      linkName: '',
      salesName: '',
      selectedPresentationId: '',
    },
    resolver: yupResolver(createSessionSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    Promise.all([getPresentations(), getPresentationsSessions()])
  }, [])

  const getPresentationsSessions = async () => {
    const data = await getCompaniesPresentationSession(userObj.saas_company_id)
    setPresentationsLinks(data)
  }

  const getPresentations = async () => {
    const data = await getCompaniesPresentations(userObj.saas_company_id)
    setPresentations(data)
    reset({ selectedPresentationId: data[0]?.id, companyName: '', linkName: '', salesName: '' })
  }

  const deletePresentationSessionClick = (id: string) => {
    setDeletePresentation(true)
    setDeletedPresentationId(id)
  }

  const onDeleteClick = async () => {
    const data = await deletePresentationSession(deletedPresentationId, userObj.id)
    if (data.status === 'ok') {
      setPresentationsLinks(
        presentationsLinks.filter((presentation) => presentation.id !== deletedPresentationId),
      )
    }
    setDeletePresentation(false)
    setDeletedPresentationId(null)
  }

  const onDeleteCloseClick = () => {
    setDeletePresentation(false)
    setDeletedPresentationId(null)
  }

  const onAddPresentationClick = () => {
    setIsCreateSession(true)
  }

  const onAddPresentationCloseClick = () => {
    setIsCreateSession(false)
  }

  const onAddPresentation = async () => {
    const { companyName, linkName, salesName, selectedPresentationId } = watch()

    const response = await createPresentationSession(
      selectedPresentationId,
      companyName,
      salesName,
      linkName,
    )

    const data = await response.json()

    if (response.status === 200) {
      setIsCreateSession(false)

      reset({
        companyName: '',
        linkName: '',
        salesName: '',
        selectedPresentationId: presentations[0]?.id ?? '',
      })

      setPresentationsLinks([...presentationsLinks, data])
    }
  }

  const openFinishSessionModalHandler = (presentationId: string) => {
    setShowFinishSessionModal(true)
    setFinishingSessionId(presentationId)
  }

  const closeFinishSessionModalHandler = () => {
    setShowFinishSessionModal(false)
    setFinishingSessionId(null)
  }

  const confirmFinishSessionModal = async () => {
    if (!finishingSessionId) return

    const data = await finishSession(finishingSessionId)
    if (data.status === 'ok') {
      toast.success('Session has finished')
      setPresentationsLinks((prev) =>
        prev.map((link) => {
          if (finishingSessionId === link.id) {
            return { ...link, finished: 1 }
          }
          return link
        }),
      )
    } else {
      toast.error('Error')
    }
    setShowFinishSessionModal(false)
    setFinishingSessionId(null)
  }

  const openSlidesNotesModalHandler = (presentationId: string) => {
    setShowSlidesNotesModal(true)
    getSlidesNotes(presentationId)
  }

  const closeSlidesNotesModalHandler = () => {
    setShowSlidesNotesModal(false)
    setSlidesNotes(null)
  }

  const openSessionAnswersHandler = (presentationId: string) => {
    setShowAnswersModal(true)
    const presentationSessionAnswers = visibleItems.find((item) => item.id === presentationId)?.answers
    setSessionAnswers(presentationSessionAnswers)
  }

  const closeSessionAnswersHandler = () => {
    setShowAnswersModal(false)
    setSessionAnswers(null)
  }

  const resolveReadonlySession = async (presentationId: string) => {
    const presentation = presentationsLinks.find((item) => item.id === presentationId)

    if(presentation?.read_only_id) {
      window.open(`${apiLink}/api/HTML/presentation-session-share/${presentation.read_only_id}`)
    }
    else {
      const response = await authFetch(`/api/HTML/create-read-only-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: presentationId,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        window.open(`${apiLink}/api/HTML/presentation-session-share/${data.read_only_id}`)
      }
    }
  }


  const getSlidesNotes = async (presentationId: string) => {
    const res = await fetch(`${apiLink}/api/slide-note/get-slides-notes/${presentationId}`)
    const data: ISlidesNotes = await res.json()
    if (res.ok) {
      setSlidesNotes(data.slides)
      return
    }
    toast.error('Error')
  }

  const openPresentationHandler = (link: string) => {
    window.open(link)
  }

  const { filteredItem, searchValue, onChange } = useSearchDebounce(presentationsLinks, [
    'linkName',
    'name',
  ])

  const { currentPage, pageAmount, visibleItems, itemsOnPage } = usePagination(filteredItem, {
    itemsOnPageKey: 'itemsOnSessionPage',
  })

  return (
    <div className='page-content presentations-page'>
      <Container fluid>
        <div className='page-title-box d-flex justify-content-end gap-3 '>
          <Search
            onChangeSearchValue={onChange['linkName']}
            searchValue={searchValue['linkName']}
            placeholder='Search by link'
          />
          <Search
            onChangeSearchValue={onChange['name']}
            searchValue={searchValue['name']}
            placeholder='Search by name'
          />
        </div>
        <Row>
          <Col xs={1}>
            <div className='d-flex gap-3'>
              {!userObj?.is_trial_user && (
                <Button onClick={onAddPresentationClick} className='action-button --add-session'>
                  <i className='ri-add-circle-line align-middle fw-medium' />
                </Button>
              )}

              <Button
                onClick={async () => {
                  await getPresentationsSessions()
                  await getPresentations()
                }}
                color='success'
                className='action-button --refresh-sessions'
              >
                <i className='ri-refresh-line align-middle fw-medium' />
              </Button>
            </div>
          </Col>
        </Row>
        <div className='table-divider' />
        <Row>
          <table className='table align-middle mb-0'>
            <thead>
            <tr>
              {/*<th>Id</th>*/}
              <th>Link Name</th>
              <th>Company Name</th>
              <th>Sales Name</th>
              <th>Presentation Name</th>
              <th className='text-center'>Session Link</th>
              <th>Session Finished</th>
              <th>Session Actions</th>
            </tr>
            </thead>
            <tbody>
            {visibleItems.map((presentation, index) => {
              return (
                <tr key={index}>
                  {/*<td>{presentation?.id}</td>*/}
                  <td>{presentation?.linkName}</td>
                  <td>{presentation?.company_name}</td>
                  <td>{presentation?.sales_name}</td>
                  <td>{presentation.name}</td>
                  <td>
                    <Button
                      className='action-button m-auto'
                      onClick={() => openPresentationHandler(presentation.link)}
                    >
                      <i className='ri-slideshow-2-line align-middle fw-medium' />
                    </Button>
                  </td>
                  <td>{presentation.finished ? 'Yes' : 'No'}</td>

                  <td>
                    <div className='action-buttons'>

                      <Button
                        className='action-button --with-text'
                        color='success'
                        onClick={() => openFinishSessionModalHandler(presentation.id)}
                        disabled={!!presentation.finished}
                      >
                        <i className='ri-check-line align-middle fw-medium' />
                        Finish session
                      </Button>

                      <MoreMenu minContentWidth={'10rem'} size={'1.25rem'}>
                        <MoreMenuItem
                          onClick={() => openSessionAnswersHandler(presentation.id)}
                          icon={'ri-file-code-line align-middle fw-medium'}
                        >
                          Values
                        </MoreMenuItem>
                        <MoreMenuItem
                          onClick={() => openSlidesNotesModalHandler(presentation.id)}
                          icon={'ri-file-list-3-line align-middle fw-medium'}
                        >
                          Notes
                        </MoreMenuItem>
                        <MoreMenuItem
                          onClick={() => resolveReadonlySession(presentation.id)}
                          icon={'ri-book-read-line'}
                        >
                          Readonly
                        </MoreMenuItem>
                        <MoreMenuItem
                          className={'--delete-folder'}
                          onClick={() => deletePresentationSessionClick(presentation.id)}
                          icon={'ri-delete-bin-line align-middle fw-medium'}
                        >
                          Remove
                        </MoreMenuItem>
                      </MoreMenu>


                    </div>
                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </Row>
        {deletePresentation && (
          <DeleteModal
            onDeleteClick={onDeleteClick}
            onCloseClick={onDeleteCloseClick}
            show={deletePresentation}
          />
        )}
        {isCreateSession && (
          <CreateSessionModal
            show={isCreateSession}
            onAdd={onAddPresentation}
            control={control}
            onClose={onAddPresentationCloseClick}
            items={presentations}
          />
        )}
        {showFinishSessionModal && (
          <CustomModal
            isShow={showFinishSessionModal}
            onClick={confirmFinishSessionModal}
            onCloseClick={closeFinishSessionModalHandler}
            confirmButtonColor={'btn-success'}
          >
            <div className='text-center mt-2'>
              <h4>Are you sure?</h4>
              <div className='text-muted mx-4 mb-0 fs-14'>Do you want to finish session?</div>
            </div>
          </CustomModal>
        )}
        {showSlidesNotesModal && (
          <CustomModal isShow={showSlidesNotesModal} onCloseClick={closeSlidesNotesModalHandler}>
            <div className='text-center mt-2'>
              <h4>Slides notes</h4>
              {slidesNotes &&
                slidesNotes.map((slide) => (
                  <div key={slide.slide}>
                    <h5>Slide №{slide.slide}</h5>
                    <ul className='text-start'>
                      {slide.notes ? (
                        slide.notes.map((note) => <li key={note.id}>{note.note}</li>)
                      ) : (
                        <div>Slide doesn't have notes</div>
                      )}
                    </ul>
                  </div>
                ))}
            </div>
          </CustomModal>
        )}
        {
          showAnswersModal && <CustomModal isShow={showAnswersModal} onCloseClick={closeSessionAnswersHandler}>
            <div className='text-center mt-2'>
              <h4>Presentation session values</h4>
              {sessionAnswers && <table className={'table mb-0 align-middle'}>
                <thead>
                <tr>
                  <th>Figure name</th>
                  <th>Label</th>
                  <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {sessionAnswers.filter(answer => answer.figureName !== 'personalization').map((answer, index) => (
                  <tr key={index}>
                    <td>{answer.figureName}</td>
                    <td>{answer.label}</td>
                    <td>{answer.value}</td>
                  </tr>
                ))}
                </tbody>
              </table>}
            </div>
          </CustomModal>
        }


        <Pagination currentPage={currentPage} pageAmount={pageAmount} itemsOnPage={itemsOnPage} />
      </Container>
    </div>
  )
}

export default Sessions
