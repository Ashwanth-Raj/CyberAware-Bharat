import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function HeroSection() {
  const { t } = useTranslation();
  return (
    <section style={{ textAlign: 'center', padding: '50px 0' }} aria-labelledby="hero-title">
      <h1 id="hero-title">{t('home.title')}</h1>
      <p className="home-description">{t('home.description')}</p>
      <Link to="/report" className="btn btn-primary" aria-label={t('home.reportNow')}>
        {t('home.reportNow')}
      </Link>
    </section>
  );
}

export default HeroSection;