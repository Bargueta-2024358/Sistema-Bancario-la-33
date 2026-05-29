import { DashboardContainer } from '../../shared/components/layout/DashboardContainer.jsx';
import { Outlet, useLocation } from 'react-router-dom';

export const DashboardPage = ({ variant }) => {
  const location = useLocation();
  const resolved = variant || (location.pathname.startsWith('/client') ? 'client' : 'admin');

  return (
    <DashboardContainer variant={resolved}>
      <Outlet />
    </DashboardContainer>
  );
};
