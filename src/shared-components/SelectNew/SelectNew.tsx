interface Props {
  name: string
  label?: string
  form: Record<string, any>
  setForm: React.Dispatch<React.SetStateAction<any>>
  options: JSX.Element[]
}

export function SelectNew ({ name, form, label, setForm, options }: Props): JSX.Element {
  return (
<div className='sm:col-span-6'>
  {label !== undefined
    ? <label htmlFor={name} className='block text-sm font-medium leading-6 text-white'>
        { label }
      </label>
    : null
  }
  <select
    onChange={(event) => { setForm({ ...form, [event.target.name]: event.target.value }) }}
    value={form[name]}
    id={name}
    name={name}
    autoComplete={name}
    className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black'
  >
    { options }
  </select>
</div>)
}
