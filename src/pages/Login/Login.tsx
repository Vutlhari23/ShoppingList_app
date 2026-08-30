import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Text } from '../../components/Text/Text';
import { TextInput } from '../../components/TextInput/TextInput';
import { Button } from '../../components/Button/Button';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import styles from '../../pages/Login/Login.module.css';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/home', { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContainer className={styles['login-container']}>
      <ContentContainer className={styles['login-content']}>
        <Text className={styles.text} variant="h1">
          Log In
        </Text>
        <label htmlFor="email">Email</label>
        <TextInput
          className={styles['text-input']}
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <TextInput
          className={styles['text-input']}
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
        <Button
          label={loading ? 'Logging in…' : 'Login'}
          onClick={handleSubmit}
          className={styles['btn']}
        />
        <Text className={styles.text} variant="h5">
          Don't have an account? <Link to="/register">Register</Link>
        </Text>
      </ContentContainer>
    </ContentContainer>
  );
};
