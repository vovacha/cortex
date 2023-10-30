interface Props {
  columns: Array<string | JSX.Element>
}

export function TableHead ({ columns }: Props): JSX.Element {
  return <thead>
    <tr>
      <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'>
        {columns[0]}
      </th>
      { columns.slice(1).map((column, i) => (
        <th key={i} scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
          {column}
        </th>
      ))}
    </tr>
  </thead>
}
