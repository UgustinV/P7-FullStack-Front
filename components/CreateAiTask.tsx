'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/Modal'
import { AiTaskCard } from '@/components/AiTaskCard'

const FAKE_GENERATED_TASKS = [
    { title: 'Rédiger le cahier des charges', description: 'Lister les besoins fonctionnels et techniques du projet.' },
    { title: 'Préparer la présentation client', description: 'Créer un support de présentation pour la réunion de vendredi.' },
    { title: 'Planifier les points d’équipe', description: 'Organiser un point hebdomadaire pour suivre l’avancement.' },
]

export function CreateAiTask({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<'prompt' | 'results'>('prompt')

    function handleClose() {
        setOpen(false)
        setView('prompt')
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="flex flex-row justify-center items-center text-white bg-(--dark-orange) rounded-[10px] px-6 py-3 cursor-pointer text-nowrap w-full lg:w-fit">
                <Image src="/ai-white-icon.svg" alt="IA" width={20} height={20} className='h-5 w-5 mr-2' />
                IA
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                title={
                    <span className="flex items-center gap-2">
                        <Image src="/ai-orange-icon.svg" alt="" width={20} height={20} className="h-5 w-5" />
                        {view === 'prompt' ? "Créer une tâche" : 'Vos tâches...'}
                    </span>
                }
                className="min-h-2/3"
            >
                <div className="flex flex-col flex-1 gap-4">
                    {view === 'results' && (
                        <div className="flex flex-col w-full items-center gap-4 overflow-auto border-b border-(--form-grey) pb-4 mb-2">
                            {FAKE_GENERATED_TASKS.map((task) => (
                                <AiTaskCard key={task.title} title={task.title} description={task.description} />
                            ))}
                            <button className="text-white bg-(--button-grey) rounded-[10px] px-5 py-3 cursor-pointer text-nowrap w-full lg:w-fit">
                                + Ajouter les tâches
                            </button>
                        </div>
                    )}
                    <form onSubmit={(e) => { e.preventDefault(); setView('results') }} className="relative mt-auto">
                        {/* prompt field only, generation not implemented yet */}
                        <label htmlFor="prompt" className="sr-only">Décrivez les tâches que vous souhaitez ajouter</label>
                        <input
                            type="text"
                            name="prompt"
                            id="prompt"
                            placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                            className="w-full bg-background rounded-full pl-4 pr-14 py-6 text-[10px] text-black"
                        />
                        <button type="submit" aria-label="Envoyer" className="absolute right-10 top-1/2 -translate-y-1/2 cursor-pointer">
                            <Image src="/ai-send-button.svg" alt="" width={24} height={24} className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    )
}