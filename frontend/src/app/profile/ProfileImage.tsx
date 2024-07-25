import React, { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import styles from "../styles/profile.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useCookies } from "react-cookie";

interface CloudinaryUploadWidgetInfo {
  resource_type: string;
  public_id: string;
  secure_url: string;
  // Add other properties as needed
}

const ProfileImage = () => {
  // const [imagePublicId, setImagePublicId] = useState("o5qnqwl91vwifrjlr7j0");
  const [cookies, setCookie] = useCookies(["username", "profile_picture"]);
  const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET || "";
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const updatePicture = (imageId: string) => {
    fetch(`${backendUrl}/user/profile_picture`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_picture: imageId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update profile_picture");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid>
      <CldImage
        id={styles.profile_image}
        src={cookies.profile_picture}
        alt="Profile Picture"
        width={125}
        height={125}
      />
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{
          resourceType: "image",
          sources: ["local", "url"],
          maxImageHeight: 200,
          maxImageWidth: 200,
          cropping: true,
          croppingShowDimensions: true,
          // croppingValidateDimensions: true,
          croppingCoordinatesMode: "custom",
          croppingAspectRatio: 1,
          // validateMaxWidthHeight: true,
          multiple: false,
        }}
        onSuccess={(result, { widget }) => {
          const info = result.info as CloudinaryUploadWidgetInfo;
          updatePicture(info.public_id);
          widget.close();
        }}
      >
        {({ cloudinary, widget, open }) => {
          return (
            <Button sx={{ color: "black" }} onClick={() => open()}>
              <FileUploadIcon className={styles.profile_nav_icons} />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </Grid>
  );
};

export default ProfileImage;
