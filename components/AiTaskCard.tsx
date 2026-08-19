import Image from 'next/image'

export function AiTaskCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex flex-col w-full items-start gap-8 border border-(--form-grey) rounded-[10px] px-4 py-3">
            <div>
                <h3 className="font-semibold text-[18px]">{title}</h3>
                <p className="text-sm text-(--neutral-grey)">{description}</p>
            </div>
            <div className="flex flex-row items-center gap-2 text-(--neutral-grey)">
                <button type="button" className="flex flex-row items-center gap-1 cursor-pointer text-nowrap">
                    <Image src="/bin-icon.svg" alt="Bin icon" width={14} height={14} className="w-3.5 h-3.5" />
                    <span className='text-xs'>Supprimer</span>
                </button>
                <div className='h-3 border-r border-[#9CA3AF]'></div>
                <button type="button" className="flex flex-row items-center gap-1 cursor-pointer text-nowrap">
                    <Image src="/pen-icon.svg" alt="Pen icon" width={14} height={14} className="w-3.5 h-3.5" />
                    <span className='text-xs'>Modifier</span>
                </button>
            </div>
        </div>
    )
}