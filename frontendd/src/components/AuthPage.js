import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Auths.css';

const AuthPage = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login request
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        const token = response.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        // Register request
        await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
        setIsLogin(true);
        toast.success('Registration successful. Please login.');
      }
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <>
    <div className='auth-all'>
    <div className='auth-page'>
      <ToastContainer />
      <h1 className='auth-heading'>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        <div className='auth-form'>
          {!isLogin && (
            <input
              className='auth-input'
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          )}
          <input
            className='auth-input'
            type="text"
            placeholder="User Name"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className='auth-input'
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='auth-btn' type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button className='auth-text' onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
      </button>
    </div>
    </div>
    </>
  );
};

export default AuthPage;
