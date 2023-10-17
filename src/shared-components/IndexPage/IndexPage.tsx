import { Navigate } from 'react-router-dom'

interface Props {
  to: string
}

export function IndexPage ({ to }: Props): JSX.Element {
  return <Navigate to={ to } />
}
