import { useState } from 'react';
import {Text} from '../../components/Text/Text';
import { TextInput } from '../../components/TextInput/TextInput';
import { Button } from '../../components/Button/Button';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import styles from '../../pages/Login/Login.module.css'

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
        <Text variant="h1">Log In</Text>
         <TextInput
         type='text'
         label='Username :'
         value={username}
         onChange={(e)=> setUsername(e.target.value)}
         
         />
         <TextInput
         type='password'
         label ='Password'
         onChange={(e)=> setPassword(e.target.value)}
         />
         <Button
         label= 'Log in'
         onClick={handleSubmit}
         
         >
         </Button>
      </ContentContainer>

 </ContentContainer> 

      
  
  )
}


