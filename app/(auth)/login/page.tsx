'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import { ErrorMessage } from '@/components/ErrorMessage'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/Button'

export default function Login() {
    const [state, action, pending] = useActionState(login, undefined)

    return (
        <div className="min-h-screen min-w-full lg:bg-[url(/LogIn.jpg)] lg:bg-cover lg:bg-center">
            <div className="flex flex-col justify-around items-center h-screen lg:w-140 px-4 lg:px-35 bg-(--color-background) rounded shadow-md text-sm relative">
                <Image src="/logo.svg" alt="Login" width={252} height={32} className="w-63 h-8" />
                {state?.message && <ErrorMessage message={state.message} />}
                <div className="flex flex-col justify-center items-center w-full gap-7">
                    <h1 className="text-[40px] font-bold text-(--dark-orange)">Connexion</h1>
                    <form action={action} className="flex flex-col items-center gap-7 w-full">
                        <FormField
                            label="Email"
                            id="email"
                            type="email"
                            name="email"
                            required
                            error={state?.errors?.email}
                        />
                        <FormField
                            label="Mot de passe"
                            id="password"
                            type="password"
                            name="password"
                            required
                            error={state?.errors?.password}
                        />
                        <Button
                            style="w-7/8 py-3"
                            content={pending ? 'Connexion...' : 'Se connecter'}
                        />
                    </form>
                    <p>
                        <Link className='text-(--dark-orange) underline' href="/forgot-password">Mot de passe oublié ?</Link>
                    </p>
                </div>
                <p className="flex flex-row gap-2">
                    Pas encore de compte ?
                    <Link className='text-(--dark-orange) underline' href="/signup">Créer un compte</Link>
                </p>
            </div>
        </div>
    )
}