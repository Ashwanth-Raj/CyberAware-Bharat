import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../../services/auth';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/login');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t('register.error'));
    }
  };

  return (
    <section className="register-container" aria-labelledby="register-title">
      <h2 id="register-title">{t('register.title')}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-group" aria-labelledby="register-form">
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">{t('register.email')}</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: t('register.emailRequired'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('register.emailInvalid'),
              },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p className="error" role="alert">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">{t('register.password')}</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: t('register.passwordRequired'),
              minLength: {
                value: 6,
                message: t('register.passwordMinLength'),
              },
            })}
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          {errors.password && <p className="error" role="alert">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary" aria-label={t('register.submit')}>
          {t('register.submit')}
        </button>
      </form>
    </section>
  );
}

export default Register;