import { type LogRecord } from '../../interfaces'

export function Activity (): JSX.Element {
  const logs: LogRecord[] = []

  return (
    <aside className='bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5'>
      <header className='flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8'>
        <h2 className='text-base font-semibold leading-7 text-white'>Activity</h2>
      </header>
      <div className='m-5'>
        {logs.map((log: LogRecord, i) => (
          <p key={`log-${i}`} className='flex-auto truncate text-xs text-gray-500 leading-6 text-white'>{log.message}</p>
        ))}
      </div>
    </aside>
  )
}
