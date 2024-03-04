import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay?: number, depends?: any[] | undefined): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

		return () => {
			clearTimeout(timer)
		}

	}, depends ? [...depends, delay] : [value, delay])

	return debouncedValue
}