import { useState } from 'react';
import {Text} from ''
export const Login = () => {


   const [username,setUsername] = useState('');
   const [password,setPassword] = useState('');




   const  handleSubmit = async ()=>{
   
          const data=  await fetch(`http://localhost:3000/login`,
               {method: 'POST',
                   headers :{'Content-Type':'application/Json'},
                   body : JSON.stringify({"email": "vutlhari2m@gmail.com", "password" : "vutlhari@23D"}),
          });

    if(!data.ok){
        throw new Error('Https Error');

     }else{
          const Parseddata= await data.json();
          console.log("sucess",Parseddata.accessToken)
           localStorage.setItem("accessToken", Parseddata.accessToken)
}

}


  return (
    <div>

          
        <Text variant="h1"></Text>



        <h1>Login</h1>
        <label>Name</label>
        <input type="text"  
        value={username}
        onChange={(e)=> setUsername(e.target.value)}
         ></input><br/>
       <label>Email</label>
   
       <label> Password</label>
        <input type="password" value={password}
        onChange={(e)=> setPassword(e.target.value)}></input>
        
      
    
     <button onClick={handleSubmit}>Submit</button>
        

      
    </div>
  )
}


