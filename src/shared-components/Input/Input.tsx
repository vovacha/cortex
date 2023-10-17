interface Props {
  name: string
  value: any
  type?: string
  setter: React.Dispatch<React.SetStateAction<any>>
}

export function Input ({ name, value, type, setter }: Props): JSX.Element {
  const elementType = type ?? 'text'
  const id = name.toLowerCase().replace(' ', '-')
  return (<>
    <div className='sm:col-span-6'>
    <label htmlFor={id} className='block text-sm font-medium leading-6 text-white'>
      { name }
    </label>
    <div className='mt-1'>
      <input
        onChange={(event) => { type === 'number' ? setter(Number(event.target.value)) : setter(event.target.value) }}
        min={ type === 'number' ? 0 : undefined}
        value={value}
        type={elementType}
        name={id}
        id={id}
        autoComplete={id}
        className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
      />
    </div>
  </div>
  </>)
}
