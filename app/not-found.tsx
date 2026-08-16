export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getSession } from '@/app/lib/dal'

export default async function NotFound() {
    const session = await getSession()
    return (
        <div className="flex flex-1 flex-col w-full items-center justify-center">
            <h1 className='text-3xl'>Erreur 404</h1>
        <h2 className='text-xl'>Page Non Trouvée</h2>
        <p>La page demandée est introuvable</p>
        <Link href="/" className="text-(--dark-orange) underline">Retour {session ? "à mon tableau de bord" : "à la connexion"}</Link>
        </div>
    )
}
