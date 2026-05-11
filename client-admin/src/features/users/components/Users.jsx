import { useEffect, useMemo, useState } from 'react';
import { useUserManagementStore } from '../store/useUserManagementStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { CreateUserModal } from './CreateUserModal.jsx';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

const PAGE_SIZE = 9;

export const Users = () => {
  const { users, loading, error, getAllUsers } =
    useUserManagementStore();

  const registerUser = useAuthStore((state) => state.register);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const filteredUsers = useMemo(() => {
    const s = search.toLowerCase().trim();

    return users.filter((u) => {
      const name = `${u.name} ${u.surname}`.toLowerCase();
      const username = u.username?.toLowerCase();

      const matchSearch =
        !s || name.includes(s) || username.includes(s);

      const matchRole =
        roleFilter === 'ALL' || u.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const handleCreate = async (formData) => {
    const res = await registerUser(formData);

    if (res.success) {
      showSuccess('Usuario creado');
      await getAllUsers();
      return true;
    }

    showError(res.error);
    return false;
  };

  if (loading && users.length === 0) return <Spinner />;

  return (
    <div className="min-h-screen p-6 bg-[var(--bg)]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[var(--text-h)]">
            Usuarios
          </h1>

          <p className="text-sm text-[var(--text-muted)] mt-1">
            Gestión de usuarios del sistema
          </p>
        </div>

        <button
          onClick={() => setOpenCreateModal(true)}
          className="btn-primary px-5 py-2 rounded-xl font-medium"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* FILTERS */}
      <div className="mb-6 grid md:grid-cols-3 gap-3">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar usuario..."
          className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-h)] outline-none"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-h)] outline-none"
        >
          <option value="ALL">Todos</option>
          <option value="ADMIN_ROLE">Admin</option>
          <option value="USER_ROLE">User</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {filteredUsers.map((u) => (
          <div
            key={u._id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm"
          >

            {/* HEADER */}
            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-[var(--text-h)]">
                  {u.name} {u.surname}
                </h2>

                <p className="text-sm text-[var(--text-muted)] mt-1">
                  @{u.username}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  u.role === 'ADMIN_ROLE'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-white/10 text-[var(--text-muted)]'
                }`}
              >
                {u.role === 'ADMIN_ROLE' ? 'Admin' : 'User'}
              </span>
            </div>

            {/* BODY */}
            <div className="mt-5 space-y-2 text-sm text-[var(--text-muted)]">

              <p>Email: {u.email}</p>

              <p>Tel: {u.phone || 'N/A'}</p>
            </div>

          </div>
        ))}
      </div>

      {/* EMPTY */}
      {filteredUsers.length === 0 && !loading && (
        <div className="text-center text-[var(--text-muted)] mt-10">
          No hay usuarios
        </div>
      )}

      {/* MODAL */}
      <CreateUserModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={handleCreate}
        loading={loading}
        error={error}
      />
    </div>
  );
};