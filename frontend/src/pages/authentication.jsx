import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar } from "@mui/material";
import { Video, Lock } from "lucide-react";

// Simplified Button Component
const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simplified Input Component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`block w-full px-4 py-2 bg-zinc-800 border-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

// Simplified Card Component with Wider Box Shadow
const Card = ({ className = '', children }) => {
  return (
    <div className={`rounded-lg border bg-zinc-900 border-zinc-800 ${className} shadow-[0px_4px_20px_2px_rgba(255,255,255,0.2)]`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const Authentication = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0); // 0: Signin, 1: Signup
  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  // Handle authentication logic
  const handleAuth = async () => {
    try {
      if (formState === 0) {
        const result = await handleLogin(username, password);
        // Handle successful login if needed
      }
      if (formState === 1) {
        const result = await handleRegister(name, username, password);
        console.log(result);
        setUsername("");
        setMessage("Registration successful! You can now sign in.");
        setOpen(true);
        setError("");
        setFormState(0);
        setPassword("");
      }
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "An error occurred";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Centered and Shadowed Card */}
      <div className="w-full max-w-md">
        <Card className="p-6">
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-center text-white">
                {formState === 0 ? "Sign In" : "Sign Up"}
              </h2>
              <p className="text-zinc-400 text-center mt-1">
                {formState === 0 ? "Sign in to your account to continue" : "Create your account to get started"}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {formState === 1 && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              {error && <p className="text-red-500 text-center mt-2">{error}</p>}

              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAuth}>
                {formState === 0 ? "Sign In" : "Sign Up"}
              </Button>

              <div className="mt-6 text-center text-sm text-zinc-400">
                {formState === 0 ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setFormState(1)}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setFormState(0)}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Snackbar for success message */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Authentication;