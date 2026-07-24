export function FormField({ label, id, type, name, placeholder, required, error }: {
    label: string,
    id: string,
    type: string,
    name: string,
    placeholder?: string,
    required?: boolean,
    error?: string[]
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
                className="border border-(--form-grey) rounded px-3 py-3 mb-2"
            />
            {error && <p>{error.join(', ')}</p>}
        </div>
    )
}