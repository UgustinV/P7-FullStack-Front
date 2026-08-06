'use client'

import { useActionState, useState, useEffect } from 'react'
import { createTask } from '@/app/actions/tasks'
import { FormField } from '@/components/FormField'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/Button'
import { ProjectMember } from '@/app/lib/definitions'

export function CreateTaskModal({ projectId, members }: { projectId: string; members: ProjectMember[] }) {
    const [open, setOpen] = useState(false)
    const createTaskWithId = createTask.bind(null, projectId)
    const [state, action, pending] = useActionState(createTaskWithId, undefined)

    useEffect(() => {
        if (state?.success) setOpen(false)
    }, [state])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-white bg-(--button-grey) rounded-[10px] px-6 py-3 self-start cursor-pointer"
            >
                Créer une tâche
            </button>
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-[10px] p-8 w-140 max-h-[85vh] overflow-auto flex flex-col gap-5">
                        {state?.message && <ErrorMessage message={state.message} />}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Nouvelle tâche</h2>
                            <button onClick={() => setOpen(false)} aria-label="Fermer" className="cursor-pointer">✕</button>
                        </div>
                        <form action={action} className="flex flex-col gap-4">
                            <FormField label="Titre" id="title" type="text" name="title" required error={state?.errors?.title} />
                            <div className="flex flex-col w-full">
                                <label htmlFor="description" className="mb-2">Description</label>
                                <textarea id="description" name="description" rows={3} className="border border-(--form-grey) rounded px-3 py-3" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="priority" className="mb-2">Priorité</label>
                                    <select id="priority" name="priority" defaultValue="MEDIUM" className="border border-(--form-grey) rounded px-3 py-3">
                                        <option value="LOW">Basse</option>
                                        <option value="MEDIUM">Moyenne</option>
                                        <option value="HIGH">Haute</option>
                                        <option value="URGENT">Urgente</option>
                                    </select>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="dueDate" className="mb-2">Échéance</label>
                                    <input id="dueDate" name="dueDate" type="date" className="border border-(--form-grey) rounded px-3 py-3" />
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-2">Assignés</label>
                                <div className="flex flex-wrap gap-3">
                                    {members.map((member) => (
                                        <label key={member.id} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" name="assigneeIds" value={member.user.id} />
                                            {member.user.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-row w-full justify-between">
                                <label htmlFor="todo" className="cursor-pointer">
                                    <input id='todo' className='hidden peer' type="radio" name="status" value="TODO" defaultChecked />
                                    <span className="flex items-center gap-2 text-sm text-(--error-red) bg-(--error-red-light) rounded px-3 py-3 peer-checked:border peer-checked:border-(--error-red)">
                                        À faire
                                    </span>
                                </label>
                                <label htmlFor="in-progress" className="cursor-pointer">
                                    <input id='in-progress' className='hidden peer' type="radio" name="status" value="IN_PROGRESS" />
                                    <span className="flex items-center gap-2 text-sm bg-(--success-green-light) rounded px-3 py-3 peer-checked:border peer-checked:border-(--success-green)">
                                        En cours
                                    </span>
                                </label>
                                <label htmlFor="done" className="cursor-pointer">
                                    <input id='done' className='hidden peer' type="radio" name="status" value="DONE" />
                                    <span className="flex items-center gap-2 text-sm text-(--success-green) bg-(--success-green-light) rounded px-3 py-3 peer-checked:border peer-checked:border-(--success-green)">
                                        Terminée
                                    </span>
                                </label>
                            </div>
                            <Button style="w-full py-3" content={pending ? 'Création...' : 'Créer la tâche'} />
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}