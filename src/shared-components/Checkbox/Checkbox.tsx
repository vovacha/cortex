interface Props {
  index: number
  name: string
  isChecked: boolean
  onChange: () => void
}

export function Checkbox ({ index, name, isChecked, onChange }: Props): JSX.Element {
  const id = `${name}-${index}`
  return <input
    id={id}
    name={id}
    value={id}
    type='checkbox'
    checked={isChecked}
    onChange={onChange}
    className='h-4 w-4 bg-gray-300 rounded border-gray-500 text-indigo-400 focus:ring-indigo-600'
  />
}
