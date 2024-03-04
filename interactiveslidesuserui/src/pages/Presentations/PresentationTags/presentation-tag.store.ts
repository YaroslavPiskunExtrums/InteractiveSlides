import { createTag, getTags, linkPresentationToTag, removeTag, updateTagTitle } from 'src/lib/api/tags'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { PresentationType } from '../presentation.store'
import { toast } from 'react-toastify'


export type TagType = {
  company_id: string
  created_at: string
  id: number
  presentations: []
  tag_title: string
  updated_at: string
}

export type TagWithPresentationsType = {
  presentations: PresentationType[]
} & TagType

type PresentationTagsType = {
  tags: TagWithPresentationsType[]
  selectedTag: null | number
  editedTag: null | number
  setSelectedTag(tagId: number | null): void
  setEditedTag(tagId: number | null): void
  selectedPresentationId: string | null
  setSelectedPresentationId(presentationId: string | null): void

  getTags(): Promise<void>
  createTag({ tag_title }: { tag_title: string }): Promise<void>
  linkPresentationToTag({ tag_id, presentation_id }: { tag_id: number, presentation_id: string }): Promise<void>,
  updateTagTitle({ tag_id, tag_title }: { tag_id: number, tag_title: string }): Promise<void>,
  removeTag({ tag_id }: { tag_id: number }): Promise<void>,
}

type A = (state: Partial<PresentationTagsType>) => Partial<PresentationTagsType>
type SetFunction = (arg: Partial<PresentationTagsType> | A) => void

function tagsStore(set: SetFunction, get: () => PresentationTagsType): PresentationTagsType {
  return {
    tags: [],
    selectedPresentationId: null,
    setSelectedTag(tagId) {
      set({ selectedTag: tagId })
    },
    selectedTag: null,
    editedTag: null,
    setEditedTag(tagId) {
      set({ editedTag: tagId })
    },

    setSelectedPresentationId(presentationId) {
      set({ selectedPresentationId: presentationId })
    },

    async getTags() {
      try {
        const res = await getTags()
        set({ tags: res.payload })
      } catch (e) {
        console.log(e)
        set({ tags: [] })
      }
    },
    async createTag({ tag_title }) {
      try {
        const res = await createTag(tag_title)
        set({ tags: [...get().tags, res.payload] })
      } catch (e) {
        console.log(e)
        set({ tags: get().tags })
        toast.error('Create tag error')
      }
    },
    async linkPresentationToTag({ tag_id, presentation_id }) {
      try {
        const res = await linkPresentationToTag(tag_id, presentation_id)
        const tags = get().tags
        const tagsWithUpdatedTag = tags.reduce((acc, rec) => {
          const changedTag = res.payload.find(changedTag => changedTag.id === rec.id)
          console.log(changedTag)

          if (changedTag) {
            return [...acc, changedTag]
          }
          return [...acc, rec]
        }, [])

        set({ tags: tagsWithUpdatedTag })
      } catch (e) {
        console.log(e)
        toast.error('On linking presentation to tag has been error')
      }
    },
    async updateTagTitle({ tag_id, tag_title }) {
      try {
        const res = await updateTagTitle(tag_id, tag_title)
        const tags = get().tags
        if (res.status === 'ok') {
          const tagsWithUpdatedTag = tags.reduce((acc, rec) => {
            if (rec.id === tag_id) {
              return [...acc, res.payload]
            }
            return [...acc, rec]
          }, [])

          set({ tags: tagsWithUpdatedTag })
        }


      } catch (e) {
        console.log(e)
        toast.error('On updating tag title has been error')
      }
    },
    async removeTag({ tag_id }) {
      try {
        const res = await removeTag(tag_id)
        const tags = get().tags

        if (res.status === 'ok') {
          const tagsWithoutRemovedTag = tags.filter(tag => tag.id !== tag_id)

          if (get().selectedTag === tag_id) {
            set({ selectedTag: null })
          }

          set({ tags: tagsWithoutRemovedTag })
        }


      } catch (e) {
        console.log(e)
        toast.error('On removing tag has been error')
      }
    },

  }
}

export const useTagsStore = create<PresentationTagsType>()(
  devtools(tagsStore, {
    name: 'presentation-tags',
  }),
)