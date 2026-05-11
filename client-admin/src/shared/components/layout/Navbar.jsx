import { BellIcon } from '@heroicons/react/24/outline';
import imgLogo from '../../../assets/img/logo chita banco.png';
import { AvatarUser } from '../ui/AvatarUser.jsx';

export const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 border-b border-[#d9ccb8] bg-[#f4ede2] shadow-[0_4px_20px_rgba(0,0,0,0.05)]'>
      <div className='mx-auto flex h-20 max-w-[1600px] items-center px-10'>

        <div className='flex flex-1 items-center gap-4'>
          <img
            src={imgLogo}
            alt='La 33 Logo'
            className='h-16 w-16 object-contain'
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

          <button className='flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9ccb8] bg-white text-[#5f5342] transition hover:bg-[#fada28]/20'>
            <BellIcon className='h-5 w-5' />
          </button>

          <div className='h-8 w-px bg-[#d9ccb8]' />

          <AvatarUser />
        </div>

      </div>
    </nav>
  );
};