'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'

export default function Login() {
    const [state, action, pending] = useActionState(login, undefined)

    return (
        <div>
            <h1>Connexion</h1>
            {state?.message && <p>{state.message}</p>}
            <form action={action}>
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
                {state?.errors?.password && <p>{state.errors.password.join(', ')}</p>}
                </div>
                <button type="submit" disabled={pending}>
                {pending ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
            <p>
                Pas encore de compte ?{' '}
                <Link href="/signup">S&apos;inscrire</Link>
            </p>
        </div>
    )
}