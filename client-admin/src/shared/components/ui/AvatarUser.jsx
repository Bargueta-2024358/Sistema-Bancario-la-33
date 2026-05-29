import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

export const AvatarUser = () => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.role === 'ADMIN';
  const home = isAdmin ? '/admin' : '/client';
  const profile = isAdmin ? '/admin/users' : '/client/profile';

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const avatarSrc = user?.profilePicture?.trim();
  const initials = user?.username?.[0]?.toUpperCase() || 'A';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)]"
      >
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fada28] text-[#3f3528] font-semibold">
            {initials}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg z-50">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="font-semibold text-[var(--text-h)]">{user?.username}</p>
            <p className="text-xs text-[var(--text-muted)]">{isAdmin ? 'Administrador' : 'Cliente'}</p>
          </div>
          <ul className="p-2 text-sm">
            <li>
              <Link to={home} className="block rounded-xl px-3 py-2 hover:bg-[#efe4d3]">Inicio</Link>
            </li>
            <li>
              <Link to={profile} className="block rounded-xl px-3 py-2 hover:bg-[#efe4d3]">
                {isAdmin ? 'Usuarios' : 'Perfil'}
              </Link>
            </li>
            <li>
              <button type="button" onClick={handleLogout} className="w-full text-left rounded-xl px-3 py-2 text-red-700 hover:bg-red-50">
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
