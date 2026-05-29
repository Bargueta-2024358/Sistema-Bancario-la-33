import { useEffect, useMemo, useState } from 'react';
import { useUserManagementStore } from '../store/useUserManagementStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { CreateUserModal } from './CreateUserModal.jsx';
import { EditUserModal } from './EditUserModal.jsx';
import { createUser, deleteUser, updateUser } from '../../../shared/api/auth';
import { getUserBalance } from '../../../shared/api/banking';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

export const Users = () => {
  const { users, loading, error, getAllUsers, refreshUsers } = useUserManagementStore();
  const [search, setSearch] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [balances, setBalances] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const filteredUsers = useMemo(() => {
    const s = search.toLowerCase().trim();
    return (users || []).filter((u) => {
      const name = `${u.name || ''} ${u.surname || ''}`.toLowerCase();
      const username = u.username?.toLowerCase() || '';
      const matchSearch = !s || name.includes(s) || username.includes(s);
      return matchSearch;
    });
  }, [users, search]);

  const handleDelete = async (u) => {
    const id = u.id || u._id;
    if (!id || !window.confirm(`¿Eliminar a ${u.username}?`)) return;
    try {
      await deleteUser(id);
      showSuccess('Usuario eliminado');
      await refreshUsers();
    } catch (e) {
      showError(e.response?.data?.message || 'No se pudo eliminar');
    }
  };

  const handleShowBalance = async (u) => {
    const id = u.id || u._id;
    try {
      const data = await getUserBalance(id);
      setBalances((prev) => ({ ...prev, [id]: data }));
    } catch (e) {
      showError(e.response?.data?.message || 'Sin saldo o sin cuentas');
    }
  };

  const handleSaveEdit = async (id, values) => {
    try {
      await updateUser(id, {
        name: values.name,
        surname: values.surname,
        dpi: values.dpi,
        address: values.address,
        job: values.job,
        income: values.income === '' ? undefined : Number(values.income),
        phone: values.phone ? values.phone.replace(/\D/g, '') : undefined,
        status: Boolean(values.status),
      });
      showSuccess('Usuario actualizado');
      await refreshUsers();
      return true;
    } catch (e) {
      showError(e.response?.data?.message || 'No se pudo actualizar');
      return false;
    }
  };

  const handleCreate = async (formData) => {
    setCreating(true);
    try {
      await createUser(formData);
        showSuccess('Usuario creado y activado');
        await refreshUsers();
        return true;
    } catch (e) {
      showError(e.response?.data?.message || 'No se pudo crear el usuario');
      return false;
    } finally {
      setCreating(false);
    }
  };

  if (loading && (!users || users.length === 0)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-h)]">Usuarios</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Gestión de usuarios clientes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => refreshUsers()}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-h)] hover:bg-[#efe4d3]"
          >
            Actualizar lista
          </button>
          <button
            type="button"
            onClick={() => setOpenCreateModal(true)}
            className="btn-primary rounded-xl px-5 py-2 font-medium"
          >
            + Nuevo usuario
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o usuario..."
          className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-[var(--text-h)] outline-none focus:ring-2 focus:ring-[#fada28]/40"
        />
        <p className="flex items-center text-sm text-[var(--text-muted)]">
          {filteredUsers.length} usuario(s)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredUsers.map((u) => (
          <div
            key={u.id || u._id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-[var(--text-h)]">
                  {u.name} {u.surname}
                </h2>
                <p className="mt-1 truncate text-sm text-[var(--text-muted)]">@{u.username}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  u.role === 'ADMIN_ROLE' || u.role === 'ADMIN'
                    ? 'bg-blue-500/20 text-blue-600'
                    : 'bg-[#fada28]/30 text-[#5f5342]'
                }`}
              >
                {u.role === 'ADMIN_ROLE' || u.role === 'ADMIN' ? 'Admin' : 'Cliente'}
              </span>
            </div>

            <div className="mt-4 space-y-1 text-sm text-[var(--text-muted)]">
              <p className="truncate">Email: {u.email}</p>
              <p>Tel: {u.phone || 'N/A'}</p>
              <p>DPI: {u.dpi || 'N/A'}</p>
              <p>{u.status === false ? 'Inactivo' : 'Activo'}</p>
              {balances[u.id || u._id] && (
                <p className="font-medium text-emerald-700">
                  Saldo: Q {Number(balances[u.id || u._id].totalBalance ?? 0).toLocaleString()}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEditUser(u)}
                className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs hover:bg-[#efe4d3]"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleShowBalance(u)}
                className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs hover:bg-[#efe4d3]"
              >
                Ver saldo
              </button>
              <button
                type="button"
                onClick={() => handleDelete(u)}
                className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-10 text-center">
          <p className="text-[var(--text-muted)]">No hay usuarios para mostrar</p>
          <button
            type="button"
            onClick={() => refreshUsers()}
            className="mt-4 text-sm text-[#daa520] underline"
          >
            Reintentar carga
          </button>
        </div>
      )}

      <CreateUserModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={handleCreate}
        loading={creating}
        error={error}
      />
      <EditUserModal
        isOpen={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        user={editUser}
        onSave={handleSaveEdit}
        loading={loading}
      />
    </div>
  );
};
