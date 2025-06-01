import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateUpload } from '../utils/validators';

function CloudinaryUpload({ onUpload }) {
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    const urls = [];
    for (const file of acceptedFiles) {
      const validation = validateUpload(file);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: 'POST', body: formData }
        );
        const data = await response.json();
        if (data.secure_url) {
          urls.push(data.secure_url);
        } else {
          setError(t('report.uploadError'));
        }
      } catch (err) {
        setError(t('report.uploadError'));
      }
    }
    if (urls.length > 0) onUpload(urls);
  }, [onUpload, t]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 3,
  });

  return (
    <div className="dropzone" {...getRootProps()} aria-label={t('report.dropFiles')}>
      <input {...getInputProps()} />
      <p>{t('report.dropFiles')}</p>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}

export default CloudinaryUpload;