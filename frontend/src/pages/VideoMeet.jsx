import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
  "iceServers": [
    { "urls": "stun:stun.l.google.com:19302" }
  ]
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoref = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState(true);
  let [audio, setAudio] = useState(true);
  let [screen, setScreen] = useState(false);
  let [showModal, setModal] = useState(false);
  let [screenAvailable, setScreenAvailable] = useState(false);
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(3);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");
  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoAvailable(videoPermission ? true : false);
      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioAvailable(audioPermission ? true : false);
      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      }
      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
        window.localStream = userMediaStream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = userMediaStream;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-call', window.location.href);
      socketIdRef.current = socketRef.current.id;
      socketRef.current.on('chat-message', addMessage);
      socketRef.current.on('user-left', (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });
      socketRef.current.on('user-joined', (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate != null) {
              socketRef.current.emit('signal', socketListId, JSON.stringify({ ice: event.candidate }));
            }
          };
          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(video => video.socketId === socketListId);
            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId ? { ...video, stream: event.stream } : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = { socketId: socketListId, stream: event.stream, autoplay: true, playsinline: true };
              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;
            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}
            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description).then(() => {
                socketRef.current.emit('signal', id2, JSON.stringify({ sdp: connections[id2].localDescription }));
              });
            }).catch(err => console.error("Error creating offer", err));
          }
        }
      });
    });
  };

  const handleVideo = () => {
    setVideo(!video);
    let tracks = window.localStream.getTracks();
    tracks[0].enabled = !tracks[0].enabled;
  };

  const handleAudio = () => {
    setAudio(!audio);
    let tracks = window.localStream.getTracks();
    tracks[1].enabled = !tracks[1].enabled;
  };

  const handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/";
  };

  const openChat = () => {
    setModal(true);
    setNewMessages(0);
  };

  const closeChat = () => {
    setModal(false);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [...prevMessages, { sender: sender, data: data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  const sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const handleScreen = () => {
    if (screenAvailable) {
      setScreen(!screen);
      if (screen) {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
          .then((stream) => {
            localVideoref.current.srcObject = stream;
          }).catch((e) => console.log(e));
      } else {
        const tracks = window.localStream.getTracks();
        tracks.forEach((track) => track.stop());
        window.localStream = black();
        localVideoref.current.srcObject = window.localStream;
      }
    }
  };

  return (
    <div>
      {askForUsername === true ? (
        <div className="min-h-screen bg-black flex justify-center items-center p-6 relative">
          <h2 className="text-white text-3xl font-semibold font-[Poppins] absolute top-6 left-6 z-10">PORTAL</h2>
          <div className="w-full max-w-4xl flex flex-col justify-center items-center space-y-6 relative z-10">
            <div className="flex flex-col items-center justify-center bg-zinc-900 p-8 rounded-2xl shadow-[0px_4px_40px_2px_rgba(169,169,169,0.3)] max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-center text-white mb-6">JOIN THE VIDEO MEETING</h2>
              <div className="flex flex-col sm:flex-row gap-6 w-full">
                <TextField
                  onChange={(e) => setUsername(e.target.value)}
                  label="USERNAME"
                  variant="outlined"
                  fullWidth
                  className="bg-zinc-800 text-white"
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{ borderRadius: "20px", "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
                />
                <Button onClick={connectToSocketServer} variant="contained" style={{ backgroundColor: "#2563eb", color: "white", width: "100%", maxWidth: "250px" }}>
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#181818", height: "100vh", position: "relative", overflow: "hidden" }}>
          <div style={{ width: "70%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", position: "relative" }}>
            {window.localStream ? (
              <video ref={localVideoref} autoPlay muted style={{ width: "100%", maxWidth: "600px", borderRadius: "8px" }} />
            ) : (
              <div style={{ color: "white", fontSize: "18px", textAlign: "center" }}>Loading video...</div>
            )}
          </div>

          {showModal && (
            <div style={{
              position: "absolute",
              right: "10px",
              top: "10%",
              width: "300px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              zIndex: 10,
              transition: "transform 0.3s ease",
              transform: showModal ? "translateX(0)" : "translateX(100%)"
            }}>
              <h1 style={{ color: "black", fontSize: "24px", marginBottom: "15px" }}>Chat</h1>
              <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "10px", color: "black" }}>
                {messages.length !== 0 ? (
                  messages.map((item, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                      <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                      <p>{item.data}</p>
                    </div>
                  ))
                ) : (
                  <p>No Messages Yet</p>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "10px" }}>
                <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your Chat" variant="outlined" style={{ width: "100%", marginBottom: "10px" }} />
                <Button variant="contained" onClick={sendMessage} style={{ backgroundColor: "#2563eb", color: "white" }}>
                  Send
                </Button>
              </div>
            </div>
          )}

          <div style={{
            display: "flex", gap: "20px", marginTop: "20px", backgroundColor: "rgba(0, 0, 0, 0.7)", padding: "10px", borderRadius: "10px", position: "absolute", bottom: "0", left: "0", width: "100%", justifyContent: "center", zIndex: 10
          }}>
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable && (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
              </IconButton>
            )}

            <Badge badgeContent={newMessages} max={999} color="orange">
              <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px", marginTop: "20px", width: "30%"
          }}>
            {videos.map((video) => (
              <div key={video.socketId} style={{
                width: "200px", height: "150px", backgroundColor: "#333", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px"
              }}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
