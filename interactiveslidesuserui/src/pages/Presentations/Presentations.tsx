import './_presentation.scss'
import { Button, Container, Row } from 'reactstrap'
import DeleteModal from '../../Components/Common/DeleteModal'
import React, { useEffect, useState } from 'react'
import apiUrl from '../../helpers/api_links'
import './_presentation.scss'
import usePresentationStore from './presentation.store'
import { useNavigate } from 'react-router-dom'
import { createPresentationSession, deletePresentation } from 'src/lib/api/html'
import CreateSessionModal from '../Sessions/CreateSessionModal'
import { toast } from 'react-toastify'
import Search from 'src/Components/Common/Search'
import { useSearchDebounce } from 'src/lib/hooks/useSearch'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { CreateSessionFormType } from '../Sessions/Sessions'
import { createSessionSchema } from '../Sessions/session.resolver'
import { usePagination } from 'src/lib/hooks/usePagination'
import Pagination from 'src/Components/Common/Pagination'
import PresentationTags from './PresentationTags/PresentationTags'
import LinkPresentationToTagModal from './PresentationTags/Components/LinkPresentationToTagModal'
import { useTagsStore } from './PresentationTags/presentation-tag.store'
import MoreMenu from 'src/Components/Common/MoreMenu/MoreMenu'
import MoreMenuItem from 'src/Components/Common/MoreMenu/MoreMenuItem'

