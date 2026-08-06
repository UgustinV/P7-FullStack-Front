import { getProjects, getProjectTasks } from '@/app/lib/dal'
import { ProjectCard } from '@/components/ProjectCard'
import { CreateProjectModal } from '@/components/CreateProjectModal'

export default async function Projects() {
    const projects = await getProjects()
    const tasks = await Promise.all(projects.map(project => getProjectTasks(project.id)))
    return (
        <div className="mx-25">
            <div className='flex justify-between items-center mt-23 mb-15'>
                <div className='flex flex-col gap-3.5'>
                    <h1 className='text-2xl font-semibold'>Mes projets</h1>
                    <h2>Gérer mes projets</h2>
                </div>
                <div>
                    <CreateProjectModal />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} tasks={tasks[projects.indexOf(project)]} />
                ))}
            </div>
        </div>
    )
}