import { Link } from 'react-router-dom';
import chitaLogo from '../../../assets/img/logo chita banco.png';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#e7dbcb] text-[#3f3528]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <img src={chitaLogo} alt="Banco La 33" className="h-12 w-12 object-contain" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8b7a65]">Bienvenido</p>
            <h1 className="text-lg font-bold">Banco La 33</h1>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            to="/auth"
            className="rounded-full border border-[#d9ccb8] bg-white px-5 py-2 text-sm font-medium text-[#5f5342] transition hover:bg-[#faf6f0]"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <section>
          <p className="mb-3 inline-flex rounded-full border border-[#d9ccb8] bg-[#f4ede2] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#7b6b57]">
            Sistema bancario
          </p>
          <h2 className="text-4xl font-extrabold leading-tight lg:text-5xl">
            Tu banca digital para administrar cuentas, productos y movimientos.
          </h2>
          <p className="mt-5 max-w-2xl text-base text-[#6f604d]">
            En Banco La 33 puedes gestionar tus cuentas, realizar transferencias, consultar historiales y
            explorar productos bancarios en una plataforma moderna y segura.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="rounded-2xl bg-[#fada28] px-6 py-3 text-sm font-semibold text-[#2f2a1d] shadow-[0_12px_24px_rgba(250,218,40,0.28)]"
            >
              Iniciar sesion
            </Link>
            <Link to="/auth?view=confirm" className="rounded-2xl border border-[#d9ccb8] bg-white px-6 py-3 text-sm font-medium text-[#5f5342]">
              Confirmar correo
            </Link>
          </div>
        </section>

        <section className="rounded-[30px] border border-[#d9ccb8] bg-[#f4ede2] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.10)]">
          <h3 className="text-2xl font-bold">Que puedes hacer</h3>
          <ul className="mt-5 space-y-4 text-sm text-[#5f5342]">
            <li className="rounded-2xl border border-[#e6dccd] bg-white p-4">Abrir y consultar tus cuentas bancarias.</li>
            <li className="rounded-2xl border border-[#e6dccd] bg-white p-4">Realizar transferencias y revisar movimientos.</li>
            <li className="rounded-2xl border border-[#e6dccd] bg-white p-4">Administrar productos, monedas y tasas de cambio.</li>
            <li className="rounded-2xl border border-[#e6dccd] bg-white p-4">Actualizar tu perfil.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};
