import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

function AnonToggle({ isAnonymous, setIsAnonymous }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={() => setIsAnonymous(!isAnonymous)}
          onClick={() => setShowModal(true)}
          aria-label={t('report.anonymous')}
        />
        {t('report.anonymous')}
      </label>
      <Modal show={showModal} onHide={() => setShowModal(false)} aria-labelledby="anon-modal-title">
        <Modal.Header closeButton>
          <Modal.Title id="anon-modal-title">{t('report.anonymousInfo')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('report.anonymousDetails')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('report.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AnonToggle;