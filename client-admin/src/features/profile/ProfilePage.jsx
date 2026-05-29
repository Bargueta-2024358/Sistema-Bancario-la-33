import { useEffect, useState } from 'react';
import { Spinner } from '../auth/components/Spinner.jsx';
import { getProfile, updateProfile, updateProfilePicture } from '../../shared/api/auth';
import { useAuthStore } from '../auth/store/authStore';
import { showError, showSuccess } from '../../shared/utils/toast';

export const ProfilePage = () => {
  const storeUser = useAuthStore((s) => s.user);
  const setAuth = useAuthStore.setState;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', job: '', income: '' });

  useEffect(() => {
    (async () => {
      try {
        const p = await getProfile();
        setProfile(p);
        setForm({
          name: p?.name || '',
          address: p?.address || '',
          job: p?.job || '',
          income: p?.income != null ? String(p.income) : '',
        });
      } catch (e) {
        showError(e.response?.data?.message || 'Error al cargar perfil');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({
        name: form.name.trim(),
        address: form.address.trim(),
        job: form.job.trim(),
        income: Number(form.income) || 0,
      });
      setProfile(updated);
      setAuth((state) => ({
        user: state.user
          ? { ...state.user, name: updated.name, username: updated.username || state.user.username }
          : state.user,
      }));
      setIsEditing(false);
      showSuccess('Perfil actualizado');
    } catch (err) {
      showError(err.response?.data?.message || 'No se pudo guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const updated = await updateProfilePicture(file);
      setProfile(updated);
      setAuth((state) => ({
        user: state.user
          ? {
              ...state.user,
              profilePicture: updated.profilePicture || state.user.profilePicture,
            }
          : state.user,
      }));
      showSuccess('Imagen de perfil actualizada');
    } catch (err) {
      showError(err.response?.data?.message || 'No se pudo actualizar la imagen');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  if (loading) return <Spinner />;

  const user = profile || storeUser;
  const profileRows = [
    { label: 'Usuario', value: user?.username ? `@${user.username}` : 'No registrado' },
    { label: 'Nombre', value: user?.name || 'No registrado' },
    { label: 'Apellido', value: user?.surname || 'No registrado' },
    { label: 'Correo', value: user?.email || 'No registrado' },
    { label: 'Teléfono', value: user?.phone || 'No registrado' },
    { label: 'Dirección', value: user?.address || 'No registrado' },
    { label: 'Trabajo', value: user?.job || 'No registrado' },
    {
      label: 'Ingresos mensuales',
      value:
        user?.income != null && Number.isFinite(Number(user.income))
          ? `Q${Number(user.income).toLocaleString()}`
          : 'No registrado',
    },
  ];

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Mi perfil</h1>
        <p className="text-sm text-[var(--text-muted)]">Consulta tu información y actualiza solo los datos permitidos.</p>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 mb-8 space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-4">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Perfil" className="h-20 w-20 rounded-full object-cover border border-[var(--border)]" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fada28] text-[#3f3528] text-2xl font-bold">
                {(user?.username || 'U')[0].toUpperCase()}
              </div>
            )}
            <div>
              <label className="inline-flex cursor-pointer rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[#5f5342] hover:bg-[#faf6f0]">
                {uploadingImage ? 'Subiendo...' : 'Cambiar imagen'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                  disabled={uploadingImage}
                />
              </label>
              <p className="mt-2 text-xs text-[var(--text-muted)]">Formatos: JPG, PNG, WEBP (max 5MB)</p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  name: user?.name || '',
                  address: user?.address || '',
                  job: user?.job || '',
                  income: user?.income != null ? String(user.income) : '',
                });
                setIsEditing(true);
              }}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[#5f5342] hover:bg-[#faf6f0]"
            >
              Editar perfil
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-h)]">Editar perfil</h2>
            <p className="text-xs text-[var(--text-muted)]">Campos editables: Nombre, Dirección, Trabajo e Ingresos.</p>

            <div>
              <label className="text-sm text-[var(--text-muted)]">Nombre</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[var(--border)] px-4 py-2"
                required
                maxLength={25}
              />
            </div>
            <div>
              <label className="text-sm text-[var(--text-muted)]">Dirección</label>
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[var(--border)] px-4 py-2"
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-sm text-[var(--text-muted)]">Trabajo</label>
              <input
                value={form.job}
                onChange={(e) => setForm((f) => ({ ...f, job: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[var(--border)] px-4 py-2"
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm text-[var(--text-muted)]">Ingresos (Q)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.income}
                onChange={(e) => setForm((f) => ({ ...f, income: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[var(--border)] px-4 py-2"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary px-6 py-2 rounded-xl disabled:opacity-50">
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-[var(--border)] bg-white px-6 py-2 text-sm font-medium text-[#5f5342] hover:bg-[#faf6f0]"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <ul className="space-y-3">
            {profileRows.map((row) => (
              <li key={row.label} className="border-b border-[var(--border)] pb-2">
                <p className="text-xs text-[var(--text-muted)]">{row.label}</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-h)] break-words">{row.value}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
