import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

function ScamDetailModal({ show, onHide, scam, onEdit, onDelete }) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const isOwnScam = user && user.email && scam.creatorEmail === user.email && !scam.isAnonymous;

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="scam-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="scam-modal-title">{scam.scamType}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{scam.description}</p>
        <p><strong>{t('scams.region')}</strong>: {scam.region || t('scams.unknown')}</p>
        <p>
          <strong>{t('scams.postedBy')}</strong>{' '}
          {scam.isAnonymous ? t('scams.anonymous') : scam.creatorEmail || t('scams.unknown')}
        </p>
        {scam.files?.length > 0 && (
          <div>
            <h4>{t('scams.evidence')}</h4>
            {scam.files.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${t('scams.evidence')} ${index + 1}`}
                style={{ maxWidth: '100%', marginBottom: '10px' }}
              />
            ))}
          </div>
        )}
        <div>
          <h4>{t('scams.comments')}</h4>
          <p>{t('scams.noComments')}</p>
        </div>
        {isOwnScam && (
          <div className="card-actions">
            <Button
              variant="secondary"
              onClick={() => onEdit(scam)}
              aria-label={t('scams.edit')}
              className="btn btn-secondary"
            >
              {t('scams.edit')}
            </Button>
            <Button
              variant="danger"
              onClick={() => onDelete(scam._id)}
              aria-label={t('scams.delete')}
              className="btn btn-danger"
            >
              {t('scams.delete')}
            </Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} aria-label={t('report.close')} className="btn btn-secondary">
          {t('report.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ScamDetailModal;