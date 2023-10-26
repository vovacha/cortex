interface Props {
  id: string
}

export function Checkbox ({ id }: Props): JSX.Element {
  return <input
    id={id}
    type='checkbox'
    className='h-4 w-4 bg-gray-300 rounded border-gray-500 text-indigo-400 focus:ring-indigo-600'
  />
}
