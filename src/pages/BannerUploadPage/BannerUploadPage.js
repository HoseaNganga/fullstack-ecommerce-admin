import React, { useState } from "react";
import {
  Typography,
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Button,
  IconButton,
  TextField,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { postData } from "../../utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
const StyledBreadCrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    /*   fontWeight: theme.palette.typography.fontWeightRegular, */
    "&:hover ,&:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const BannerUploadPage = () => {
  const navigate = useNavigate();
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]; // Allowed file types

    // Validate file type
    if (file && validTypes.includes(file.type)) {
      setBannerImage(file); // Set the file
      setBannerImagePreview(URL.createObjectURL(file)); // Generate preview URL
      toast.success("Image File Uploaded");
    } else {
      toast.error(
        "Only image files of type jpeg, jpg, png, or webp are allowed."
      );
    }
    e.target.value = ""; // Reset file input so same image can be re-uploaded
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setBannerImage(null);
    setBannerImagePreview(null);
  };

  const handleAddBannerImage = async (e) => {
    e.preventDefault();
    if (!bannerImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", bannerImage); // Append the single image

    const createBannerPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/banner/create", formData); // Upload to backend
        if (response.success) {
          setBannerImage(null);
          setBannerImagePreview(null);
          resolve();
          navigate("/bannerList");
        } else {
          reject(new Error(response.error || "An error has occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });

    toast.promise(createBannerPromise, {
      loading: "Banner is being Created and Image is being Uploaded...",
      success: "Banner Successfully Created",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Banner Upload
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Home"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="Banner upload" />
          </Breadcrumbs>
        </div>
        <form className="row " onSubmit={handleAddBannerImage}>
          <div className="card mt-2 ml-3 p-4 w-100 ">
            <div className="imagesUploadSec">
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Media And Published
              </Typography>
            </div>
            <div className="imgUploadBox d-flex align-items-center mt-3">
              <div className="uploadBox">
                <TextField
                  type="file"
                  accept="image/png, image/jpeg, image/jpg , image/webp"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {bannerImagePreview && (
              <div
                className="imgUploadBox d-flex align-items-center"
                id="productImageGrid"
              >
                <div className="uploadBox">
                  <IconButton className="remove" onClick={handleRemoveImage}>
                    <DeleteIcon
                      sx={{
                        fontSize: "20px",
                        "&:hover": {
                          color: "red",
                        },
                      }}
                    />
                  </IconButton>
                  <div className="box">
                    <LazyLoadImage
                      alt="Selected Banner"
                      effect="blur"
                      className="w-100"
                      src={bannerImagePreview} // Preview the selected image
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            startIcon={<CloudUploadIcon />}
            variant="contained"
            className="w-100"
            type="submit"
          >
            PUBLISH & VIEW
          </Button>
        </form>
      </div>
    </>
  );
};

export default BannerUploadPage;
