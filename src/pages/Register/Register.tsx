import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import styles from '../Register/Register.module.css';
import { Text } from '../../components/Text/Text';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/api';

export const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cellNo, setCellNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
        surname: surname.trim() || undefined,
        cellNo: cellNo.trim() || undefined,
      });
      navigate('/home', { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContainer className={styles['register-container']}>
      <ContentContainer className={styles['register-content']}>
        <h1 className={styles.heading}>Register</h1>
        <label>Name</label>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label>Surname</label>
        <input
          className={styles.input}
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <br />
        <label>Email</label>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password</label>
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label>Cell Number</label>
        <input
          className={styles.input}
          type="tel"
          value={cellNo}
          onChange={(e) => setCellNo(e.target.value)}
        />
        <br />
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button
          className={styles.btn}
          onClick={handleRegisterSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting…' : 'Submit'}
        </button>
        <Text className={styles.text} variant="h5">
          Already have an account? <Link to="/login">Login</Link>
        </Text>
      </ContentContainer>
    </ContentContainer>
  );
};
