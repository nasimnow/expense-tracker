import { Alert, Button, Input, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import "twin.macro";
import imageCompression from "browser-image-compression";

import supabase from "../utils/supabase";
import moment from "moment";

const LoginComponent = ({ setIsLoggedIn }: any) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loginImage, setLoginImage] = useState(null);

  let photoRef = useRef(null);
  let videoRef = useRef(null);

  // const getVideo = () => {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       video: true,
  //     })
  //     .then((stream) => {
  //       let video: any = videoRef.current;
  //       video.srcObject = stream;
  //       video.play();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  // useEffect(() => {
  //   getVideo();
  // }, [videoRef]);

  // function dataURLtoBlob(dataurl: any) {
  //   var arr = dataurl.split(","),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new Blob([u8arr], { type: mime });
  // }

  // const takePicture = async () => {
  //   const width = 200;
  //   const height = width / (16 / 9);
  //   let video = videoRef.current;
  //   let photo: any = photoRef.current;
  //   photo.width = width;
  //   photo.height = height;
  //   let ctx = photo.getContext("2d");
  //   ctx.drawImage(video, 0, 0, width, height);
  //   //convert image to blob
  //   let data = ctx.canvas.toDataURL("image/jpg");
  //   const compresedImage: any = await imageCompression(
  //     dataURLtoBlob(data) as any,
  //     {
  //       maxSizeMB: 0.05,
  //       useWebWorker: true,
  //     }
  //   );
  //   //compress image
  //   setLoginImage(compresedImage);
  // };

  const handleLogin = async () => {
    // tcs@944
    const hashedPassword = btoa(password);
    const isPasswordCorrect = hashedPassword === "dGNzQDg0NA==";
    if (isPasswordCorrect) {
      setError(false);
      setIsLoggedIn(true);
    } else {
      setError(true);
      // if (loginImage) {
      //   const { data, error } = await supabase.storage
      //     .from("login-photos")
      //     .upload(
      //       `public/failed/failed_${moment().format(
      //         "DD-MM-YYYY hh:mm:ss a"
      //       )}.jpg`,
      //       loginImage
      //     );
      // }
    }
  };

  return (
    <div>
      <Typography.Title level={3}>Login</Typography.Title>
      {error && (
        <Alert
          message="Password is incorrect"
          type="error"
          showIcon
          tw="mb-4"
        />
      )}
      {/* <video ref={videoRef} className="container" tw="display[none]"></video>
      <canvas className="container" ref={photoRef} tw="display[none]"></canvas> */}

      <Input
        size="large"
        placeholder="Password"
        onPressEnter={handleLogin}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button size="large" type="primary" block tw="mt-2" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};

export default LoginComponent;
