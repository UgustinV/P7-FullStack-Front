import { getUser, getAssignedTasks, getProjects } from '@/app/lib/dal'
import { TaskView } from '@/components/TaskView'
import { CreateProjectModal } from '@/components/CreateProjectModal'

export default async function DashboardPage() {
    const user = await getUser()
    const tasks = await getAssignedTasks()
    const projects = await getProjects()
    const projectNames = Object.fromEntries(projects.map((p) => [p.id, p.name]))
    return (
        <div className='lg:mx-25'>
            <div className='flex flex-col lg:flex-row lg:justify-between items-start gap-2 lg:items-center mt-4 mb-2 mx-2.5 lg:mt-23 lg:mb-15'>
                <div className='flex flex-col gap-3.5'>
                    <h1 className='text-xl lg:text-2xl font-semibold'>Tableau de bord</h1>
                    <h2 className='lg:text-lg'>Bonjour {user?.user.name}, voici un aperçu de vos projets et tâches</h2>
                </div>
                <div className='w-full lg:w-auto'>
                    <CreateProjectModal />
                </div>
            </div>
            <TaskView tasks={tasks} projects={projectNames} />
        </div>
    )
}