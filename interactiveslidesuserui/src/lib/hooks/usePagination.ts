import { useEffect, useState } from 'react'
import { pageOptions } from 'src/Components/Common/Pagination'

function usePagination<T, V extends string>(items: T[], options?: { itemsOnPageKey: V }) {
	const itemsOnPresentationPage = Number(localStorage.getItem(options?.itemsOnPageKey))

	const [pageAmount, setPageAmount] = useState<number>(0)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [visibleItems, setVisibleItems] = useState<T[]>([])
	const [itemsNumberOnPage, setItemsNumbersOnPage] = useState(itemsOnPresentationPage || pageOptions[0])

	if (!itemsOnPresentationPage && options?.itemsOnPageKey) {
		localStorage.setItem(options?.itemsOnPageKey, `${itemsNumberOnPage}`)
	}

	const onChangeItemsNumberOnPage = (itemsNumber: number) => {
		setItemsNumbersOnPage(itemsNumber)

		if (!options?.itemsOnPageKey) return
		localStorage.setItem(options?.itemsOnPageKey, `${itemsNumber}`)
	}

	const onChangeCurrentPage = (newPage: number) => {
		setCurrentPage(newPage)
	}

	useEffect(() => {
		const pageAmount = Math.ceil(items.length / itemsNumberOnPage)
		setPageAmount(pageAmount)
	}, [items, itemsNumberOnPage])

	useEffect(() => {
		if (currentPage > pageAmount) {
			setCurrentPage(pageAmount)
		} else {
			setCurrentPage(1)
		}
	}, [pageAmount, itemsNumberOnPage])


	useEffect(() => {
		const itemsRange = {
			min: currentPage * itemsNumberOnPage - itemsNumberOnPage,
			max: currentPage * itemsNumberOnPage - 1
		}

		setVisibleItems(items.filter((_, index) => index >= itemsRange.min && index <= itemsRange.max))

	}, [items, currentPage, itemsNumberOnPage])

	return {
		currentPage: {
			value: currentPage,
			onChange: onChangeCurrentPage
		},
		pageAmount,
		visibleItems,
		itemsOnPage: {
			onChange: onChangeItemsNumberOnPage,
			value: itemsNumberOnPage
		}
	}
}

export { usePagination }