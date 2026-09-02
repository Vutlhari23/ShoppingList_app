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
      <ContentContainer className={styles['navbar-header']}>
      <i className="bi bi-cart-check-fill" style ={{width: "40px", height: "24px"}}></i>
      <h2>ShoppingList</h2>
     
      </ContentContainer>
      
      {user?.email && <h4 style={{ fontSize: 12 }}>{user.name+" "+ user.surname} </h4>}
    
      <Link to="/home" className={styles.link}>
      <i className="bi bi-house-heart-fill"></i>
           Home
      </Link>
      <Link to="/profile" className={styles.link}>
           <i className="bi bi-person-circle"></i>
            Profile
      </Link>
       <Link to="/shoppinglist" className={styles.link}>
        My lists
      </Link>
      <button type="button" className={styles.link} onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>
        Logout
      </button>
    </ContentContainer>
  );
};

export default Navbar;
