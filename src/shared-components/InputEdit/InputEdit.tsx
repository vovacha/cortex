interface Props {
  index: number
  name: string
  value: any
  onChange: (value: any) => void
  onBlur: (value: any) => void
}

export function InputEdit ({ index, name, value, onChange, onBlur }: Props): JSX.Element {
  const id = `${name}-${index}`
  return (<>
      <input
        onChange={(event) => { onChange(event.target.value) }}
        onBlur={(event) => { onBlur(event.target.value) }}
        value={value}
        type='text'
        name={id}
        id={id}
        autoComplete={id}
        className='rounded-md border-0 bg-gray-900 py-0 text-white shadow-sm ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 group-hover:bg-slate-800 sm:text-sm sm:leading-6'
      />
  </>)
}
