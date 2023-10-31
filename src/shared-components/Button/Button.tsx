interface Props {
  onClick: () => void
  text: string | JSX.Element
  type?: string
  className?: string
  disabled?: boolean
}

const buttonTypes: any = {
  primary: ' bg-indigo-500 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  secondary: 'bg-white/10 hover:bg-white/20',
  danger: 'bg-red-500 hover:bg-red-400'
}

export function Button ({ onClick, disabled = false, text, className, type = 'primary' }: Props): JSX.Element {
  const disabledClassName = 'disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-gray-600'
  return (
    <button disabled={disabled} onClick={onClick} type='button'
      className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${buttonTypes[type]} ${className} ${disabledClassName} mr-3 mb-3`}>
        {text}
    </button>
  )
}
