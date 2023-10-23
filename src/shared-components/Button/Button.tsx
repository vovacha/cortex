interface Props {
  onClick: () => void
  text: string | JSX.Element
  type?: string
  classNames?: string
}

const buttonTypes: any = {
  primary: 'rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  secondary: 'rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20',
  danger: 'rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500'
}

export function Button ({ onClick, text, classNames, type = 'primary' }: Props): JSX.Element {
  return (
    <button onClick={onClick} type='button' className={`${buttonTypes[type]} ${classNames}`}>{text}</button>
  )
}
