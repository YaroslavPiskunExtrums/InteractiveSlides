import './tag.styles.scss'
import { TagWithPresentationsType, useTagsStore } from '../presentation-tag.store'
import classNames from 'src/lib/util/classNames'
import MoreMenu from 'src/Components/Common/MoreMenu/MoreMenu'
import MoreMenuItem from 'src/Components/Common/MoreMenu/MoreMenuItem'

type PropsType = {
  tag: TagWithPresentationsType,
  openEditTagModal?: (tagId: number) => void
  openDeleteTagModal?: (tagId: number) => void
}

const Tag = (props: PropsType) => {
  const { selectedTag, setSelectedTag } = useTagsStore()

  const onSelectTag = () => {
    if (selectedTag === props.tag.id) {
      setSelectedTag(null)
    } else {
      setSelectedTag(props.tag.id)
    }
  }

  return (
    <div
      className={classNames('tag', `${selectedTag === props.tag.id ? '--selected' : ''}`)}
      onClick={onSelectTag}
    >
      <p className="tag_title">{props.tag.tag_title}</p>
      <p className="tag_length">({props.tag.presentations.length})</p>

      <MoreMenu className={"tag_menu"} size={"1rem"}>
        <MoreMenuItem onClick={()=> props.openEditTagModal(props.tag.id)} className={'--rename-item'} icon={"ri-pencil-line align-middle fw-medium"}>
          Rename
        </MoreMenuItem>
        <MoreMenuItem onClick={()=>props.openDeleteTagModal(props.tag.id)} className={'--delete-item'} icon={'ri-delete-bin-line align-middle fw-medium'}>
          Delete
        </MoreMenuItem>
      </MoreMenu>
    </div>
  )
}

export default Tag
