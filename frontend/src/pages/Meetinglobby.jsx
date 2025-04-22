import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";  // Use the useNavigate hook for navigation

const Meetinglobby = () => {
  const [username, setUsername] = useState("");  // State for storing the username
  const navigate = useNavigate();  // Hook for navigation to other routes

  // Handle the Join button click event
  const handleJoin = () => {
    if (username.trim()) {
      // If username is entered, navigate to the meeting page with username as the URL parameter
      navigate(`/meeting/${username}`);
    } else {
      alert("Please enter a valid username.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center text-white">Enter Meeting Details</h2>

        {/* Username Input */}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  // Handle the username input change
          className="w-full mb-4"
          variant="outlined"
          color="primary"
          autoFocus
        />

        {/* Meeting Code Input (disabled, static for now) */}
        <TextField
          label="Meeting Code"
          value="someRoom"
          className="w-full mb-4"
          variant="outlined"
          color="primary"
          disabled
        />

        {/* Join Meeting Button */}
        <Button
          onClick={handleJoin}  // Call handleJoin when button is clicked
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold"
        >
          Join Meeting
        </Button>
      </div>
    </div>
  );
};

export default Meetinglobby;
