import { Navbar } from './Navbar.jsx';
import { AdminSidebar } from './AdminSidebar.jsx';
import { ClientSidebar } from './ClientSidebar.jsx';

export const DashboardContainer = ({ variant = 'admin', children }) => {
  const Sidebar = variant === 'client' ? ClientSidebar : AdminSidebar;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <div className="flex min-h-[calc(100vh-5rem)]">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 xl:px-10">{children}</main>
      </div>
    </div>
  );
};
