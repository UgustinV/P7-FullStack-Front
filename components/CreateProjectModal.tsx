'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { createProject } from '@/app/actions/projects'
import { searchUsers } from '@/app/actions/users'
import { FormField } from '@/components/FormField'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Modal } from '@/components/Modal'
import { User } from '@/app/lib/definitions'

export function CreateProjectModal() {
    const [open, setOpen] = useState(false)
    const [contributors, setContributors] = useState<User[]>([])
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<User[]>([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [state, action, pending] = useActionState(createProject, undefined)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (state?.success) {
            setOpen(false)
            setContributors([])
            setQuery('')
            setResults([])
            setDropdownOpen(false)
        }
    }, [state])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }
        const timeout = setTimeout(async () => {
            const users = await searchUsers(query)
            setResults(users)
        }, 300)
        return () => clearTimeout(timeout)
    }, [query])

    // close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function toggleContributor(user: User, checked: boolean) {
        if (checked) {
            setContributors([...contributors, user])
        } else {
            setContributors(contributors.filter((c) => c.id !== user.id))
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-white bg-(--button-grey) w-full rounded-[10px] px-3 py-2.5 text-sm lg:w-auto lg:text-base lg:px-6 lg:py-3 cursor-pointer"
            >
                Créer un projet
            </button>
            <Modal open={open} onClose={() => setOpen(false)} title="Créer un projet">
                {state?.message && <ErrorMessage message={state.message} />}
                <form action={action} className="flex flex-col gap-4">
                    <FormField
                        label="Titre*"
                        id="name"
                        type="text"
                        name="name"
                        placeholder=""
                        required
                        error={state?.errors?.name}
                    />
                    <FormField
                        label="Description*"
                        id="description"
                        type="text"
                        name="description"
                        placeholder=""
                        required
                        error={state?.errors?.description}
                    />
                    <div className="flex flex-col w-full" ref={dropdownRef}>
                        <span className="mb-2">Contributeurs</span>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((v) => !v)}
                                className="w-full h-12.5 text-left text-xs text-(--neutral-grey) border border-(--form-grey) rounded px-3 py-3 cursor-pointer"
                            >
                                {contributors.length > 0
                                    ? `${contributors.length} sélectionné(s)`
                                    : 'Choisir un ou plusieurs contributeurs'}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-(--form-grey) rounded z-10 p-2 flex flex-col gap-2">
                                    <label htmlFor="contributor" className="sr-only">Contributeurs</label>
                                    <input
                                        id="contributor"
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Nom ou email"
                                        autoComplete="off"
                                        className="w-full border border-(--form-grey) rounded px-3 py-2"
                                    />
                                    <ul className="max-h-40 overflow-auto">
                                        {results.map((user) => {
                                            const checked = contributors.some((c) => c.id === user.id)
                                            return (
                                                <li key={user.id}>
                                                    <label className="flex items-center gap-2 px-3 py-2 hover:bg-(--light-orange) cursor-pointer rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={(e) => toggleContributor(user, e.target.checked)}
                                                        />
                                                        {user.name} <span className="text-(--neutral-grey)">({user.email})</span>
                                                    </label>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 mb-2">
                            {contributors.map((user) => (
                                <span key={user.id} className="flex items-center gap-2 text-xs bg-(--light-orange) rounded-full px-3 py-1">
                                    {user.name}
                                    <button
                                        type="button"
                                        onClick={() => setContributors(contributors.filter((c) => c.id !== user.id))}
                                        className="cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                    <input type="hidden" name="contributors" value={user.email} />
                                </span>
                            ))}
                        </div>
                        {state?.errors?.contributors && (
                            <ErrorMessage message={state.errors.contributors.join(', ')} />
                        )}
                    </div>
                    <button className={`text-white bg-(--button-grey) rounded-[10px] w-fit px-4.5 py-3.75 cursor-pointer ${pending ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={pending}>
                        {pending ? 'Ajout en cours...' : 'Ajouter un projet'}
                    </button>
                </form>
            </Modal>
        </>
    )
}