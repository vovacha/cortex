interface ButtonProps {
  onClick: () => void
  text: string
}

export function Button ({ onClick, text }: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      type='button'
      className='min-w-full block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
    >
      {text}
    </button>
  )
}
