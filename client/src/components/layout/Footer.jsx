import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <p>{t('footer.text', { year: new Date().getFullYear() })}</p>
    </footer>
  );
}

export default Footer;