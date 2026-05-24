import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { beginRegistration, completeRegistration, beginLogin, completeLogin } from '@/Actions/ActionAuth';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.ReducerAuth);

  const [username, setUsername] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'processing'
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;

    setLocalError('');
    setStep('processing');

    try {
      const { startRegistration, startAuthentication } = await import('@simplewebauthn/browser');

      // Try login first; if user not found, fall back to registration
      let loggedIn = false;
      try {
        const loginOptions = await dispatch(beginLogin(name));
        const credential = await startAuthentication(loginOptions);
        await dispatch(completeLogin(name, credential));
        loggedIn = true;
      } catch (loginErr) {
        // If server said user not found — register instead
        if (loginErr.message && loginErr.message.includes('not found')) {
          const regOptions = await dispatch(beginRegistration(name));
          const credential = await startRegistration(regOptions);
          await dispatch(completeRegistration(name, credential));
          loggedIn = true;
        } else {
          throw loginErr;
        }
      }

      if (loggedIn) router.push('/');
    } catch (err) {
      setLocalError(err.message || 'Ошибка аутентификации');
      setStep('input');
    }
  };

  return (
    <section className="order" style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2 className="text-center">Вход / Регистрация</h2>
      <div className="card">
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              className="form-control"
              placeholder="Введите имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={step === 'processing'}
              autoComplete="username webauthn"
            />
          </div>
          {(localError || error) && (
            <p className="text-danger">{localError || error}</p>
          )}
          {step === 'processing' && (
            <p className="text-muted">Ожидание биометрического подтверждения…</p>
          )}
          <button
            type="submit"
            className="btn btn-danger btn-block"
            disabled={!username.trim() || step === 'processing'}
          >
            Войти / Зарегистрироваться
          </button>
          <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
            Используется Passkeys — без пароля, через биометрию или PIN устройства.
          </p>
        </form>
      </div>
    </section>
  );
}
