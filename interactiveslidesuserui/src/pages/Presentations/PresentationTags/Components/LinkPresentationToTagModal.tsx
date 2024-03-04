import { MouseEvent } from 'react'
import usePresentationStore from '../../presentation.store'
import { useTagsStore } from '../presentation-tag.store'
import ModalWrapper from './ModalWrapper'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { linkPresentationToTagSchema } from './tags.resolver'

type PropsType = {
  isOpen: boolean
  onCloseModal: (e?: MouseEvent<HTMLButtonElement>) => void
}

type LinkPresentationToTagFormType = {
  tag_id?: number
  presentation_id?: string
}

const LinkPresentationToTagModal = (props: PropsType) => {
  const { tags, linkPresentationToTag, selectedPresentationId } = useTagsStore()
  const { presentations } = usePresentationStore()

  const { control, watch, reset } = useForm<LinkPresentationToTagFormType>({
    mode: 'onChange',
    defaultValues: {
      presentation_id: selectedPresentationId,
      tag_id:
        tags.find(
          (tag) =>
            tag.presentations?.some((presentation) => presentation?.id === selectedPresentationId)
        )?.id ?? -1,
    },
    resolver: yupResolver(linkPresentationToTagSchema),
  })

  const onSaveLinkPresentationToTag = async () => {
    const { presentation_id, tag_id } = watch()

    await linkPresentationToTag({ tag_id, presentation_id })

    props.onCloseModal()
    reset()
  }

  return (
    <ModalWrapper
      isOpen={props.isOpen}
      onCloseModal={props.onCloseModal}
      onSave={onSaveLinkPresentationToTag}
      title='Link presentation to folder'
    >
      <div>
        <label htmlFor='tag_id' className='form-label'>
          Presentation: {' '}
          {presentations.find((presentation) => presentation.id === selectedPresentationId)?.name}
        </label>
        {tags && (
          <Controller
            name='tag_id'
            control={control}
            render={({ field: { value, onChange } }) => (
              <select onChange={onChange} name="tag_id" className="form-select" value={value}>
                {[{ id: -1, tag_title: 'Null' }, ...tags].map((tag, index) => (
                  <option key={index} value={tag.id}>
                    {tag.tag_title}
                  </option>
                ))}
              </select>
            )}
          />
        )}
      </div>
    </ModalWrapper>
  )
}

export default LinkPresentationToTagModal
