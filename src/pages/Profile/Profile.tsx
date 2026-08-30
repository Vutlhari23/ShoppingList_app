import { Navbar } from '../../components/Navbar/Navbar';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <ContentContainer style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <ContentContainer style={{ padding: 24, flex: 1 }}>
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
      </ContentContainer>
    </ContentContainer>
  );
};
