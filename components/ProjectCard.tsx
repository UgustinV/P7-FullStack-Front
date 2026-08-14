import Link from 'next/link'
import { Project } from '@/app/lib/definitions'
import { getInitials } from '@/app/lib/utils'
import Image from 'next/image'

export function ProjectCard({ project, tasks }: { project: Project, tasks?: Project['tasks'] }) {
    return (
        <Link
            href={`/projects/${project.id}`}
            className="flex flex-col gap-2 lg:rounded-[10px] border-t border-b lg:border border-(--form-grey) text-(--neutral-grey) p-4 bg-white"
        >
            <h3 className="font-semibold text-lg text-black">{project.name}</h3>
            <p className="text-sm">{project.description}</p>
            <div className="lg:my-14">
                <div className="flex items-center justify-between text-xs">
                    <span>Progression</span>
                    <span className='text-black'>{tasks ? Math.round((tasks.filter(task => task.status === 'DONE')).length / tasks.length * 100) : 100}%</span>
                </div>
                <progress className="task-progress w-full h-1.75 rounded-full" value={tasks ? (tasks.filter(task => task.status === 'DONE')).length : 1} max={tasks ? tasks.length : 1}></progress>
                <span className='text-[10px]'>{tasks ? (tasks.filter(task => task.status === 'DONE')).length : 1}/{tasks ? tasks.length : 1} tâche{tasks && (tasks.filter(task => task.status === 'DONE')).length > 1 ? 's' : ''} terminée{tasks && (tasks.filter(task => task.status === 'DONE')).length > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center justify-left gap-2">
                <Image src="/team-icon.svg" alt="Logo de groupe" width={11} height={11} />
                <span className='text-[10px]'>Équipe ({project.members.length + 1})</span>
            </div>
            <div className="flex items-center justify-left text-xs gap-1.25 text-black">
                <span
                    key={project.owner.id}
                    title={project.owner.name}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-(--light-orange) text-[10px]"
                >
                    {getInitials(project.owner.name)}
                </span>
                <span className="text-sm bg-(--light-orange) text-(--dark-orange) px-4 py-1 rounded-full">Propriétaire</span>
                <div className="flex -space-x-2">
                    {project.members.map((member) => (
                        <span
                            key={member.id}
                            title={member.user.name}
                            className="flex items-center justify-center w-7 h-7 rounded-full bg-(--form-grey) border border-white text-[10px]"
                        >
                            {getInitials(member.user.name)}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}