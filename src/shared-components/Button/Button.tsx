interface Props {
  onClick: () => void
  text: string | JSX.Element
  type?: string
  classNames?: string
  disabled?: boolean
}

const buttonTypes: any = {
  primary: 'rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  secondary: 'rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20 ',
  danger: 'rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400'
}

export function Button ({ onClick, disabled = false, text, classNames, type = 'primary' }: Props): JSX.Element {
  const disabledClassNames = disabled ? 'cursor-not-allowed disabled:bg-slate-800 text-gray-600' : ''
  return (
    <button disabled={disabled} onClick={onClick} type='button'
      className={`${buttonTypes[type]} ${classNames} ${disabledClassNames} mr-3 mb-3`}>
        {text}
    </button>
  )
}
