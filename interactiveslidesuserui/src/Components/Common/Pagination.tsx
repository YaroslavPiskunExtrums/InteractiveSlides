import { css } from '@emotion/css'
import { ChangeEvent, useEffect, useState } from 'react'
import classNames from 'src/lib/util/classNames'

type PropsType = {
  currentPage: {
    value: number
    onChange: (newPage: number) => void
  }
  pageAmount: number

  itemsOnPage?: {
    onChange: (itemsNumber: number) => void
    value: number
  }
}

export const pageOptions = [5, 10, 20, 30, 40, 50]

const Pagination = (props: PropsType) => {
  const [pages, setPages] = useState<number[]>([1])

  const onChangeItemsOnPage = (e: ChangeEvent<HTMLSelectElement>) => {
    props.itemsOnPage?.onChange(Number(e.target.value))
  }

  useEffect(() => {
    let pages = []
    for (let i = 1; i <= props.pageAmount; i++) {
      pages.push(i)
    }

    setPages(pages)
  }, [props.pageAmount])

  const incrementCurrentPage = () => {
    props.currentPage.onChange(props.currentPage.value + 1)
  }

  const decrementCurrentPage = () => {
    props.currentPage.onChange(props.currentPage.value - 1)
  }

  const onChoosePageHandler = (page: number) => {
    props.currentPage.onChange(page)
  }

  const style = {
    primaryColors: css`
      border: 1px solid #ced4da;
      background: transparent;
      color: black;
      &:hover {
        background: #ced4da;
        color: black;
        border-color: #ced4da;
      }
    `,
    secondaryColors: css`
      border: 2px solid #3577f1;
      background: #3577f1;
      color: white;
      &:hover {
        background: #2d65cd;
        color: white;
        border-color: #2d65cd;
      }
    `,

    common: css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 35px;
      padding: 2px 0;
      transition: all 0.25s ease-in-out;
      &:hover {
        transition: all 0.25s ease-in-out;
      }
    `,
    container: css`
      display: flex;
      justify-content: center;
      margin-top: 20px;
    `,
    pageContainer: css`
      display: flex;
    `,
    leftArrow: css`
      border-radius: 10px 0 0 10px;
    `,
    rightArrow: css`
      border-radius: 0 10px 10px 0;
    `,
    icon: css`
      font-size: 16px;
    `,
    disabledBtn: css`
      opacity: 30%;
    `,
    cursor: css`
      cursor: pointer;
    `,
    select: css`
      width: 80px;
      margin-left: 10px;
      cursor: pointer;
    `,
  }

  return (
    <div className={style.container}>
      <button
        onClick={decrementCurrentPage}
        disabled={props.currentPage.value <= 1}
        className={classNames(
          style.leftArrow,
          style.common,
          style.primaryColors,
          props.currentPage.value <= 1 ? style.disabledBtn : ''
        )}
      >
        <i className={classNames('ri-arrow-left-line', style.icon)} />
      </button>
      <div className={style.pageContainer}>
        {pages.map((page, index, arr) => {
          const Elem = (
            <div
              key={page}
              onClick={() => onChoosePageHandler(page)}
              className={
                props.currentPage.value === page
                  ? classNames(style.secondaryColors, style.common, style.cursor)
                  : classNames(style.primaryColors, style.common, style.cursor)
              }
            >
              {page}
            </div>
          )

          const Ellipsis = (
            <div key={page} className={classNames(style.common)}>
              ...
            </div>
          )

          const isFirstPage = index === 0
          const isLastPage = index === arr.length - 1
          const isCurrentPage = props.currentPage.value === page
          const transitionalPage = {
            currentPageLess: props.currentPage.value < 5,
            currentPageMore: props.currentPage.value > arr.length - 4,
          }

          if (arr.length < 8) {
            return Elem
          }

          if (isFirstPage || isLastPage || isCurrentPage) {
            return Elem
          }

          if (
            (transitionalPage.currentPageLess && page < 6) ||
            (transitionalPage.currentPageMore && page > arr.length - 5)
          ) {
            return Elem
          }

          if (
            props.currentPage.value > 4 &&
            props.currentPage.value < arr.length - 3 &&
            (page === props.currentPage.value - 1 || page === props.currentPage.value + 1)
          ) {
            return Elem
          }

          if (
            (transitionalPage.currentPageLess && page === 6) ||
            (transitionalPage.currentPageMore && page === arr.length - 5)
          ) {
            return Ellipsis
          }

          if (
            props.currentPage.value > 4 &&
            props.currentPage.value < arr.length - 3 &&
            (page === props.currentPage.value - 2 || page === props.currentPage.value + 2)
          ) {
            return Ellipsis
          }
        })}
      </div>
      <button
        onClick={incrementCurrentPage}
        disabled={props.pageAmount <= props.currentPage.value}
        className={classNames(
          style.rightArrow,
          style.common,
          style.primaryColors,
          props.pageAmount <= props.currentPage.value ? style.disabledBtn : ''
        )}
      >
        <i className={classNames('ri-arrow-right-line', style.icon)} />
      </button>

      {props.itemsOnPage && (
        <select
          name="option"
          onChange={onChangeItemsOnPage}
          className={classNames('form-select', style.select)}
          defaultValue={props.itemsOnPage?.value}
        >
          {pageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export default Pagination
