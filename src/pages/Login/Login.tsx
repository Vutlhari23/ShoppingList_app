import React, { useState } from 'react'

export const Login = () => {
   const [username,setUsername] = useState('');
   const [password,setPassword] = useState('');




   const  handleSubmit = ()=>{

    localStorage.setItem("username",username);

   }







  return (
    <div>
        <h1>Login</h1>
        <label>Name</label>
        <input type="text"  
        value={username}
        onChange={(e)=> setUsername(e.target.value)}
         ></input><br/>
        <label >Surname</label>

       <label>Email</label>
   
       <label> Password</label>
        <input type="password" value={password}></input>
        
      
    
     <button onClick={handleSubmit}>Submit</button>
        

      
    </div>
  )
}


