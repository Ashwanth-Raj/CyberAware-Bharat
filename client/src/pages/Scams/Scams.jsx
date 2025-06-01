import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getScams, updateScam, deleteScam, downloadScamPDF } from '../../services/api';
import './Scams.css';

function Scams() {
  const { t } = useTranslation();
  const [scams, setScams] = useState([]);
  const [filters, setFilters] = useState({
    scamType: '',
    region: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState(null);
  const [enlargedScam, setEnlargedScam] = useState(null);
  const [editScam, setEditScam] = useState(null);
  const [editForm, setEditForm] = useState({ scamType: '', region: '', description: '', files: [], removedFiles: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    console.log('Initial user from localStorage:', storedUser);
    console.log('Token present:', !!token);
    if (!storedUser || !token) {
      console.warn('No user or token, redirecting to login');
      window.location.href = '/login';
    } else {
      setUser(storedUser);
    }
  }, []);

  const fetchScams = async () => {
    try {
      const response = await getScams(filters);
      setScams(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching scams:', err);
      setError(t('scams.fetchError'));
    }
  };

  useEffect(() => {
    if (user) fetchScams();
  }, [filters, user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleEnlarge = (scam) => {
    console.log('Toggling enlarge for scam:', scam._id);
    setEnlargedScam(enlargedScam?._id === scam._id ? null : scam);
  };

  const isUserCreator = (scam) => {
    if (!user) return false;
    if (user.email && scam.creatorEmail && user.email === scam.creatorEmail) {
      return true;
    }
    if (user._id && scam.userId && user._id === scam.userId.toString()) {
      return true;
    }
    return false;
  };

  const handleImageClick = (e, scam) => {
    e.stopPropagation();
    if (isUserCreator(scam)) {
      openEditContainer(scam);
    } else {
      toggleEnlarge(scam);
    }
  };

  const openEditContainer = (scam) => {
    console.log('Opening edit container for scam:', scam._id);
    console.log('User:', user);
    console.log('EditScam:', scam);
    console.log('Authorization check:', {
      userEmail: user?.email,
      scamCreatorEmail: scam.creatorEmail,
      emailMatch: user && user.email && scam.creatorEmail && user.email === scam.creatorEmail,
      userId: user?._id,
      scamUser: scam.userId?.toString(),
      userIdMatch: user && user._id && scam.userId && user._id === scam.userId.toString(),
    });
    setEditScam(scam);
    setEditForm({
      scamType: scam.scamType,
      region: scam.region,
      description: scam.description,
      files: [],
      removedFiles: [],
    });
  };

  const closeEditContainer = () => {
    console.log('Closing edit container');
    setEditScam(null);
    setEditForm({ scamType: '', region: '', description: '', files: [], removedFiles: [] });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setEditForm((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setEditScam((prev) => ({
      ...prev,
      files: prev.files.filter((url) => url !== imageUrl),
    }));
    setEditForm((prev) => ({
      ...prev,
      removedFiles: [...prev.removedFiles, imageUrl],
    }));
  };

  const handleRemoveNewImage = (index) => {
    setEditForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting edit for scam:', editScam._id, 'with data:', editForm);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const formData = new FormData();
      formData.append('scamType', editForm.scamType);
      formData.append('region', editForm.region);
      formData.append('description', editForm.description);
      editForm.files.forEach((file) => formData.append('files', file));
      formData.append('removedFiles', JSON.stringify(editForm.removedFiles));
      const response = await updateScam(editScam._id, formData, token);
      console.log('Update response:', response.data);
      setError(null);
      await fetchScams();
      closeEditContainer();
      setEnlargedScam(null);
      alert(t('scams.editSuccess'));
    } catch (err) {
      console.error('Error updating scam:', err.response?.data || err.message);
      setError(t('scams.editError'));
    }
  };

  const handleDelete = async (scamId) => {
    if (!window.confirm(t('scams.confirmDelete'))) return;
    console.log('Deleting scam:', scamId);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await deleteScam(scamId, token);
      console.log('Delete response:', response.data);
      setError(null);
      await fetchScams();
      closeEditContainer();
      setEnlargedScam(null);
      alert(t('scams.deleteSuccess'));
    } catch (err) {
      console.error('Error deleting scam:', err.response?.data || err.message);
      setError(t('scams.deleteError'));
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await downloadScamPDF(id, token);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scam-report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download PDF error:', err.response?.data || err.message);
      setError(t('scams.downloadPDFError'));
    }
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
  };

  if (!user) return <p>{t('scams.loading')}</p>;

  const isLawEnforcement = user.role === 'law_enforcement';

  return (
    <section className="scams-container" aria-labelledby="scams-title">
      <h2 id="scams-title">{t('scams.title')}</h2>
      <div className="filter-container">
        <h3>{t('scams.filterTitle')}</h3>
        <form className="filter-form">
          <div className="form-group">
            <label htmlFor="scamType">{t('scams.filterByType')}</label>
            <select
              id="scamType"
              name="scamType"
              value={filters.scamType}
              onChange={handleFilterChange}
              aria-label={t('scams.filterByType')}
            >
              <option value="">{t('scams.allTypes')}</option>
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
            <label htmlFor="region">{t('scams.filterByRegion')}</label>
            <input
              id="region"
              name="region"
              type="text"
              value={filters.region}
              onChange={handleFilterChange}
              placeholder={t('scams.regionPlaceholder')}
              aria-label={t('scams.region')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">{t('scams.startDate')}</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange}
              aria-label={t('scams.startDate')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">{t('scams.endDate')}</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange}
              aria-label={t('scams.endDate')}
            />
          </div>
        </form>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {scams.length === 0 ? (
        <p>{t('scams.noScams')}</p>
      ) : (
        <div className="scams-grid">
          {scams.map((scam) => (
            <div
              key={scam._id}
              className={`scam-card ${enlargedScam?._id === scam._id ? 'enlarged' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => toggleEnlarge(scam)}
              onKeyDown={(e) => e.key === 'Enter' && toggleEnlarge(scam)}
              aria-label={t('scams.viewDetails', { type: scam.scamType })}
            >
              <h3>{scam.scamType}</h3>
              <p>{t('scams.region')}: {scam.region}</p>
              <p>
                {t('scams.postedBy')}: {scam.isAnonymous ? t('scams.anonymous') : scam.creatorEmail || t('scams.unknown')}
              </p>
              <p>{t('scams.date')}: {formatDate(scam.createdAt)}</p>
              <p className="description">{scam.description}</p>
              {scam.files?.length > 0 && (
                <div className="evidence">
                  <img
                    src={scam.files[0]}
                    alt={`${t('scams.evidence')} 1`}
                    className="evidence-preview"
                    onClick={(e) => handleImageClick(e, scam)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImageClick(e, scam)}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      isUserCreator(scam) 
                        ? t('scams.viewEditContainer') 
                        : t('scams.enlargeImage')
                    }
                    onError={handleImageError}
                    style={{ cursor: 'pointer' }}
                  />
                  {isUserCreator(scam) && (
                    <div className="creator-badge" title={t('scams.yourPost')}>
                      ✏️
                    </div>
                  )}
                </div>
              )}
              {enlargedScam?._id === scam._id && scam.files?.length > 1 && (
                <div className="enlarged-content">
                  <h4>{t('scams.additionalEvidence')}</h4>
                  {scam.files?.slice(1).map((file, index) => (
                    <img
                      key={index + 1}
                      src={file}
                      alt={`${t('scams.evidence')} ${index + 2}`}
                      className="evidence-full"
                      onError={handleImageError}
                    />
                  ))}
                </div>
              )}
              {(isUserCreator(scam) || isLawEnforcement) && (
                <div className="scam-actions">
                  {isUserCreator(scam) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditContainer(scam);
                      }}
                      className="edit-button"
                      aria-label={t('scams.edit')}
                    >
                      {t('scams.edit')}
                    </button>
                  )}
                  {(isUserCreator(scam) || isLawEnforcement) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(scam._id);
                      }}
                      className="delete-button"
                      aria-label={t('scams.delete')}
                    >
                      {t('scams.delete')}
                    </button>
                  )}
                  {isLawEnforcement && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPDF(scam._id);
                      }}
                      className="download-pdf-button"
                      aria-label={t('scams.downloadPDF')}
                    >
                      {t('scams.downloadPDF')}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {editScam && (
        <div className="edit-container" role="dialog" aria-labelledby="edit-container-title">
          <div className="edit-container-content">
            <h3 id="edit-container-title">{t('scams.editScam')}</h3>
            {editScam.files?.length > 0 && (
              <div className="evidence">
                {editScam.files.map((file, index) => (
                  <div key={index} className="existing-image-container">
                    <img
                      src={file}
                      alt={`${t('scams.evidence')} ${index + 1}`}
                      className="edit-evidence"
                      onError={handleImageError}
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveExistingImage(file)}
                      aria-label={t('scams.removeImage', { index: index + 1 })}
                    >
                      {t('scams.remove')}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {editForm.files.length > 0 && (
              <div className="new-images">
                <h4>{t('scams.newImages')}</h4>
                {editForm.files.map((file, index) => (
                  <div key={index} className="new-image-container">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`${t('scams.newImage')} ${index + 1}`}
                      className="edit-evidence"
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveNewImage(index)}
                      aria-label={t('scams.removeNewImage', { index: index + 1 })}
                    >
                      {t('scams.remove')}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="editScamType">{t('report.scamType')}</label>
                <select
                  id="editScamType"
                  name="scamType"
                  value={editForm.scamType}
                  onChange={handleEditChange}
                  required
                  aria-label={t('report.scamType')}
                >
                  <option value="Phishing">{t('report.phishing')}</option>
                  <option value="UPI Fraud">{t('report.upiFraud')}</option>
                  <option value="Investment Scam">{t('report.investment')}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editRegion">{t('report.region')}</label>
                <input
                  id="editRegion"
                  name="region"
                  type="text"
                  value={editForm.region}
                  onChange={handleEditChange}
                  required
                  aria-label={t('report.region')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDescription">{t('report.description')}</label>
                <textarea
                  id="editDescription"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  maxLength="500"
                  required
                  aria-label={t('report.description')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editImages">{t('scams.uploadImages')}</label>
                <input
                  id="editImages"
                  name="files"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  aria-label={t('scams.uploadImages')}
                />
              </div>
              {isUserCreator(editScam) ? (
                <div className="edit-buttons">
                  <button type="submit" className="edit-save">
                    {t('scams.save')}
                  </button>
                  <button type="button" onClick={() => handleDelete(editScam._id)} className="edit-delete">
                    {t('scams.delete')}
                  </button>
                </div>
              ) : (
                <p className="error" role="alert">{t('scams.notAuthorized')}</p>
              )}
            </form>
            <button
              onClick={closeEditContainer}
              className="edit-container-close"
              aria-label={t('scams.closeEditContainer')}
            >
              {t('scams.closeEditContainer')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Scams;