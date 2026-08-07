'use client'

import { useActionState } from 'react'
import { updateAccount } from '@/app/actions/users'
import { FormField } from '@/components/FormField'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/Button'
import { User } from '@/app/lib/definitions'

export function AccountForm({ user }: { user: User }) {
    const [state, action, pending] = useActionState(updateAccount, undefined)

    return (
        <form action={action} className="flex flex-col gap-4">
            {state?.message && <ErrorMessage message={state.message} />}
            <FormField
                label="Nom"
                id="name"
                type="text"
                name="name"
                defaultValue={user.name}
                required
                error={state?.errors?.name}
            />
            <FormField
                label="Email"
                id="email"
                type="email"
                name="email"
                defaultValue={user.email}
                required
                error={state?.errors?.email}
            />
            <FormField
                label="Mot de passe actuel"
                id="currentPassword"
                type="password"
                name="currentPassword"
                placeholder="Laissez vide si vous ne souhaitez pas changer votre mot de passe"
                error={state?.errors?.currentPassword}
            />
            <FormField
                label="Nouveau mot de passe"
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="Laissez vide si vous ne souhaitez pas changer votre mot de passe"
                error={state?.errors?.newPassword}
            />
            <Button style="w-fit px-6 py-3" content={pending ? 'Enregistrement...' : 'Enregistrer'} />
            {state?.success && <p className="text-(--success-green) text-sm">Compte mis à jour.</p>}
        </form>
    )
}