import { BellIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import imgLogo from '../../../assets/img/logo chita banco.png';
import { AvatarUser } from '../ui/AvatarUser.jsx';
import { getNotifications, getUnreadCount, markAsRead } from '../../api/notifications';
import { showError } from '../../utils/toast';

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [count, list] = await Promise.all([
        getUnreadCount().catch(() => 0),
        getNotifications({ limit: 10 }).catch(() => ({ notifications: [] })),
      ]);
      setUnreadCount(count || 0);
      setNotifications(list.notifications || []);
    } catch (_error) {
      showError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (_error) {
      showError('No se pudo marcar la notificación');
    }
  };

  return (
    <nav className='sticky top-0 z-50 border-b border-[#d9ccb8] bg-[#f4ede2] shadow-[0_4px_20px_rgba(0,0,0,0.05)]'>
      <div className='mx-auto flex h-24 max-w-[1600px] items-center px-10'>

        <div className='flex flex-1 items-center gap-4'>
          <img
            src={imgLogo}
            alt='La 33 Logo'
            className='h-20 w-20 object-contain'
          />

          <div className='leading-tight'>
            <p className='text-[14px] uppercase tracking-[0.35em] text-[#7b6b57]'>
              Banco
            </p>

            <h1 className='text-2xl font-bold text-[#3f3528]'>
              La 33
            </h1>
          </div>
        </div>

        <div className='flex flex-1 items-center justify-end gap-5'>

          <button
            className='relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9ccb8] bg-white text-[#5f5342] transition hover:bg-[#fada28]/20'
            onClick={() => setOpen((v) => !v)}
            type='button'
          >
            <BellIcon className='h-5 w-5' />
            {unreadCount > 0 && (
              <span className='absolute -right-1 -top-1 min-w-5 rounded-full bg-[#d43f3a] px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-white'>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          {open && (
            <div className='absolute right-10 top-[92px] z-50 max-h-[28rem] w-[23rem] overflow-y-auto rounded-2xl border border-[#d9ccb8] bg-white p-4 shadow-xl'>
              <div className='mb-3 flex items-center justify-between'>
                <h3 className='text-sm font-semibold text-[#3f3528]'>Notificaciones</h3>
                <span className='text-xs text-[#7b6b57]'>No leídas: {unreadCount}</span>
              </div>
              {loading ? (
                <p className='text-sm text-[#7b6b57]'>Cargando...</p>
              ) : notifications.length === 0 ? (
                <p className='text-sm text-[#7b6b57]'>Sin notificaciones</p>
              ) : (
                <ul className='space-y-2'>
                  {notifications.map((n) => (
                    <li
                      key={n._id}
                      className={`rounded-xl border p-3 text-sm ${
                        n.read ? 'border-[#e9decf] bg-[#fcfaf7]' : 'border-[#fada28] bg-[#fff9e6]'
                      }`}
                    >
                      <p className='font-semibold text-[#3f3528]'>{n.title}</p>
                      <p className='mt-1 text-[#5f5342]'>{n.message}</p>
                      {!n.read && (
                        <button
                          type='button'
                          onClick={() => handleRead(n._id)}
                          className='mt-2 text-xs font-medium text-[#8a6f3a] underline'
                        >
                          Marcar leída
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className='h-8 w-px bg-[#d9ccb8]' />

          <AvatarUser />
        </div>

      </div>
    </nav>
  );
};