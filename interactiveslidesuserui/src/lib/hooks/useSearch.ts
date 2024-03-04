import { useState } from 'react'
import { useDebounce } from './useDebounce'

type SearchValuesType = {
	[key: string]: string
}

type onChangeType = {
	[key: string]: (newValue: string) => void
}

function useSearchDebounce<T>(items: T[], fieldForSearching: string[]): {
	filteredItem: T[],
	searchValue: SearchValuesType,
	onChange: onChangeType
} {

	const [searchValue, setSearchValue] = useState<SearchValuesType>(fieldForSearching.reduce((acc, rec) => {
		if (rec in acc) {
			return acc
		}
		return { ...acc, [rec]: '' }
	}, {}))


	const onChange = fieldForSearching.reduce<onChangeType>((acc, rec) => {
		if (rec in acc) {
			return acc
		}
		return {
			...acc, [rec]: (newValue: string) => {
				setSearchValue(prev => {
					const stateCopy = { ...prev }
					stateCopy[rec] = newValue
					return stateCopy
				})
			}
		}
	}, {})



	const filteredItem = useDebounce(
		items.filter(item => {

			return fieldForSearching.every((field) =>
				item[field]?.toLowerCase()?.includes(searchValue?.[field]?.toLowerCase())
			)
		}),
		100,
		[...Object.values(searchValue), items]
	)

	return { searchValue, onChange, filteredItem }
}

export { useSearchDebounce }