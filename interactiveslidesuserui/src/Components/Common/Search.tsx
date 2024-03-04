import { css } from '@emotion/css'
import { ChangeEvent, useRef } from 'react'
import classNames from 'src/lib/util/classNames'

type PropsType = {
  searchValue: string
  onChangeSearchValue: (value: string) => void
  placeholder: string
  withContainer?: boolean
}

const Search = (props: PropsType) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChangeSearchValue(e.target.value)
  }

  const onCleanInput = () => {
    props.onChangeSearchValue('')
  }

  const styles = {
    container: css`
      border: 1px solid #ced4da;
      width: max-content;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      padding: 1px;
    `,
    input: css`
      font-size: 0.8125rem;
      padding: 0.5rem 0.9rem;
      border: none;
      font-weight: 400;
      line-height: 1.5;
    `,
    clearBtn: css`
      cursor: pointer;
      font-size: 20px;
      transition: all 0.25s ease-in-out;
      &:hover {
        scale: 1.2;
        transition: all 0.25s ease-in-out;
        color: red;
      }
    `,
  }

  return (
    <div className={props.withContainer ? 'page-title-box d-flex justify-content-end' : ''}>
      <div className={classNames(styles.container)}>
        <input
          value={props.searchValue}
          onChange={onChangeHandler}
          placeholder={props.placeholder}
          className={styles.input}
        />
        <i className={classNames('ri-close-line', styles.clearBtn)} onClick={onCleanInput} />
      </div>
    </div>
  )
}

export default Search
