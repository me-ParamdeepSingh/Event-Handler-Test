import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ReactMediaRecorder, useReactMediaRecorder } from "react-media-recorder";

export default function Home() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [user, setUser] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");  
      }
      const { data } = await axios.post(
        "http://localhost:4000",
        {},
        { withCredentials: true }
      );
      
      const { status, user } = data;
      console.log(data)
      setUser(user);
      return status
        ? toast(`Hello ${user}`, {
          position: "top-right",
        })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };


  // const video = document.querySelectorAll(["main__video"]);

  async function init() {

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
        screen: true
      });
      startWebcam(stream);
    } catch (err) {
      console.log('Error retrieving a media device.');
      console.log(err);
    }
  }

  function startWebcam(stream) {
    window.stream = stream;
    // video.srcObject = stream;
  }

  init();

  const [btnStatus, setBtnStatus] = useState(false)
  const [btnTxt, setBtnTxt] = useState('Start Recording')

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ video: false, audio: true, screen:true })
  

  const btn = () => {
    setBtnStatus(!btnStatus)
    if (btnStatus === true) {
      stopRecording()
      setBtnTxt('Start Recording')
    } else {
      startRecording()
      setBtnTxt('Stop Recording')
    }
  }
  


  return (
    <>
      <div className="home_page">
        <h4>
          {" "}
          Welcome <span>{user}</span>
        </h4>
        <video src={mediaBlobUrl} autoPlay loop controls>Can't load video :(</video>
        <h6>{status}</h6>
        <button onClick={btn}>{btnTxt}</button>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </>
  );
}
