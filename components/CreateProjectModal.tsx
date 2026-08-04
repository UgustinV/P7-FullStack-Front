'use client'

import { useActionState, useState, useEffect } from 'react'
import { createProject } from '@/app/actions/projects'
import { searchUsers } from '@/app/actions/users'
import { FormField } from '@/components/FormField'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/Button'
import { User } from '@/app/lib/definitions'

export function CreateProjectModal() {
    const [open, setOpen] = useState(false)
    const [contributors, setContributors] = useState<User[]>([])
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<User[]>([])
    const [state, action, pending] = useActionState(createProject, undefined)

    useEffect(() => {
        if (state?.success) {
            setOpen(false)
            setContributors([])
            setQuery('')
            setResults([])
        }
    }, [state])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }
        const timeout = setTimeout(async () => {
            const users = await searchUsers(query)
            setResults(users.filter((user) => !contributors.some((c) => c.id === user.id)))
        }, 300)
        return () => clearTimeout(timeout)
    }, [query, contributors])

    function addContributor(user: User) {
        setContributors([...contributors, user])
        setQuery('')
        setResults([])
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-white bg-(--button-grey) rounded-[10px] px-6 py-3 cursor-pointer"
            >
                Créer un projet
            </button>
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-[10px] p-8 w-120 relative flex flex-col gap-5">
                        {state?.message && <ErrorMessage message={state.message} />}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Nouveau projet</h2>
                            <button onClick={() => setOpen(false)} aria-label="Fermer" className="cursor-pointer">✕</button>
                        </div>
                        <form action={action} className="flex flex-col gap-4">
                            <FormField
                                label="Nom"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Mon projet"
                                required
                                error={state?.errors?.name}
                            />
                            <div className="flex flex-col w-full">
                                <label htmlFor="description" className="mb-2">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="border border-(--form-grey) rounded px-3 py-3 mb-2"
                                />
                                {state?.errors?.description && (
                                    <ErrorMessage message={state.errors.description.join(', ')} />
                                )}
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="contributor" className="mb-2">Contributeurs</label>
                                <div className="relative">
                                    <input
                                        id="contributor"
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Nom ou email"
                                        autoComplete="off"
                                        className="w-full border border-(--form-grey) rounded px-3 py-3"
                                    />
                                    {results.length > 0 && (
                                        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-(--form-grey) rounded z-10 max-h-40 overflow-auto">
                                            {results.map((user) => (
                                                <li key={user.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => addContributor(user)}
                                                        className="w-full text-left px-3 py-2 hover:bg-(--light-orange) cursor-pointer"
                                                    >
                                                        {user.name} <span className="text-(--neutral-grey)">({user.email})</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
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
                            <Button style="w-full py-3" content={pending ? 'Création...' : 'Créer le projet'} />
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}