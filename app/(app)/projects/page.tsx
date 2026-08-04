import { getProjects } from '@/app/lib/dal'
import { ProjectCard } from '@/components/ProjectCard'
import { CreateProjectModal } from '@/components/CreateProjectModal'

export default async function Projects() {
    const projects = await getProjects()
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1>Projets</h1>
                <CreateProjectModal />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    )
}