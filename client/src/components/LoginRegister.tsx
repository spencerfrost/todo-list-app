import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api'; // Adjust this to match your API URL

const LoginRegister: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const exists = await checkUserExists(email);
      setIsExistingUser(exists);
      setStep(2);
    } catch (err) {
      setError('Error checking email. Please try again.');
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isExistingUser) {
      // Handle login
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usernameOrEmail: email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          // Call login without arguments
          login();
        } else {
          setError(data.error || 'Login failed. Please try again.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    } else {
      // Handle registration
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          // Call login without arguments after successful registration
          login();
        } else {
          setError(data.error || 'Registration failed. Please try again.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setIsExistingUser(null);
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {step === 1 ? 'Welcome' : isExistingUser ? 'Login' : 'Register'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={step === 1 ? handleEmailSubmit : handleFinalSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            disabled={step !== 1}
          />
        </div>
        {step === 2 && (
          <>
            {!isExistingUser && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {!isExistingUser && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            )}
          </>
        )}
        <div className="flex justify-between items-center">
          {step === 2 && (
            <button
              type="button"
              onClick={handleBackToEmail}
              className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {step === 1 ? 'Continue' : isExistingUser ? 'Login' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginRegister;