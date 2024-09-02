import React from "react";
import { Button, Grid } from "@mui/material";
import styles from "../../styles/profile.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useCookies } from "react-cookie";
import { useAuth } from "../../hooks/useAuth";

interface CloudinaryUploadWidgetInfo {
  resource_type: string;
  public_id: string;
  secure_url: string;
}

const ProfileImage = () => {
  const { user, fetchUser, settings, refresh } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theme
  const profile_picture = user?.profilePicture || ""; // User's profile picture
  const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""; // Cloudinary upload preset

  // Upload new profile picture
  const updatePicture = async (imageUrl: string) => {
    let status = null;
    await fetch(`/api/user/profile_picture`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_picture: imageUrl,
      }),
    })
      .then((res) => {
        if (res.ok) {
          status = true;
          fetchUser();
        } else if (res.status == 401) {
          status = false;
          return;
        } else {
          throw new Error("Failed to update profile_picture");
        }
      })
      .catch((error) => console.log(error));

    // Refreshes token and tries again if error was a 401
    if (status == false) {
      const refreshed = await refresh();
      if (refreshed) {
        updatePicture(imageUrl);
      }
    }
  };

  return (
    <Grid>
      {profile_picture ? (
        <CldImage
          id={styles.profile_image}
          src={profile_picture}
          alt="Profile Picture"
          width={125}
          height={125}
        />
      ) : null}
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{
          resourceType: "image",
          sources: ["local", "url"],
          maxImageHeight: 200,
          maxImageWidth: 200,
          cropping: true,
          croppingShowDimensions: true,
          croppingCoordinatesMode: "custom",
          croppingAspectRatio: 1,
          multiple: false,
        }}
        onSuccess={(result, { widget }) => {
          const info = result.info as CloudinaryUploadWidgetInfo;
          updatePicture(info.secure_url);
          widget.close();
        }}
      >
        {({ cloudinary, widget, open }) => {
          return (
            <Button
              sx={{ color: theme == "dark" ? "white" : "black" }}
              onClick={() => open()}
            >
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
