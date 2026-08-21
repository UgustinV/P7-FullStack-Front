export function ErrorMessage({ message }: { message: string | string[] }) {
    const messages = Array.isArray(message) ? message : [message]
    return (
        <div role="alert" className="w-full text-(--error-red) px-2 py-1.5 border border-(--error-red) bg-(--error-red-light) rounded-sm">
            {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
            ))}
        </div>
    )
}