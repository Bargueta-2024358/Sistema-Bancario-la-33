import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

export const AvatarUser = () => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const toggleMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
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
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={toggleMenu}
        className='flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] transition hover:bg-[var(--bg-hover)]'
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={user?.username}
            className='h-10 w-10 rounded-full object-cover'
          />
        ) : (
          <span className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[#0d1f1e] font-semibold uppercase'>
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-52 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-md)] backdrop-blur-xl z-50'>
          <div className='px-4 py-4 border-b border-[var(--border)]'>
            <p className='font-semibold text-[var(--text-h)]'>{user?.username}</p>
            <p className='text-sm text-[var(--text-muted)] truncate'>{user?.email}</p>
          </div>

          <ul className='p-2 text-sm text-[var(--text)]'>
            <li>
              <Link to='/dashboard' className='block w-full rounded-2xl px-3 py-2 transition hover:bg-[var(--bg-hover)]'>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to='/dashboard/users' className='block w-full rounded-2xl px-3 py-2 transition hover:bg-[var(--bg-hover)]'>
                Usuarios
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className='mt-1 w-full rounded-2xl px-3 py-2 text-left text-rose-400 transition hover:bg-rose-500/10'
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
