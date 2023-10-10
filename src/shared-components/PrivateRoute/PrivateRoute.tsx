import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  children?: string | JSX.Element | JSX.Element[]
}

const PrivateRoute: React.FC<Props> = ({ children }: Props) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to='/signin' />
}

export default PrivateRoute
