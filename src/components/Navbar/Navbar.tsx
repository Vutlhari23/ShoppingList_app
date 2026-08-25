import {Link} from "react-router-dom"

export const Navbar = () => {
  return (

   <div style={{ width: "100px" ,height:"100px",display:" flex" ,gap : "15px"}}>
       <h3>My navbar</h3>
       <Link to="/login">Login</Link>
       <Link to="/register">Register</Link>
       <Link to="/Home">Home</Link>
       <Link to="/Profile">Profile</Link>
     </div>
  )
}

export default Navbar
