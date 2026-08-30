import { Link, useNavigate } from 'react-router-dom';
import { ContentContainer } from '../ContentContainer/ContentContainer';
import styles from '../Navbar/Navbar.module.css';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <ContentContainer className={styles['navbar']}>
      <h3>My navbar</h3>
      {user?.email && <p style={{ fontSize: 12 }}>{user.email}</p>}
      <Link to="/home" className={styles.link}>
        Home
      </Link>
      <Link to="/profile" className={styles.link}>
        Profile
      </Link>
      <button type="button" className={styles.link} onClick={handleLogout}>
        Logout
      </button>
    </ContentContainer>
  );
};

export default Navbar;
