interface ButtonProps {
  onClick: () => void
  text: string | JSX.Element
  type?: string
}

export function Button ({ onClick, text, type }: ButtonProps): JSX.Element {
  const bgClass = type === 'danger' ? ['bg-rose-600', 'bg-rose-300'] : ['bg-indigo-600', 'bg-indigo-500']
  const classNames = `rounded-md ${bgClass[0]} px-3 py-2 text-sm font-semibold text-white shadow-sm hover:${bgClass[1]} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-3`
  return (
    <button onClick={onClick} type='button' className={classNames}>{text}</button>
  )
}
