import { ErrorMessage } from '@/components/ErrorMessage'

export function FormField({ label, id, type, name, placeholder, required, error, defaultValue }: {
    label: string,
    id: string,
    type: string,
    name: string,
    placeholder?: string,
    required?: boolean,
    error?: string[],
    defaultValue?: string
}) {
    return (
        <div className="flex flex-col w-full">
            <label htmlFor={id} className='mb-2'>{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                defaultValue={defaultValue}
                className="border border-(--form-grey) text-(--neutral-grey) rounded px-3 py-3 mb-2"
            />
            <div className="flex flex-col w-full">
                {error && <ErrorMessage message={error} />}
            </div>
        </div>
    )
}