'use client'

import { useActionState, useState, useEffect, useTransition } from 'react'
import { addContributor, removeContributor } from '@/app/actions/projects'
import { searchUsers } from '@/app/actions/users'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Project, User } from '@/app/lib/definitions'

export function ContributorsManager({ project }: { project: Project }) {
    const addContributorWithId = addContributor.bind(null, project.id)
    const [state, action, pending] = useActionState(addContributorWithId, undefined)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<User[]>([])
    const [, startTransition] = useTransition()

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }
        const timeout = setTimeout(async () => {
            const users = await searchUsers(query)
            const memberIds = project.members.map((m) => m.user.id)
            setResults(users.filter((user) => !memberIds.includes(user.id)))
        }, 300)
        return () => clearTimeout(timeout)
    }, [query, project.members])

    function handleRemove(userId: string) {
        startTransition(() => {
            removeContributor(project.id, userId)
        })
    }

    return (
        <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Contributeurs</h3>
            <ul className="flex flex-col gap-2">
                {project.members.map((member) => (
                    <li key={member.id} className="flex items-center justify-between text-sm">
                        <span>{member.user.name} <span className="text-(--neutral-grey)">({member.role})</span></span>
                        {member.role !== 'OWNER' && (
                            <button onClick={() => handleRemove(member.user.id)} className="text-(--error-red) text-xs cursor-pointer">
                                Retirer
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <form action={action} className="flex flex-col gap-2">
                {state?.message && <ErrorMessage message={state.message} />}
                <div className="relative flex gap-2">
                    <input
                        type="text"
                        name="email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nom ou email"
                        autoComplete="off"
                        className="flex-1 border border-(--form-grey) rounded px-3 py-2 text-sm"
                    />
                    <select name="role" defaultValue="CONTRIBUTOR" className="border border-(--form-grey) rounded px-2 text-sm">
                        <option value="CONTRIBUTOR">Contributeur</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button type="submit" className="px-4 rounded bg-(--light-orange) text-sm cursor-pointer">
                        {pending ? '...' : 'Ajouter'}
                    </button>
                    {results.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-(--form-grey) rounded z-10 max-h-40 overflow-auto">
                            {results.map((user) => (
                                <li key={user.id}>
                                    <button
                                        type="button"
                                        onClick={() => setQuery(user.email)}
                                        className="w-full text-left px-3 py-2 hover:bg-(--light-orange) text-sm cursor-pointer"
                                    >
                                        {user.name} <span className="text-(--neutral-grey)">({user.email})</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
        </div>
    )
}