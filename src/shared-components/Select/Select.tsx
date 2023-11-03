interface Props {
  name: string
  value: any
  options: JSX.Element[]
  setter: React.Dispatch<React.SetStateAction<any>>
  showLabel?: boolean
  marginTop?: string
}

export function Select ({ name, value, options, setter, showLabel = true, marginTop = 'mt-1' }: Props): JSX.Element {
  const id = name.toLowerCase().replace(' ', '-')
  return <>
  <div className='sm:col-span-6'>
    {showLabel
      ? <label htmlFor={id} className='block text-sm font-medium leading-6 text-white'>
          { name }
        </label>
      : null
    }
    <div className={marginTop}>
      <select
        onChange={(event) => { setter(event.target.value) }}
        value={value}
        id={id}
        name={id}
        autoComplete={id}
        className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black'
      >
        { options }
      </select>
    </div>
  </div>
  </>
}
