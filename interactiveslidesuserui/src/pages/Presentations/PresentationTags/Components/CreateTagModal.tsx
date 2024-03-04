import { MouseEvent } from 'react'
import ModalWrapper from './ModalWrapper'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from './Input'
import { useTagsStore } from '../presentation-tag.store'
import { tagFormSchema } from './tags.resolver'

type PropsType = {
  isOpen: boolean
  onCloseModal: (e?: MouseEvent<HTMLButtonElement>) => void
}

type CreateTagForm = {
  tag_title?: string
}

const CreateTagModal = (props: PropsType) => {
  const { createTag } = useTagsStore()

  const { control, watch, reset } = useForm<CreateTagForm>({
    mode: 'onChange',
    defaultValues: { tag_title: '' },
    resolver: yupResolver(tagFormSchema),
  })

  const onSaveTag = async () => {
    const tag_title = watch('tag_title')
    createTag({ tag_title })
    props.onCloseModal()
    reset()
  }

  return (
    <ModalWrapper
      isOpen={props.isOpen}
      onCloseModal={props.onCloseModal}
      onSave={onSaveTag}
      title="Create new folder"
    >
      <Input control={control} label="Folder title" name="tag_title" placeholder="Folder title" />
    </ModalWrapper>
  )
}

export default CreateTagModal
