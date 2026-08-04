import { getUser, getAssignedTasks } from '@/app/lib/dal'
import { TaskView } from '@/components/TaskView'
import { CreateProjectModal } from '@/components/CreateProjectModal'

export default async function DashboardPage() {
    const user = await getUser()
    const tasks = await getAssignedTasks()
    return (
        <div className='mx-25'>
            <div className='flex justify-between items-center mt-23 mb-15'>
                <div className='flex flex-col gap-3.5'>
                    <h1 className='text-2xl font-semibold'>Tableau de bord</h1>
                    <h2>Bonjour {user?.user.name}, voici un aperçu de vos projets et tâches</h2>
                </div>
                <div>
                    <CreateProjectModal />
                </div>
            </div>
            <TaskView tasks={tasks} />
        </div>
    )
}