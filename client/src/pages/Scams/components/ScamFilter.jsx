import { useTranslation } from 'react-i18next';

function ScamFilter({ setFilters }) {
  const { t } = useTranslation();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-container" aria-labelledby="filter-title">
      <h3 id="filter-title">{t('scams.filterTitle')}</h3>
      <div className="form-group">
        <label htmlFor="scamType">{t('scams.filterByType')}</label>
        <select
          id="scamType"
          name="scamType"
          onChange={handleFilterChange}
          aria-label={t('scams.filterByType')}
        >
          <option value="">{t('scams.allTypes')}</option>
          <option value="Phishing">{t('report.phishing')}</option>
          <option value="UPI Fraud">{t('report.upiFraud')}</option>
          <option value="Investment Scam">{t('report.investment')}</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="region">{t('scams.filterByRegion')}</label>
        <input
          id="region"
          name="region"
          type="text"
          onChange={handleFilterChange}
          placeholder={t('scams.regionPlaceholder')}
          aria-label={t('scams.filterByRegion')}
        />
      </div>
    </div>
  );
}

export default ScamFilter;