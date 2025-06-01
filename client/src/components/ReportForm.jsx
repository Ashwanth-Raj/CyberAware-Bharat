import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloudinaryUpload from './CloudinaryUpload';
import AnonToggle from './AnonToggle';
import { submitScam } from '../services/api';

function ReportForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [files, setFiles] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const onFormSubmit = async (data) => {
    if (!captchaToken) {
      setError(t('report.captchaRequired'));
      return;
    }
    const formData = { ...data, files, isAnonymous, captchaToken };
    try {
      await submitScam(formData);
      setError(null);
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || t('report.submitError'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="form-group" aria-labelledby="report-form">
      {error && <p className="error" role="alert">{error}</p>}
      <div className="form-group">
        <label htmlFor="scamType">{t('report.scamType')}</label>
        <select
          id="scamType"
          {...register('scamType', { required: t('report.scamTypeRequired') })}
          aria-invalid={errors.scamType ? 'true' : 'false'}
        >
          <option value="">{t('report.selectScamType')}</option>
          <option value="phishing">{t('report.phishing')}</option>
          <option value="upi_fraud">{t('report.upiFraud')}</option>
          <option value="investment">{t('report.investment')}</option>
        </select>
        {errors.scamType && <p className="error" role="alert">{errors.scamType.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="description">{t('report.description')}</label>
        <textarea
          id="description"
          {...register('description', {
            required: t('report.descriptionRequired'),
            maxLength: { value: 500, message: t('report.descriptionMaxLength') },
          })}
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && <p className="error" role="alert">{errors.description.message}</p>}
      </div>
      <div className="form-group">
        <label>{t('report.files')}</label>
        <CloudinaryUpload onUpload={(urls) => setFiles(urls)} />
      </div>
      <div className="form-group">
        <AnonToggle isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />
      </div>
      <button type="submit" className="btn btn-primary" aria-label={t('report.submit')}>
        {t('report.submit')}
      </button>
    </form>
  );
}

export default ReportForm;