'use client'

import Image from 'next/image'
import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/Button'

export default function Signup() {
    const [state, action, pending] = useActionState(signup, undefined)

    return (
        <div className="min-h-screen min-w-full bg-[url(/LogIn.jpg)] bg-cover bg-center">
            <div className="flex flex-col justify-around items-center h-screen w-140 px-35 bg-(--color-background) rounded shadow-md text-sm relative">
                <Image src="/logo.svg" alt="Login" width={252} height={32} className="w-63 h-8" />
                <div className="flex flex-col justify-center items-center w-full">
                    <h1 className="text-[40px] font-bold mb-7 text-(--dark-orange)">Inscription</h1>
                    <form action={action} className="flex flex-col items-center gap-5 w-full">
                        <FormField
                            label="Nom"
                            id="name"
                            type="text"
                            name="name"
                            required
                            error={state?.errors?.name}
                        />
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
                            content={pending ? 'Inscription...' : 'S\'inscrire'}
                        />
                    </form>
                </div>
                <p className="flex flex-row gap-2">
                    Déjà inscrit ?
                    <Link className='text-(--dark-orange) underline' href="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    )
}