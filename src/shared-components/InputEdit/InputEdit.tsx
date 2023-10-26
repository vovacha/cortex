import { useState } from 'react'

interface Props {
  id: string
  value: string
  callBack: React.Dispatch<React.SetStateAction<any>>
}

export function InputEdit ({ id, value, callBack }: Props): JSX.Element {
  const [item, setItem] = useState<string>(value)
  return (<>
      <input
        onChange={(event) => {
          setItem(event.target.value)
        }}
        onBlur={(event) => {
          setItem(event.target.value)
          callBack(event.target.value)
        }}
        value={item}
        type='text'
        name={id}
        id={id}
        autoComplete={id}
        className='rounded-md border-0 bg-gray-900 py-0 text-white shadow-sm ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 group-hover:bg-slate-800 sm:text-sm sm:leading-6'
      />
  </>)
}
