import React, { useEffect, useState } from 'react'
import { useTagsStore } from './presentation-tag.store'
import Tag from './Components/Tag'
import './presentationTags.styles.scss'
import CreateTagModal from './Components/CreateTagModal'
import EditTagModal from 'src/pages/Presentations/PresentationTags/Components/EditTagModal'
import DeleteModal from 'src/Components/Common/DeleteModal'

const PresentationTags = () => {
  const { tags, getTags, setEditedTag, removeTag, editedTag, setSelectedTag } = useTagsStore()

  const [isOpenCreateTagModal, setIsOpenCreateTagModal] = useState(false)
  const [isEditTagModal, setIsEditTagModal] = useState(false)
  const [isDeleteTagModal, setIsDeleteTagModal] = useState(false)

  useEffect(() => {
    getTags()
  }, [])

  const onCloseCreateTagModal = () => {
    setIsOpenCreateTagModal(false)
  }
  const onOpenCreateTagModal = () => {
    setIsOpenCreateTagModal(true)
  }

  const onOpenEditTagModal = (tagId: number) => {
    setEditedTag(tagId)
    setIsEditTagModal(true)
  }
  const onCloseEditTagModal = () => {
    setIsEditTagModal(false)
    setEditedTag(null)
  }

  const onDeleteClick = (tagId: number) => {
    setEditedTag(tagId)
    setIsDeleteTagModal(true)
  }

  const onDeleteTag = async () => {
    await removeTag({ tag_id: editedTag })
    setIsDeleteTagModal(false)
    setEditedTag(null)
  }

  const onDeleteCloseClick = () => {
    setIsDeleteTagModal(false)
  }

  return (
    <>
      <div className="page-title-box presentationTags">
        <div className="presentationTags-titleWrapper">
          <div className="presentationTags-titleWrapper-title">Folders</div>
          <button
            className="presentationTags-titleWrapper-clearBtn"
            onClick={() => setSelectedTag(null)}
          >
            Clear filtration
          </button>
        </div>
        <div className="presentationTags-container">
          {/* TODO: tooltip for btn */}
          <button className="presentationTags-container_btn" onClick={onOpenCreateTagModal}>
            <i className="ri-add-line" />
            <span className="presentationTags-container_btn-text">Create new folder</span>
          </button>
          {tags.map((tag) => (
            <Tag
              openDeleteTagModal={onDeleteClick}
              openEditTagModal={onOpenEditTagModal}
              key={tag.id}
              tag={tag}
            />
          ))}
        </div>
      </div>
      {isOpenCreateTagModal && (
        <CreateTagModal isOpen={isOpenCreateTagModal} onCloseModal={onCloseCreateTagModal} />
      )}
      {isEditTagModal && (
        <EditTagModal isOpen={isEditTagModal} onCloseModal={onCloseEditTagModal} />
      )}
      {isDeleteTagModal && (
        <DeleteModal
          onDeleteClick={onDeleteTag}
          onCloseClick={onDeleteCloseClick}
          show={isDeleteTagModal}
        />
      )}
    </>
  )
}

export default PresentationTags
