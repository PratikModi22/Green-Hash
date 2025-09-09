import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [name, setName] = useState('');
  const { signIn, signUp, user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin/dashboard');
    } else if (!authLoading && user && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have admin privileges"
      });
    }
  }, [user, isAdmin, navigate, authLoading, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({
          variant: "destructive",
          title: "Admin sign up failed",
          description: error.message
        });
      } else {
        toast({
          title: "Sign up successful",
          description: "Please check your email to confirm your account. After confirmation, contact another admin to grant admin privileges."
        });
        setSignUpMode(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = signUpMode ? await signUp(email, password, name) : await signIn(email, password);
      if (error) {
        toast({
          variant: "destructive",
          title: signUpMode ? "Admin sign up failed" : "Admin sign in failed",
          description: error.message
        });
      } else if (signUpMode) {
        toast({
          title: "Sign up successful",
          description: "Please check your email to confirm your account."
        });
        setSignUpMode(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address"
      });
      return;
    }

    setResetLoading(true);
    try {
      // Check if user exists first
      const { data: userExists } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (!userExists) {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "No account found with this email address"
        });
        setResetLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Reset failed",
          description: error.message
        });
      } else {
        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions. The link will redirect you back to the admin panel."
        });
        setResetMode(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setResetLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            {signUpMode ? "Create an admin account" : "Sign in to access the admin dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetMode ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={resetLoading}>
                {resetLoading ? "Sending reset link..." : "Send Reset Link"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setResetMode(false)}
              >
                Back to Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                required
              />
            </div>
            {signUpMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 
                  (signUpMode ? "Creating account..." : "Signing in...") : 
                  (signUpMode ? "Create Admin Account" : "Sign In to Admin Panel")
                }
              </Button>
              {!signUpMode && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-sm" 
                  onClick={() => setResetMode(true)}
                >
                  Forgot your password?
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => setSignUpMode(!signUpMode)}
              >
                {signUpMode ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Not an admin?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-primary hover:underline"
                onClick={() => navigate('/')}
              >
                Go to main app
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;