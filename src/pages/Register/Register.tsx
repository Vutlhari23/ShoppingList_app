import React, { useState } from 'react'

export const Register = () => {
   const [name,setName] = useState('');
   const [surname,setSurname] = useState('');
   const [email,setEmail] = useState('');
   const [password,setPassword] = useState('');
    const [cellNo,setCellNo] = useState('');



   const  handleRegisterSubmit = ()=>{

    

   }







  return (
    <div>
        <h1>Register</h1>
        <label>Name</label>
        <input type="text"  
        value={name}
        onChange={(e)=> setName(e.target.value)}
         ></input><br/>
        <label >Surname</label>
       <input type="text"  value={surname}
         onChange={(e)=> setSurname(e.target.value)}></input><br/>
       <label>Email</label>
       <input type="email" value={email}
         onChange={(e)=> setEmail(e.target.value)}></input><br/>
       <label> Password</label>
        <input type="password" value={password}
        
          onChange={(e)=> setPassword(e.target.value)}></input><br/>
        <label >Cell Number</label>
        <input type="cellno" value={cellNo}
          onChange={(e)=> setCellNo(e.target.value)}></input><br/>

     <button onClick={handleRegisterSubmit}>Submit</button>
        

      
    </div>
  )
}


