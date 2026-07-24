export function ErrorMessage({ message }: { message: string }) {
    return (
        <p className="text-(--error-red) absolute top-0 left-0 mx-3.5 my-3.5 px-3.5 py-1.5 border border-(--error-red) bg-(--error-red-light) rounded-sm">{message}</p>
    )
}