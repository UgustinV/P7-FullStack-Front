'use client'

import { useTransition } from 'react'
import { deleteProject } from '@/app/actions/projects'

export function DeleteProjectButton({ projectId }: { projectId: string }) {
    const [pending, startTransition] = useTransition()

    function handleDelete() {
        if (!confirm('Supprimer définitivement ce projet ?')) return
        startTransition(() => {
            deleteProject(projectId)
        })
    }

    return (
        <button onClick={handleDelete} disabled={pending} className="text-sm text-(--error-red) underline cursor-pointer">
            {pending ? 'Suppression...' : 'Supprimer'}
        </button>
    )
}