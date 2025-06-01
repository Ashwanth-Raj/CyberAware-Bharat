import { useTranslation } from 'react-i18next';
import './Help.css';

function Help() {
  const { t } = useTranslation();

  return (
    <section className="help-container" aria-labelledby="help-title">
      <h2 id="help-title">{t('help.title')}</h2>
      <div className="help-content">
        <h3>{t('help.portalTitle')}</h3>
        <p>{t('help.portalDescription')}</p>
        <p>
          <strong>{t('help.websiteLabel')}:</strong>{' '}
          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('help.portalLinkAria')}
          >
            https://cybercrime.gov.in/
          </a>
        </p>
        <p>{t('help.portalPurpose')}</p>
        <h3>{t('help.howToFileTitle')}</h3>
        <p>{t('help.howToFileIntro')}</p>
        <div className="screenshots-grid">
          <div className="screenshot-item">
            <img
              src="https://sudhirrao.com/wp-content/uploads/2024/05/Cyber-Crime-Complaint-Online-Delhi-1.webp"
              alt={t('help.screenshot1Alt')}
              className="screenshot-img"
            />
            <p className="screenshot-caption">{t('help.screenshot1Caption')}</p>
          </div>
          <div className="screenshot-item">
            <img
              src="https://media.licdn.com/dms/image/v2/D4D12AQEMqhBjaGsjag/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1657628728916?e=2147483647&v=beta&t=XknqnvdYhvoFQAt8rTeU0V3MQPeWga6dr4toaO2ys_4"
              alt={t('help.screenshot2Alt')}
              className="screenshot-img"
            />
            <p className="screenshot-caption">{t('help.screenshot2Caption')}</p>
          </div>
          <div className="screenshot-item">
            <img
              src="https://www.vidhikarya.com/images/blogContentBodyImages/921-pic-10.png?version=2"
              alt={t('help.screenshot3Alt')}
              className="screenshot-img"
            />
            <p className="screenshot-caption">{t('help.screenshot3Caption')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;