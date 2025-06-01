import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { submitScam } from '../../services/api';
import axios from 'axios';
import './Report.css';

function Report() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    scamType: '',
    region: '',
    description: '',
    files: [],
    isAnonymous: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log('Stored user:', storedUser);
        console.log('Token present:', !!token);
        
        if (!token) {
          console.warn('No token found');
          window.location.href = '/login';
          return;
        }
        
        if (!storedUser) {
          console.warn('No user data found');
          window.location.href = '/login';
          return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', parsedUser);
        
        if (!parsedUser) {
          console.warn('Invalid user data');
          window.location.href = '/login';
          return;
        }
        
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = '/login';
      }
    };
    
    checkAuthentication();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const validFiles = files.filter((file) => validTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      setError(t('report.invalidFileType'));
    } else {
      setError(null); 
    }
    setFormData((prev) => ({ ...prev, files: validFiles }));
  };

  const uploadFile = async (file) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        uploadData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw new Error(t('report.uploadError'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!formData.scamType) {
      setError(t('report.scamTypeRequired'));
      setSubmitting(false);
      return;
    }
    if (!formData.region) {
      setError(t('report.regionRequired'));
      setSubmitting(false);
      return;
    }
    if (!formData.description) {
      setError(t('report.descriptionRequired'));
      setSubmitting(false);
      return;
    }
    if (formData.description.length > 500) {
      setError(t('report.descriptionMaxLength'));
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      if (!user) {
        throw new Error('User data not available. Please log in again.');
      }
      
      console.log('Submitting with user:', user);
      
      // Upload files if any
      let fileUrls = [];
      if (formData.files.length > 0) {
        fileUrls = await Promise.all(formData.files.map(uploadFile));
      }
    
      const scamData = {
        scamType: formData.scamType,
        region: formData.region,
        description: formData.description,
        files: fileUrls,
        isAnonymous: formData.isAnonymous,
        // Only include creatorEmail if not anonymous and user has email
        creatorEmail: formData.isAnonymous ? null : (user.email || null),
      };
      
      console.log('Submitting scam data:', scamData);
      
      await submitScam(scamData, token);
      
      setSuccess(true);
      setFormData({
        scamType: '',
        region: '',
        description: '',
        files: [],
        isAnonymous: false,
      });
      
      const fileInput = document.getElementById('files');
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (err) {
      console.error('Error submitting scam:', err);
      
      if (err.message.includes('authentication') || err.message.includes('log in')) {
        setError(err.message);
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else if (err.message.includes('upload')) {
        setError(t('report.uploadError'));
      } else {
        setError(t('report.submitError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="report-container">
        <p>{t('report.loading') || 'Loading...'}</p>
      </section>
    );
  }

  return (
    <section className="report-container" aria-labelledby="report-title">
      <h2 id="report-title">{t('report.title')}</h2>
      {success ? (
        <div className="success-message">
          <p>{t('report.success')}</p>
          <button onClick={() => setSuccess(false)} aria-label={t('report.close')}>
            {t('report.close')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="scamType">{t('report.scamType')}</label>
            <select
              id="scamType"
              name="scamType"
              value={formData.scamType}
              onChange={handleChange}
              aria-label={t('report.scamType')}
              required
            >
              <option value="">{t('report.selectScamType')}</option>
              <option value="Phishing">{t('report.phishing')}</option>
              <option value="UPI Fraud">{t('report.upiFraud')}</option>
              <option value="Investment Scam">{t('report.investment')}</option>
              <option value="Cryptocurrency Scams">{t('report.crypt')}</option>
              <option value="Online Shopping Scam">{t('report.shop')}</option>
              <option value="Social Media Scam">{t('report.social')}</option>
              <option value="Job and Employment Scam">{t('report.job')}</option>
              <option value="Online Banking and Payment Scam">{t('report.online')}</option>
              <option value="Lottery, Prize, and Giveaway Scam">{t('report.prize')}</option>
              <option value="Educational and Certification Scams">{t('report.certify')}</option>
              <option value="Miscellaneous/Other">{t('report.other')}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="region">{t('report.region')}</label>
            <input
              id="region"
              name="region"
              type="text"
              value={formData.region}
              onChange={handleChange}
              aria-label={t('report.region')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">{t('report.description')}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength="500"
              aria-label={t('report.description')}
              placeholder={t('report.descriptionRequired') || 'Describe the scam incident...'}
              rows="4"
              required
            />
            <small className="char-count">
              {formData.description.length}/500 {t('report.characters') || 'characters'}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="files">{t('report.files')}</label>
            <input
              id="files"
              name="files"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/gif"
              onChange={handleFileChange}
              aria-label={t('report.files')}
              required
            />
            <small className="file-help">
              {t('report.dropFiles') || 'Upload evidence images (PNG, JPEG, GIF only)'}
            </small>
            {formData.files.length > 0 && (
              <div className="file-preview">
                <p>{formData.files.length} {t('report.filesSelected') || 'file(s) selected'}</p>
                <ul>
                  {formData.files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                aria-label={t('report.anonymous')}
              />
              <span className="checkmark"></span>
              {t('report.anonymous')}
            </label>
            <small className="anonymous-help">
              {t('report.anonymousDetails') || 'Your email will not be displayed if checked'}
            </small>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="submit-button">
            {submitting ? t('report.submitting') : t('report.submit')}
          </button>
        </form>
      )}
    </section>
  );
}

export default Report;