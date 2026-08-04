export function Button({style, content}: {style?: string, content: string}) {
  return (
    <button className={`text-white bg-(--button-grey) rounded-[10px] cursor-pointer ${style}`}>
      {content}
    </button>
  )
}