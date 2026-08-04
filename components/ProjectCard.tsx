import { Project } from '@/app/lib/definitions'

export function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="flex flex-col gap-2 rounded-[10px] border border-(--form-grey) p-4">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-(--neutral-grey)">{project.description}</p>
            <div className="flex items-center justify-between text-xs text-(--neutral-grey)">
                <span>Propriétaire : {project.owner.name}</span>
                <div className="flex -space-x-2">
                    {project.members.map((member) => (
                        <span
                            key={member.id}
                            title={member.user.name}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-(--light-orange) border-2 border-white text-[10px]"
                        >
                            {member.user.name.slice(0, 2).toUpperCase()}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}