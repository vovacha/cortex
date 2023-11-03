import { FolderPlusIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface Props {
  title?: string
  message?: string
  state?: 'empty' | 'error' | 'loading'
}

export function DataState ({ title, message, state = 'empty' }: Props): JSX.Element {
  function getIcon (): JSX.Element {
    const className = 'mx-auto h-12 w-12 text-gray-400'
    switch (state) {
      case 'loading': return <>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </>
      case 'error': return <ExclamationCircleIcon className={className} />
      case 'empty':
      default: return <FolderPlusIcon className={className} />
    }
  }

  return (
    <div className="text-center overflow-auto">
      {getIcon()}
      <h3 className="mt-2 text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  )
}
