'use client'

import { useActionState, useState, useEffect } from 'react'
import { updateProject } from '@/app/actions/projects'
import { FormField } from '@/components/FormField'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/Button'
import { Project } from '@/app/lib/definitions'

export function EditProjectModal({ project }: { project: Project }) {
    const [open, setOpen] = useState(false)
    const updateProjectWithId = updateProject.bind(null, project.id)
    const [state, action, pending] = useActionState(updateProjectWithId, undefined)

    useEffect(() => {
        if (state?.success) setOpen(false)
    }, [state])

    return (
        <>
            <button onClick={() => setOpen(true)} className="text-sm text-(--dark-orange) underline cursor-pointer">
                Modifier
            </button>
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-[10px] p-8 w-120 flex flex-col gap-5">
                        {state?.message && <ErrorMessage message={state.message} />}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Modifier le projet</h2>
                            <button onClick={() => setOpen(false)} aria-label="Fermer" className="cursor-pointer">✕</button>
                        </div>
                        <form action={action} className="flex flex-col gap-4">
                            <FormField
                                label="Nom"
                                id="name"
                                type="text"
                                name="name"
                                defaultValue={project.name}
                                required
                                error={state?.errors?.name}
                            />
                            <div className="flex flex-col w-full">
                                <label htmlFor="description" className="mb-2">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    defaultValue={project.description}
                                    className="border border-(--form-grey) rounded px-3 py-3 mb-2"
                                />
                                {state?.errors?.description && (
                                    <ErrorMessage message={state.errors.description.join(', ')} />
                                )}
                            </div>
                            <Button style="w-full py-3" content={pending ? 'Enregistrement...' : 'Enregistrer'} />
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}