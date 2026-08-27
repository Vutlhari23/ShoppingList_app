import { useState } from 'react';
import {Text} from '../../components/Text/Text';
import { TextInput } from '../../components/TextInput/TextInput';
import { Button } from '../../components/Button/Button';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import styles from '../../pages/Login/Login.module.css'
import {Link} from "react-router-dom"

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


   <ContentContainer  className= {styles['login-container']}>
      <ContentContainer className= {styles['login-content']} > 
        <Text 
        className={styles.text}
        
        variant="h1">Log In</Text>
        <label htmlFor="username ">Username</label>
         <TextInput
          className={styles['text-input']}
         id="username"
         name="username"
         type='text'
         value={username}
         onChange={(e)=> setUsername(e.target.value)}
         
         />
        <label htmlFor="password">Password</label>
         <TextInput 
         className={styles['text-input']}
         type='password'
         id='password'
         name='password'
        value={password}
         onChange={(e)=> setPassword(e.target.value)}
         />
         <Button
         label= 'Login'
         onClick={handleSubmit}
          className={styles['btn']}
         >
         </Button>
         <Text
         className={styles.text}
          variant='h5'> Don't have an account?
          <Link to="/register">Register</Link>
          </Text>

          
         

      </ContentContainer>

 </ContentContainer> 

      
  
  )
}


