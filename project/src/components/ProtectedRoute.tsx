// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }:any) => {
  const isAuth = localStorage.getItem('isAuth') === 'true';

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
