'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default function Signup() {
    const [state, action, pending] = useActionState(signup, undefined)

    return (
        <div>
            <h1>Inscription</h1>
            {state?.message && <p>{state.message}</p>}
            <form action={action}>
                <div>
                <label htmlFor="name">Nom</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                />
                {state?.errors?.name && <p>{state.errors.name.join(', ')}</p>}
                </div>
                <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@exemple.com"
                    required
                />
                {state?.errors?.email && <p>{state.errors.email.join(', ')}</p>}
                </div>
                <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                />
                {state?.errors?.password && (
                    <ul>
                    {state.errors.password.map((err) => (
                        <li key={err}>{err}</li>
                    ))}
                    </ul>
                )}
                </div>
                <button type="submit" disabled={pending}>
                {pending ? 'Inscription...' : "S'inscrire"}
                </button>
            </form>
            <p>
                Déjà un compte ?{' '}
                <Link href="/login">Se connecter</Link>
            </p>
        </div>
    )
}