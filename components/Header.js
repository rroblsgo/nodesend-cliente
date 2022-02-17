import { useContext, useEffect } from 'react';
import authContext from '../context/auth/authContext';
import appContext from '../context/app/appContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  // routing
  const router = useRouter();

  // extraer el usuario autenticado de Local Storage
  const AuthContext = useContext(authContext);
  const { usuario, usuarioAutenticado, cerrarSesion } = AuthContext;

  // Context de la aplicación
  const AppContext = useContext(appContext);
  const { limpiarState } = AppContext;

  useEffect(() => {
    usuarioAutenticado();
  }, []);

  const redireccionar = () => {
    router.push('/');
    limpiarState();
  };

  // función añadida para que se recargue la página y funcione el login
  // después de cerrar sesión (con location.reload())
  const closeSession = () => {
    limpiarState();
    cerrarSesion();
    router.push('/');
    location.reload();
  };

  return (
    <header className="py-8 flex flex-col md:flex-row items-center justify-between">
      <img
        onClick={() => redireccionar()}
        className="w-64 mb-8 md:mb-0 cursor-pointer"
        src="/logo.svg"
        alt="logo"
      />

      <div>
        {usuario ? (
          <div className="flex items-center">
            <p className="mr-2">Hola {usuario.nombre}</p>
            <button
              type="button"
              className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase"
              onClick={() => closeSession()}
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div>
            <Link href="/login">
              <a className="bg-red-500 px-5 py-3 rounded-lg text-white font-bold uppercase mr-2">
                Iniciar Sesión
              </a>
            </Link>
            <Link href="/crearcuenta">
              <a className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase">
                Crear Cuenta
              </a>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
