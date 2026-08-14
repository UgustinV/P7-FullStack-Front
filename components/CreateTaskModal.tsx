'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { createTask } from '@/app/actions/tasks'
import { FormField } from '@/components/FormField'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/Button'
import { ProjectMember } from '@/app/lib/definitions'
import { Modal } from './Modal'

export function CreateTaskModal({ projectId, members }: { projectId: string; members: ProjectMember[] }) {
    const [open, setOpen] = useState(false)
    const createTaskWithId = createTask.bind(null, projectId)
    const [state, action, pending] = useActionState(createTaskWithId, undefined)
    const [assigneesOpen, setAssigneesOpen] = useState(false)
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
    const assigneesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (assigneesRef.current && !assigneesRef.current.contains(e.target as Node)) {
                setAssigneesOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function toggleAssignee(id: string) {
        setSelectedAssignees((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        )
    }

    useEffect(() => {
        if (state?.success) setOpen(false)
    }, [state])

    return (
        <>
            <button onClick={() => setOpen(true)} className="text-white bg-(--button-grey) rounded-[10px] px-6 py-3 cursor-pointer w-full lg:w-fit">
                Créer une tâche
            </button>
            <Modal open={open} onClose={() => setOpen(false)} title="Créer une tâche">
                {state?.message && <ErrorMessage message={state.message} />}
                <form action={action} className="flex flex-col gap-6">
                    <FormField label="Titre*" id="title" type="text" name="title" required error={state?.errors?.title} />
                    <FormField label="Description*" id="description" type="text" name="description" required error={state?.errors?.description} />
                    <div className="flex flex-col flex-1">
                        <label htmlFor="dueDate" className="mb-2">Échéance</label>
                        <input id="dueDate" name="dueDate" type="date" className="border border-(--form-grey) rounded px-3 py-3 cursor-pointer" />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label htmlFor="priority" className="mb-2">Priorité</label>
                        <select id="priority" name="priority" defaultValue="MEDIUM" className="border border-(--form-grey) rounded px-3 py-3.75 cursor-pointer">
                            <option value="LOW">Basse</option>
                            <option value="MEDIUM">Moyenne</option>
                            <option value="HIGH">Haute</option>
                            <option value="URGENT">Urgente</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-full" ref={assigneesRef}>
                        <label className="mb-2">Assigné à :</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setAssigneesOpen((o) => !o)}
                                className="w-full text-left border border-(--form-grey) rounded px-3 py-3 cursor-pointer"
                            >
                                {selectedAssignees.length > 0
                                    ? members
                                        .filter((m) => selectedAssignees.includes(m.user.id))
                                        .map((m) => m.user.name)
                                        .join(', ')
                                    : 'Sélectionner des membres'}
                            </button>
                            <div className={`absolute z-10 mt-1 w-full max-h-48 overflow-auto border border-(--form-grey) rounded bg-white ${assigneesOpen ? 'block' : 'hidden'}`}>
                                {members.map((member) => (
                                    <label key={member.id} className="flex items-center gap-2 text-sm px-3 py-2 cursor-pointer hover:bg-(--form-grey)">
                                        <input
                                            type="checkbox"
                                            name="assigneeIds"
                                            value={member.user.id}
                                            checked={selectedAssignees.includes(member.user.id)}
                                            onChange={() => toggleAssignee(member.user.id)}
                                        />
                                        {member.user.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="gap-4 flex flex-col mb-8">
                        <label>Statut :</label>
                        <div className="flex flex-row gap-2">
                            <label htmlFor="todo" className="cursor-pointer">
                                <input id='todo' className='hidden peer' type="radio" name="status" value="TODO" defaultChecked />
                                <span className="flex items-center gap-2 text-sm text-(--error-red) bg-(--error-red-light) rounded-full px-4 py-1 peer-checked:border peer-checked:border-(--error-red)">
                                    À faire
                                </span>
                            </label>
                            <label htmlFor="in-progress" className="cursor-pointer">
                                <input id='in-progress' className='hidden peer' type="radio" name="status" value="IN_PROGRESS" />
                                <span className="flex items-center gap-2 text-sm text-(--warning-orange) bg-(--warning-orange-light) rounded-full px-4 py-1 peer-checked:border peer-checked:border-(--warning-orange)">
                                    En cours
                                </span>
                            </label>
                            <label htmlFor="done" className="cursor-pointer">
                                <input id='done' className='hidden peer' type="radio" name="status" value="DONE" />
                                <span className="flex items-center gap-2 text-sm text-(--success-green) bg-(--success-green-light) rounded-full px-4 py-1 peer-checked:border peer-checked:border-(--success-green)">
                                    Terminée
                                </span>
                            </label>
                        </div>
                    </div>
                    <button className={`text-white bg-(--button-grey) rounded-[10px] w-fit px-4.5 py-3.75 cursor-pointer ${pending ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={pending}>
                        {pending ? 'Ajout en cours...' : '+ Ajouter une tâche'}
                    </button>
                </form>
            </Modal>
        </>
    )
}