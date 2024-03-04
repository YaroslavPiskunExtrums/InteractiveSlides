import { MouseEvent, RefObject, useEffect, useState } from 'react'

function useDropdown<T extends HTMLElement = HTMLElement>(dropdownRef: RefObject<T>, searchRef?: RefObject<T> | null, answersRef?: RefObject<T> | null, selfClose = true): [isOpen: boolean, toggleDropdownHandler: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void] {
    const [isOpen, setIsOpen] = useState(false)


    const closeDropdownFromOutside = (e: Event) => {
        const el = dropdownRef?.current
        if (!el || el.contains(e.target as Node)) {
            return
        }
        if (!selfClose && answersRef?.current.contains(e.target as Node)) {
            return
        }
        setIsOpen(false)
    }

    useEffect(() => {
        const body = document.body
        body.addEventListener('click', closeDropdownFromOutside)
        body.addEventListener('keydown', closeDropdownFromOutside)

        return () => {
            body.removeEventListener('click', closeDropdownFromOutside)
            body.removeEventListener('keydown', closeDropdownFromOutside)
        }
    }, [])

    const toggleDropdownHandler = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        const searchEl = searchRef?.current
        if (searchEl && searchEl.contains(e.target as Node)) {
            return
        }
        if (selfClose) {
            setIsOpen(prev => !prev)
            return
        }
        if (!isOpen) setIsOpen(prev => !prev)


    }

    return [isOpen, toggleDropdownHandler]
}

export { useDropdown }