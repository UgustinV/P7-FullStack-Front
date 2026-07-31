import { getUser } from '@/app/lib/dal'
export default async function DashboardPage() {
    const user = await getUser()
    return (
        <div>
            <div>
                <h1>Tableau de bord</h1>
                <h2>Bonjour {user?.user.name}, voici un aperçu de vos projets et tâches</h2>
            </div>
            <div className="flex flex-row justify-around items-start gap-5">
                <section>
                    <h3>A faire</h3>
                </section>
                <section>
                    <h3>En cours</h3>
                </section>
                <section>
                    <h3>Terminés</h3>
                </section>
            </div>
        </div>
    )
}