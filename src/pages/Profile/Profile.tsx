import { Navbar } from '../../components/Navbar/Navbar';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button/Button';
import { useState } from 'react';

import styles from "./Profile.module.css";

export const Profile = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { user } = useAuth();
  const [name, setName] = useState(user?.name);
  const [surname, setSurname] = useState(user?.surname);
  const [cellno, setCellNo] = useState(user?.cellNo);

  const editProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ name, surname, cellNo: cellno }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log(data);

      setIsOpenModal(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <ContentContainer className={styles.pageWrapper}>
      <Navbar />
      <ContentContainer className={styles.content}>
        <h1>Profile</h1>

        {user ? (
          <div className={styles.infoBlock}>
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
          onClick={() => setIsOpenModal(true)}
          className={styles.editButton}
        />

        {isOpenModal && (
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <h2>Edit Profile</h2>
              <p>Update your personal information</p>

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
                <Button
                label='Cancel'
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsOpenModal(false)}
                />
                

                <Button
                 label='Save changes'
                  type="submit"
                  className={styles.saveButton}
                  onClick={editProfile}
                />
                
              </div>
            </div>
          </div>
        )}
      </ContentContainer>
    </ContentContainer>
  );
};