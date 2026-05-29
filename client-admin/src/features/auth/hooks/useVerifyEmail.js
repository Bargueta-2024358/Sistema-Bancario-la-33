import { useState, useEffect } from 'react';
import { verifyEmail as verifyEmailRequest } from '../../../shared/api/auth';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

const verifyPromiseByToken = new Map();
const verifyResultByToken = new Map();
const toastShownByToken = new Map();

export const useVerifyEmail = (token, onSuccess) => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!token) {
        const errorMessage = 'No se encontró el enlace de verificación. Usa el formulario para confirmar tu correo.';
        if (isMounted) {
          setStatus('error');
          setMessage(errorMessage);
        }
        return;
      }

      const cached = verifyResultByToken.get(token);
      if (cached) {
        if (isMounted) {
          setStatus(cached.status);
          setMessage(cached.message);
        }
        return;
      }

      let promise = verifyPromiseByToken.get(token);
      if (!promise) {
        promise = verifyEmailRequest(token)
          .then((res) => {
            if (res?.success) {
              const successMessage =
                'Tu cuenta está activa. En unos segundos te llevaremos al inicio de sesión.';
              const result = { status: 'success', message: successMessage };
              verifyResultByToken.set(token, result);
              return result;
            }
            const errorMessage =
              res?.message || 'El enlace ha expirado o no es válido. Solicita uno nuevo.';
            const result = { status: 'error', message: errorMessage };
            verifyResultByToken.set(token, result);
            return result;
          })
          .catch((err) => {
            const errorMessage =
              err.response?.data?.message ||
              'El enlace ha expirado o no es válido. Solicita uno nuevo.';
            const result = { status: 'error', message: errorMessage };
            verifyResultByToken.set(token, result);
            return result;
          })
          .finally(() => {
            verifyPromiseByToken.delete(token);
          });

        verifyPromiseByToken.set(token, promise);
      }

      const result = await promise;

      if (isMounted) {
        setStatus(result.status);
        setMessage(result.message);
      }

      if (!toastShownByToken.get(token)) {
        toastShownByToken.set(token, true);
        if (result.status === 'success') {
          showSuccess('¡Correo verificado correctamente!');
          onSuccess?.();
        } else {
          showError(result.message);
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [token, onSuccess]);

  return { status, message };
};