const Presentations = () => {
  const obj = JSON.parse(sessionStorage.getItem('authUser')).accessToken
  const userObj = JSON.parse(atob(obj.split('.')[1]))
  const navigate = useNavigate()

  const { presentations, downloadPresentations } = usePresentationStore()
  const { setSelectedPresentationId } = useTagsStore()
  const { selectedTag, tags } = useTagsStore()

  const presentationWithFilters = selectedTag
    ? tags.find((tag) => tag.id === selectedTag)?.presentations ?? []
    : presentations.filter((presentation) => !presentation.tags.length)

  const [isDeletePresentation, setDeletePresentation] = useState(false)
  const [isCreateSession, setIsCreateSession] = useState(false)

  const { reset, watch, control, setValue } = useForm<CreateSessionFormType>({
    defaultValues: {
      companyName: '',
      linkName: '',
      salesName: '',
      selectedPresentationId: null,
    },
    resolver: yupResolver(createSessionSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    getPresentations()
  }, [])

  const getPresentations = async () => {
    await downloadPresentations()
  }

  const onDeletePresentationModal = (id: string) => {
    setValue('selectedPresentationId', id)
    setDeletePresentation(true)
  }

  const onDeleteClick = async () => {
    await deletePresentation(watch('selectedPresentationId'))
    await getPresentations()
    setDeletePresentation(false)
    setValue('selectedPresentationId', null)
  }

  const onDeleteCloseClick = () => {
    setDeletePresentation(false)
    setValue('selectedPresentationId', null)
  }

  const openPresentationHandler = (presentationId: string) => {
    window.open(`${apiUrl}/api/HTML/view-presentation-origin/${presentationId}`)
  }

  const openPresentationSettingHandler = (presentationId: string) => {
    navigate(`/presentations-settings/${presentationId}`)
  }

  const openCreatingSessionHandler = (presentationId: string) => {
    setValue('selectedPresentationId', presentationId)
    setIsCreateSession(true)
  }
  const closeCreatingSessionHandler = () => {
    setIsCreateSession(false)
    reset({
      companyName: '',
      linkName: '',
      salesName: '',
      selectedPresentationId: null,
    })
  }

  const createSessionHandler = async () => {
    const { companyName, linkName, salesName, selectedPresentationId } = watch()
    const response = await createPresentationSession(
      selectedPresentationId,
      companyName,
      salesName,
      linkName
    )

    if (response.status !== 200) {
      toast.error('Create session error')
      return
    }

    const res = await response.json()
    window.open(res.link)
    setIsCreateSession(false)

    reset({
      companyName: '',
      linkName: '',
      salesName: '',
      selectedPresentationId: null,
    })
  }

  const { filteredItem, searchValue, onChange } = useSearchDebounce<{
    name: string
    id: string
    presentation_icon: string
  }>(presentationWithFilters, ['name'])

  const { currentPage, pageAmount, visibleItems, itemsOnPage } = usePagination(filteredItem, {
    itemsOnPageKey: 'itemsOnPresentationPage',
  })
  const [isOpenLinkModal, setIsOpenLinkModal] = useState(false)

  const onOpenLinkModal = (presentation_id: string) => {
    setIsOpenLinkModal(true)
    setSelectedPresentationId(presentation_id)
  }
  const onCloseLinkModal = () => {
    setIsOpenLinkModal(false)
    setSelectedPresentationId(null)
  }

  return (
    <>
      <div className="page-content presentations-page flex-auto">
        <Container fluid>
          <PresentationTags />
          <Search
            onChangeSearchValue={onChange['name']}
            searchValue={searchValue['name']}
            placeholder="Search by name"
            withContainer={true}
          />
          <Row>
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th></th>
                  <th className="w-100">Presentation Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((presentation, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          alt=""
                          src={presentation.presentation_icon}
                          style={{ width: '150px' }}
                        />
                      </td>
                      <td>{presentation?.name}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {!userObj?.is_trial_user && (
                            <Button
                              onClick={() => openCreatingSessionHandler(presentation.id)}
                              className="action-button --with-text --add-session"
                              color={'success'}
                            >
                              <i className="ri-slideshow-2-line align-middle fw-medium" />
                              Add session
                            </Button>
                          )}
                          <Button
                            className="action-button --with-text  --preview-presentation"
                            onClick={() => openPresentationHandler(presentation.id)}
                          >
                            <i className="ri-eye-line align-middle fw-medium" />
                            Preview presentation
                          </Button>
                          {!userObj?.is_trial_user && (
                            <MoreMenu minContentWidth={'10rem'} size={'1.25rem'}>
                              <MoreMenuItem
                                onClick={() => openPresentationSettingHandler(presentation.id)}
                                icon={'ri-settings-5-line align-middle fw-medium'}
                              >
                                Settings
                              </MoreMenuItem>
                              <MoreMenuItem
                                onClick={() => onOpenLinkModal(presentation.id)}
                                icon={'ri-folder-line align-middle fw-medium'}
                              >
                                Folder
                              </MoreMenuItem>
                              <MoreMenuItem
                                className={'--delete-folder'}
                                onClick={() => onDeletePresentationModal(presentation.id)}
                                icon={'ri-delete-bin-line align-middle fw-medium'}
                              >
                                Remove
                              </MoreMenuItem>
                            </MoreMenu>
                          )}

                          {/*{!userObj?.is_trial_user && (*/}
                          {/*  <Button*/}
                          {/*    onClick={() => openPresentationSettingHandler(presentation.id)}*/}
                          {/*    className="action-button"*/}
                          {/*  >*/}
                          {/*    <i className="ri-settings-5-line align-middle fw-medium" />*/}
                          {/*  </Button>*/}
                          {/*)}*/}
                          {/*<Button*/}
                          {/*  onClick={() => onOpenLinkModal(presentation.id)}*/}
                          {/*  className="action-button"*/}
                          {/*>*/}
                          {/*  <i className="ri-hashtag align-middle fw-medium" />*/}
                          {/*</Button>*/}
                          {/*<Button*/}
                          {/*  className="action-button --delete-presentation-button"*/}
                          {/*  color="danger"*/}
                          {/*  onClick={() => onDeletePresentationModal(presentation.id)}*/}
                          {/*>*/}
                          {/*  <i className="ri-delete-bin-line align-middle fw-medium" />*/}
                          {/*</Button>*/}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Row>
        </Container>
        <Pagination currentPage={currentPage} pageAmount={pageAmount} itemsOnPage={itemsOnPage} />
      </div>
      {isDeletePresentation && (
        <DeleteModal
          onDeleteClick={onDeleteClick}
          onCloseClick={onDeleteCloseClick}
          show={isDeletePresentation}
        />
      )}
      {isCreateSession && (
        <CreateSessionModal
          presentationName={
            presentationWithFilters.find(
              (presentation) => presentation.id === watch('selectedPresentationId')
            )?.name ?? ' '
          }
          control={control}
          onAdd={() => createSessionHandler()}
          onClose={() => closeCreatingSessionHandler()}
          show={isCreateSession}
        />
      )}
      {isOpenLinkModal && (
        <LinkPresentationToTagModal isOpen={isOpenLinkModal} onCloseModal={onCloseLinkModal} />
      )}
    </>
  )
}

export default Presentations
