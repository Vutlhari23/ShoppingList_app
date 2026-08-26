import './App.css'
import {Routes,Route } from "react-router-dom"
import {Login} from './pages/Login/Login'
import {Register} from './pages/Register/Register'
import {Profile} from './pages/Profile/Profile'
import {Home} from './pages/Home/Home'
import {Navbar} from './components/Navbar/Navbar'


function App() {

  return (
    <>
   
  

 <Routes>
    <Route path="/Register" element={<Register/>}/>
    <Route path="/Login" element={<Login/>}/>
    <Route path="/Profile" element={<Profile/>}/>
    <Route path="/Home" element={<Home/>}/>
</Routes>
  

  
    </>
  )
}

export default App
