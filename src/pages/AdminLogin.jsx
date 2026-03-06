import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ADMIN_USERNAME = 'Nirajsavlani157';
const ADMIN_PASSWORD = 'Savlani#2211';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      navigate(createPageUrl('AdminDashboard'));
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <Card className="bg-neutral-900 border-neutral-800 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-black" />
            </div>
          </div>
          <CardTitle className="text-white text-2xl">Admin Login</CardTitle>
          <p className="text-neutral-400 text-sm mt-2">Enter your credentials to access admin panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-400 text-black h-12 font-medium"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}