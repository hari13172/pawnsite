// AuthRoute.tsx
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface AuthRouteProps {
    children: ReactNode;
}

export default function AuthRoute({ children }: AuthRouteProps) {
    const token = Cookies.get('access_token');
    return token ? <>{children}</> : <Navigate to="/" />;
}
