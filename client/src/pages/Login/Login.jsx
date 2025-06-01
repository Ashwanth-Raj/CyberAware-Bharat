import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('login.error'));
    }
  };

  return (
    <section aria-labelledby="login-title">
      <h2 id="login-title">{t('login.title')}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-group" aria-labelledby="login-form">
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">{t('login.email')}</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: t('login.emailRequired') })}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p className="error" role="alert">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">{t('login.password')}</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: t('login.passwordRequired') })}
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          {errors.password && <p className="error" role="alert">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary" aria-label={t('login.submit')}>
          {t('login.submit')}
        </button>
      </form>
    </section>
  );
}

export default Login;