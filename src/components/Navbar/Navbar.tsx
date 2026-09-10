import { Link, useNavigate } from 'react-router-dom';
import { ContentContainer } from '../ContentContainer/ContentContainer';
import styles from '../Navbar/Navbar.module.css';
import { useAuth } from '../../context/AuthContext';
import userImage from '../../assets/user.png'

export const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <ContentContainer className={styles['navbar']}>
      <ContentContainer className={styles['all-links']}>
      <ContentContainer className={styles['navbar-header']}>
      <i className="bi bi-cart-check-fill" style ={{width: "40px", height: "24px"}}></i>
      <h1>ShoppingList</h1>
     
      </ContentContainer>
      
      
    <ContentContainer>
      <Link to="/home" className={styles.links}>
      <i className="bi bi-house-heart-fill"></i>
           Home
      </Link>
     
       <Link to="/shoppinglist" className={styles.links}>
       <i className="bi bi-list-stars"></i>
        My lists
      </Link>
       <Link to="/profile" className={styles.links}>
           <i className="bi bi-person-circle"
           style={{fontWeight: "700px"}}
           ></i>
            Profile
      </Link>
      </ContentContainer>
      </ContentContainer>
      <ContentContainer className={styles['logout']}>
      <ContentContainer className={styles.user}>
       <img 
       src={userImage}/>
      {user?.email && <h2 style={{ fontSize: "15px", bottom:"12px"}}>{user.name+" "+ user.surname} </h2>}
     </ContentContainer>
     
      <button type="button" className={styles.link} onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>
        Logout
      </button>
      </ContentContainer>
      
    </ContentContainer>
  );
};

export default Navbar;
