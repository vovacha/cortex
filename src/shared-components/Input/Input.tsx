interface Props {
  name: string
  label?: string
  type?: string
  form: Record<string, any>
  setForm: React.Dispatch<React.SetStateAction<any>>
}

export function Input ({ name, form, label, type, setForm }: Props): JSX.Element {
  const elementType = type ?? 'text'
  return (
<div className='sm:col-span-6'>
  {label !== undefined
    ? <label htmlFor={name} className='block text-sm font-medium leading-6 text-white'>
        { label }
      </label>
    : null
  }
  <input
    onChange={(event) => {
      const value = type === 'number' ? Number(event.target.value) : event.target.value
      setForm({ ...form, [event.target.name]: value })
    }}
    min={ type === 'number' ? 0 : undefined}
    type={elementType}
    value={form[name]}
    name={name}
    id={name}
    autoComplete={name}
    className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
  />
</div>)
}
