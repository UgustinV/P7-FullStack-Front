'use client'

import { ReactNode } from 'react'

export function Modal({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
    className?: string
}) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="relative bg-white rounded-[10px] max-h-[95vh] overflow-auto flex flex-col gap-5 py-20 px-18.5 w-2/3">
                <button onClick={onClose} aria-label="Fermer" className="absolute top-9 right-9 cursor-pointer text-xl">✕</button>
                <h2 className="text-2xl font-semibold">{title}</h2>
                {children}
            </div>
        </div>
    )
}