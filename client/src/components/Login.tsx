import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { Input } from 'components/ui/input';
import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      console.log(data);
      // Handle successful registration (e.g., show success message, redirect to login)
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>Register</CardHeader>
      <CardContent>
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mb-2"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-2"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-2"
          />
          <Button type="submit">Register</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Handle successful login (e.g., update auth state, redirect to tasks page)
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>Login</CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mb-2"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-2"
          />
          <Button type="submit">Login</Button>
        </form>
      </CardContent>
    </Card>
  );
};