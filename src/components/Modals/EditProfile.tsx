
import styles from './AddItemModal.module.css';
import { Overlay } from '../Overlay/Overlay';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { data } from 'react-router-dom';
import { API_URL } from '../../lib/api';

type editProfileProps= {
    
    onClose :()=> void;
 

}

export const EditProfile= ({onClose}:editProfileProps) => {

   const { user } = useAuth();
   const [name, setName] = useState(user?.name);
   const [surname,setSurname] = useState(user?.surname);
   const [cellno,setCellNo ] = useState(user?.cellNo);


      console.log("RUNNING THE CODE");

   
 const editProfile = async ()=>{

console.log("iNSIDE THE FUNCTION");
  
    const response = await fetch(`http://localhost:3000/user/${user?.email}`, 
        {method : "PATCH",
          headers:{ "Content-Type " : "application/json"},
            body: JSON.stringify({"name" :name, "surname" :surname, "CellNo":cellno})
        },
  
    )
    if(!response.ok){
      throw new Error("Eroor")

    }
    const data= response.json();
    console.log(data);
    
      console.log("EDIITED");

 }


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

 


  return (

    <Overlay>
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.modalHeader}>
          <div>
            <h2>Edit Profile</h2>
            <p>Update your personal information</p>
          </div>

          <button className={styles.closeButton}>
            ×
          </button>
        </div>

        <form>

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
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              onClick={editProfile}
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
    </Overlay>
  );
};
