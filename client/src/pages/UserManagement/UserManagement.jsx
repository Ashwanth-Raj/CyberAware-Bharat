import React, { useState, useEffect, useContext } from 'react'; // Add useContext
import { useTranslation } from 'react-i18next';
import { getAllUsers, deleteUser } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext'; // Add import
import './UserManagement.css';

const UserManagement = () => {
  const { t } = useTranslation();
  const { user, token } = useContext(AuthContext); // Use token from context
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(token);
        setUsers(response.data);
      } catch (err) {
        setError(t('scams.fetchUsersError'));
        console.error('Fetch users error:', err);
      }
    };

    fetchUsers();
  }, [token, t]);

  const handleDeleteUser = async (id) => {
    if (window.confirm(t('scams.confirmDeleteUser'))) {
      try {
        await deleteUser(id, token);
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        setError(t('scams.deleteUserError'));
        console.error('Delete user error:', err);
      }
    }
  };

  return (
    <div className="user-management-container">
      <h2>{t('scams.userManagement')}</h2>
      {error && <div className="error">{error}</div>}
      <div className="users-grid">
        {users.map((u) => (
          <div key={u._id} className="user-card">
            <p><strong>{t('scams.email')}:</strong> {u.email}</p>
            <p><strong>{t('scams.role')}:</strong> {u.role}</p>
            <p><strong>{t('scams.createdAt')}:</strong> {new Date(u.createdAt).toLocaleString()}</p>
            <button
              className="delete-user"
              onClick={() => handleDeleteUser(u._id)}
              disabled={u._id === user._id}
            >
              {t('scams.deleteUser')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;