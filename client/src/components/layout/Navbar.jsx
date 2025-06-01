import { useContext, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  console.log('Navbar user:', user);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng); // Persist language choice
  };

  // Load persisted language on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-links">
        <Link to="/" aria-label={t('navbar.home')}>
          {t('navbar.home')}
        </Link>
        <Link to="/report" aria-label={t('navbar.report')}>
          {t('navbar.report')}
        </Link>
        <Link to="/scams" aria-label={t('navbar.scams')}>
          {t('navbar.scams')}
        </Link>
        {user && user.role === 'law_enforcement' && (
          <Link to="/user-management" aria-label={t('navbar.userManagement')}>
            {t('navbar.userManagement')}
          </Link>
        )}
        <Link to="/help" aria-label={t('navbar.help')}>
          {t('navbar.help')}
        </Link>
      </div>
      <div className="navbar-right">
        <div className="navbar-auth">
          {user ? (
            <>
              <span className="navbar-username" aria-label="Logged in user">
                {t('navbar.welcome', { username: user.email })}
              </span>
              <button onClick={handleLogout} aria-label={t('navbar.logout')}>
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" aria-label={t('navbar.login')}>
                {t('navbar.login')}
              </Link>
              <Link to="/register" aria-label={t('navbar.register')}>
                {t('navbar.register')}
              </Link>
            </>
          )}
        </div>
        <div className="navbar-language">
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;