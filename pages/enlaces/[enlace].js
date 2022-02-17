import { useState, useContext } from 'react';
import Layout from '../../components/Layout';
import clienteAxios from '../../config/axios';
import appContext from '../../context/app/appContext';
import Alerta from '../../components/Alerta';

const PaginaEnlace = ({ enlace }) => {
  // context de la app
  const AppContext = useContext(appContext);
  const { mostrarAlerta, mensaje_archivo } = AppContext;

  const [tienePassword, setTienePassword] = useState(enlace.password);
  const [password, setPassword] = useState('');

  // console.log(tienePassword);
  console.log('Enlace: ', enlace);

  const verificarPassword = async (e) => {
    e.preventDefault();

    const data = {
      password,
    };
    console.log(data.password);
    try {
      const resultado = await clienteAxios.post(
        `/api/enlaces/${enlace.enlace}`,
        data
      );
      console.log('Resultado: ', resultado);
      //setArchivo(resultado.data.archivo);
      setTienePassword(!resultado.data.password);
    } catch (error) {
      mostrarAlerta(error.response.data.msg);
    }
  };

  return (
    <Layout>
      {tienePassword ? (
        <div>
          <p className="text-center">
            Enlace protegido por password, colócalo a continuación
          </p>
          {mensaje_archivo && <Alerta />}
          <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
              <form
                className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                onSubmit={(e) => verificarPassword(e)}
              >
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-black text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    placeholder="Password del enlace"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  className="bg-red-500 hover:bg-gray-900 px-3 py-2 rounded w-full text-white uppercase font-bold"
                  value="Validar Password"
                />
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl text-center text-gray-700">
            Descarga tu archivo:
          </h1>
          <div className="flex items-center justify-center mt-10">
            <a
              href={`${process.env.backendURL}/api/archivos/${enlace.archivo}`}
              className="bg-red-500 text-center px-10 py-3 uppercase rounded font-bold text-white cursor-pointer"
              download
            >
              Aquí
            </a>
          </div>
        </div>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  const { enlace } = params;
  console.log('getServerSideProps_enlace: ', enlace);
  try {
    let resultado = await clienteAxios.get(`/api/enlaces/${enlace}`);
    console.log('getServerSideProps_resultado: ', resultado.data);
    return {
      props: {
        enlace: resultado.data,
      },
    };
  } catch (error) {
    console.log('getServerSideProps_resultado: ', 'No existe el enlace');
    return {
      // No hay enlace y debe retornar a la página principal
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    };
  }
}

export async function getServerSidePaths() {
  const enlaces = await clienteAxios.get('/api/enlaces');
  // console.log(enlaces.data)
  return {
    paths: enlaces.data.enlaces.map((enlace) => ({
      params: { enlace: enlace.url },
    })),
    fallback: false,
  };
}

export default PaginaEnlace;
