import ModalWrapper from 'src/pages/Presentations/PresentationTags/Components/ModalWrapper'
import Input from './Input'
import { useTagsStore } from 'src/pages/Presentations/PresentationTags/presentation-tag.store'
import { MouseEvent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { tagFormSchema } from 'src/pages/Presentations/PresentationTags/Components/tags.resolver'

type PropsType = {
  isOpen: boolean
  onCloseModal: (e?: MouseEvent<HTMLButtonElement>) => void
}

type EditTagModalProps = {
  tag_title?: string
}

const EditTagModal = (props: PropsType) => {
  const { updateTagTitle, editedTag, tags } = useTagsStore()


  const { control, watch, reset } = useForm<EditTagModalProps>({
    mode: 'onChange',
    defaultValues: { tag_title: tags.find(tag => tag.id === editedTag)?.tag_title },
    resolver: yupResolver(tagFormSchema),
  })
  const onSaveTag = async () => {
    const tag_title = watch('tag_title')
    await updateTagTitle({ tag_id: editedTag, tag_title })
    props.onCloseModal()
    reset()
  }

  return (
    <ModalWrapper
      isOpen={props.isOpen}
      onCloseModal={props.onCloseModal}
      onSave={onSaveTag}
      title='Rename folder'
    >
      <Input control={control} label='Folder title' name='tag_title' placeholder='Folder title' />
    </ModalWrapper>
  )
}




export default EditTagModal