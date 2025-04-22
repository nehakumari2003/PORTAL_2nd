import "../App.css";
import { Button, TextField, Snackbar } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

// With Auth HOC (assuming you have this already)
function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  // Handle logout and show confirmation
  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpenSnackbar(true);
    setTimeout(() => {
      navigate("/"); // Redirect to the landing page after 4 seconds
    }, 4000); // Delay to show Snackbar for 4 seconds
  };

  return (
    <>
      {/* Main Container with Background Image */}
      <div
        className="min-h-screen bg-black flex justify-center items-center p-6 relative"
        style={{
          backgroundImage: "url('/Untitled design.png')", // Path to your image
          backgroundSize: "cover", // Ensure the image covers the page
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Portal Text in Top-left Corner */}
        <h2 className="text-white text-3xl font-semibold font-[Poppins] absolute top-6 left-6 z-10">
          PORTAL
        </h2>

        {/* Logout Button in Top-right Corner */}
        <div className="absolute top-6 right-6 z-10">
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: "transparent",  // Transparent background
              color: "white",  // White text
              border: "2px solid black",  // Black border
              "&:hover": {
                borderColor: "white",  // White border on hover
                color: "#D3D3D3",  // Light grey text on hover
                backgroundColor: "transparent",  // Keep background transparent on hover
              },
              padding: "8px 20px",  // Adjust padding for button
              borderRadius: "8px",  // Rounded corners
            }}
          >
            LOGOUT
          </Button>
        </div>

        {/* Content Container (centered card) */}
        <div className="w-full max-w-4xl flex flex-col justify-center items-center space-y-6 relative z-10">

          {/* Meeting Code Section */}
          <div
            className="flex flex-col items-center justify-center bg-zinc-900 p-8 rounded-2xl shadow-[0px_4px_40px_2px_rgba(169,169,169,0.3)] max-w-lg mx-auto"
            style={{
              width: '80%',
              height: 'auto',  // Adjust height based on content
              maxWidth: '700px',         // Maximum width for the card (adjust if needed)
              minHeight: '300px',        // Ensure the card has a minimum height
            }}
          >
            <h2 className="text-2xl font-bold text-center text-white mb-6">
              Providing Quality Video Calls Just Like Quality Education
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                label="MEETING CODE"
                variant="outlined"
                fullWidth
                className="bg-zinc-800 text-white"
                InputLabelProps={{
                    style: { color: "white" },  // Set label color to white
                  }}
                  InputProps={{
                    style: { color: "white" },  // Set input text color to white
                  }}
                  sx={{
                    borderRadius: "20px", // Apply border-radius to the input field
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px", // Apply border-radius to the outline as well
                    },
                  }}
              />
              <Button
                onClick={handleJoinVideoCall}
                variant="contained"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                Join
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* Snackbar for Logout Confirmation */}
      <Snackbar
        open={openSnackbar}
        message="You have been logged out"
        autoHideDuration={4000} // Snackbar will disappear after 4 seconds
        onClose={() => setOpenSnackbar(false)} // Close the Snackbar after 4 seconds
      />
    </>
  );
}

export default HomeComponent;
