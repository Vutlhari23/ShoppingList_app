import { Navbar } from '../../components/Navbar/Navbar';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button/Button';
import { useState } from 'react';

import styles from "../../components/Modals/AddItemModal.module.css"

export const Profile = () => {
   
  const [isOpenModal, setIsOpenModal] = useState(false);
 

  const { user } = useAuth();  
   const [name, setName] = useState(user?.name);
   const [surname,setSurname] = useState(user?.surname);
   const [cellno,setCellNo ] = useState(user?.cellNo);


      console.log("RUNNING THE CODE");

   
 const editProfile = async ()=>{

console.log("iNSIDE THE FUNCTION");
  
    const response = await fetch(`http://localhost:3000/users/${user?.id}`, 
        {method : "PATCH",
          headers:{ "Content-Type" : "application/json", 
            "Authorization" : `Bearer ${localStorage.getItem("accessToken")}`
          },
          
            body: JSON.stringify({"name" :name, "surname" :surname, "CellNo":cellno})
        }
  
    )
    if(!response.ok){
      throw new Error("Eroor")

    }
    const data= response.json();
    console.log(data);
    
    setIsOpenModal(false);

 }

  return (
    <ContentContainer  style={{ display: 'flex' , flexDirection: "row"}} >
    <ContentContainer style={{ display: 'flex' , flexDirection: "row", minHeight: '100vh' }}>
      <Navbar />
      <ContentContainer style={{ padding: 24,gap:"20px"}}>
        <ContentContainer>
        <h1>Profile</h1>
        {user ? (
          <div>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.name && (
              <p>
                <strong>Name:</strong> {user.name}
              </p>
            )}
            {user.surname && (
              <p>
                <strong>Surname:</strong> {user.surname}
              </p>
            )}
            {user.cellNo && (
              <p>
                <strong>Cell:</strong> {user.cellNo}
              </p>
            )}
          </div>
        ) : (
          <p>No profile information available.</p>
        )}
         <Button
      label="Edit"
      onClick={()=>setIsOpenModal(true)}
      ></Button>
      </ContentContainer>
      


{isOpenModal &&(

      <ContentContainer>





        <div >
          <div>
            <h2>Edit Profile</h2>
            <p>Update your personal information</p>
          </div>

    
        </div>



          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              type="text"
              placeholder="Enter your surname"
               value={surname}
            onChange={(e) => setSurname(e.target.value)}
              
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cellNo">Cell Number</label>
            <input
              id="cellNo"
              type="tel"
              placeholder="Enter your cell number"
               value={cellno}
             onChange={(e) => setCellNo(e.target.value)}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              
            >
              Cancel
            </button>

            <button
              type="submit"
              
              onClick={editProfile }
            >
              Save Changes
            </button>
          </div>
          </ContentContainer>
)
}
          </ContentContainer>


          </ContentContainer>


    
    




    </ContentContainer>
  
  );
};


 /*const login = useCallback(
    async (emg, password: stringail: strin) => {
      const data = await apiFetch<AuthResponse>(
        '/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        },
        false
      );
      persistSession(data.accessToken, data.user);
      localStorage.setItem("email",email);
    },
    [persistSession]
  );*/

 


