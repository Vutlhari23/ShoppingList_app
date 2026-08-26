import {Link} from "react-router-dom"
import { ContentContainer } from "../ContentContainer/ContentContainer"
import styles from  '../Navbar/Navbar.module.css'

export const Navbar = () => {
  return (

 
    <ContentContainer className={styles['navbar'] }>
       <h3>My navbar</h3>
       <Link to="/Home" className={styles.link}>Home</Link>
       <Link to="/Profile" className={styles.link}> Profile</Link>
     </ContentContainer>
  )
}

export default Navbar
