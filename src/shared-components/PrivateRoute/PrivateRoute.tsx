import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  children?: string | JSX.Element | JSX.Element[]
}

export const PrivateRoute: React.FC<Props> = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading === true) {
    return <></>
  }
  if (isAuthenticated === true) {
    return children
  }
  return <Navigate to='/signin' replace />
}
