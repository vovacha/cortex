interface ButtonProps {
  onClick: () => void
  text: string | JSX.Element
  bg?: string
}

export function Button ({ onClick, text, bg }: ButtonProps): JSX.Element {
  const bgClass = bg ?? 'bg-indigo-600'
  const classNames = `rounded-md ${bgClass} px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-3`
  return (
    <button onClick={onClick} type='button' className={classNames}>{text}</button>
  )
}
