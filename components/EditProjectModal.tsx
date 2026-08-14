'use client'

import { useActionState, useState, useEffect, useRef, useTransition } from 'react'
import { Modal } from '@/components/Modal'
import { updateProject, addContributor, removeContributor } from '@/app/actions/projects'
import { searchUsers } from '@/app/actions/users'
import { FormField } from '@/components/FormField'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/Button'
import { Project, User } from '@/app/lib/definitions'

export function EditProjectModal({ project }: { project: Project }) {
    const [open, setOpen] = useState(false)
    const updateProjectWithId = updateProject.bind(null, project.id)
    const [state, action, pending] = useActionState(updateProjectWithId, undefined)

    const [contributors, setContributors] = useState<User[]>(
        project.members.filter((m) => m.role !== 'OWNER').map((m) => m.user)
    )
    const [roles, setRoles] = useState<Record<string, string>>(
        Object.fromEntries(
            project.members
                .filter((m) => m.role !== 'OWNER')
                .map((m) => [m.user.id, m.role])
        )
    )
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<User[]>([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (state?.success) setOpen(false)
    }, [state])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }
        const timeout = setTimeout(async () => {
            const users = await searchUsers(query)
            setResults(users.filter((u) => u.id !== project.ownerId))
        }, 300)
        return () => clearTimeout(timeout)
    }, [query, project.ownerId])

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
            startTransition(async () => {
                const formData = new FormData()
                formData.set('email', user.email)
                await addContributor(project.id, undefined, formData)
            })
        } else {
            setContributors(contributors.filter((c) => c.id !== user.id))
            startTransition(async () => {
                await removeContributor(project.id, user.id)
            })
        }
    }

    function changeRole(user: User, role: string) {
        setRoles((prev) => ({ ...prev, [user.id]: role }))
        startTransition(async () => {
            await removeContributor(project.id, user.id)
            const formData = new FormData()
            formData.set('email', user.email)
            formData.set('role', role)
            await addContributor(project.id, undefined, formData)
        })
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="text-sm text-(--dark-orange) underline cursor-pointer">
                Modifier
            </button>
            <Modal open={open} onClose={() => setOpen(false)} title="Modifier le projet" className="p-8 w-120">
                {state?.message && <ErrorMessage message={state.message} />}
                <form action={action} className="flex flex-col gap-4">
                    <FormField
                        label="Titre*"
                        id="name"
                        type="text"
                        name="name"
                        defaultValue={project.name}
                        required
                        error={state?.errors?.name}
                    />
                    <FormField
                        label="Description*"
                        id="description"
                        type="text"
                        name="description"
                        defaultValue={project.description}
                        required
                        error={state?.errors?.description}
                    />
                    <div className="flex flex-col w-full" ref={dropdownRef}>
                        <label htmlFor="contributor" className="mb-2">Contributeurs</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((v) => !v)}
                                className="w-full text-left border border-(--form-grey) text-(--neutral-grey) rounded px-3 py-3 cursor-pointer"
                            >
                                {contributors.length > 0
                                    ? `${contributors.length} collaborateur${contributors.length > 1 ? 's' : ''}`
                                    : 'Choisir un ou plusieurs contributeurs'}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-(--form-grey) rounded z-10 p-2 flex flex-col gap-2">
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
                                                            disabled={isPending}
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
                                <div key={user.id} className="flex items-center gap-2 text-xs bg-(--light-orange) rounded-full px-3 py-1">
                                    <span>{user.name}</span>
                                    <select
                                        name="role"
                                        id={`roles-${user.id}`}
                                        value={roles[user.id] ?? 'CONTRIBUTOR'}
                                        disabled={isPending}
                                        onChange={(e) => changeRole(user, e.target.value)}
                                        className="bg-(--light-orange) border-none text-(--neutral-grey) cursor-pointer"
                                    >
                                        <option value="CONTRIBUTOR">Contributor</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => toggleContributor(user, false)}
                                        className="cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button style="w-full py-3" content={pending ? 'Enregistrement...' : 'Enregistrer'} />
                </form>
            </Modal>
        </>
    )
}