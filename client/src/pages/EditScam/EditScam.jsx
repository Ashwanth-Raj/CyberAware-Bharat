
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloudinaryUpload from '../../CloudinaryUpload';

function EditScamForm({ scam, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      scamType: scam.scamType,
      description: scam.description,
    },
  });
  const [files, setFiles] = useState(scam.files || []);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const onFormSubmit = async (data) => {
    const formData = { ...data, files };
    try {
      await onSubmit(formData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t('scams.editError'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="form-group" aria-labelledby="edit-scam-form">
      <h3>{t('scams.editScam')}</h3>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="form-group">
        <label htmlFor="editScamType">{t('report.scamType')}</label>
        <select
          id="editScamType"
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
        <label htmlFor="editDescription">{t('report.description')}</label>
        <textarea
          id="editDescription"
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
      <button type="submit" className="btn btn-primary" aria-label={t('scams.save')}>
        {t('scams.save')}
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
        aria-label={t('scams.cancel')}
        style={{ marginLeft: '10px' }}
      >
        {t('scams.cancel')}
      </button>
    </form>
  );
}

export default EditScamForm;