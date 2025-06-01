import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../contexts/AuthContext';
import ScamDetailModal from './ScamDetailModal';
import { truncateText } from '../../../utils/formatters';

function ScamCard({ scam, onEdit, onDelete }) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const isOwnScam = user && user.email && scam.creatorEmail === user.email && !scam.isAnonymous;

  return (
    <>
      <div
        className="card"
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowModal(true)}
        aria-label={t('scams.viewDetails', { type: scam.scamType })}
      >
        <h3>{scam.scamType}</h3>
        <p>{truncateText(scam.description, 100)}</p>
        <p><strong>{t('scams.region')}</strong>: {scam.region || t('scams.unknown')}</p>
        <p>{scam.isAnonymous ? t('scams.anonymous') : scam.creatorEmail || t('scams.unknown')}</p>
        {isOwnScam && (
          <div className="card-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(scam);
              }}
              className="btn btn-secondary"
              aria-label={t('scams.edit')}
            >
              {t('scams.edit')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(scam._id);
              }}
              className="btn btn-danger"
              aria-label={t('scams.delete')}
            >
              {t('scams.delete')}
            </button>
          </div>
        )}
      </div>
      <ScamDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        scam={scam}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}

export default ScamCard;