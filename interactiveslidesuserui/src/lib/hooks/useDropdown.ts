import { MouseEvent, RefObject, useEffect, useState } from 'react'

function useDropdown<T extends HTMLElement = HTMLElement>(dropdownRef: RefObject<T>, searchRef: RefObject<T> | null): [isOpen: boolean, toggleDropdownHandler: (e: MouseEvent<HTMLDivElement>) => void] {
	const [isOpen, setIsOpen] = useState(false)

	const closeDropdownFromOutside = (e: Event) => {
		const el = dropdownRef?.current
		if (!el || el.contains(e.target as Node)) {
			return
		}
		setIsOpen(false)
	}

	useEffect(() => {
		const body = document.body
		body.addEventListener('click', closeDropdownFromOutside)
		return () => {
			body.removeEventListener('click', closeDropdownFromOutside)
		}
	}, [])

	const toggleDropdownHandler = (e: MouseEvent<HTMLDivElement>) => {
		const searchEl = searchRef.current
		if (searchEl && searchEl.contains(e.target as Node)) {
			return
		}

		setIsOpen(prev => !prev)
	}

	return [isOpen, toggleDropdownHandler]
}

export { useDropdown }