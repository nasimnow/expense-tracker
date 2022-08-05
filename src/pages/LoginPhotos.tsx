import { Card, Image, Typography } from "antd";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import "twin.macro";

const LoginPhotos = () => {
  const [failedImages, setFailedImages] = useState([]);

  const getImages = async () => {
    const images: any = await supabase.storage
      .from("login-photos")
      .list("public/failed");
    setFailedImages(images?.data);
  };
  useEffect(() => {
    getImages();
  }, []);

  return (
    <Card>
      <Typography.Title level={4}>Failed Login Photos</Typography.Title>
      <div tw="flex gap-1">
        {failedImages.map((item: any) => (
          <Image
            width={200}
            src={`https://vkvetbymtvtoymxrolus.supabase.co/storage/v1/object/public/login-photos/public/failed/${item?.name}`}
          />
        ))}
      </div>
    </Card>
  );
};
export default LoginPhotos;
