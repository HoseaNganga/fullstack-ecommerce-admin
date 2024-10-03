import React, { useContext, useState } from "react";
import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DataContext from "../../DataContext/DataContext";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledBreadCrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    "&:hover ,&:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const CategoryUploadPage = () => {
  const navigate = useNavigate();
  const { categoryFormFields, setCategoryFormFields } = useContext(DataContext);
  const [categoryImageArr, setCategoryImageArr] = useState([]);
  const [categoryImagePreview, setCategoryImagePreview] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]; // Allowed file types

    // Filter valid files by checking their type
    const validFiles = files.filter((file) => validTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      toast.error(
        "Only image files of type jpeg, jpg, png, or webp are allowed."
      );
      return;
    }

    // Generate previews for the valid files
    const newImagePreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    toast.success("Image File Uploaded");
    // Update the image arrays: Add the new valid files and previews to the state
    setCategoryImageArr((prevImages) => [...prevImages, ...validFiles]);
    setCategoryImagePreview((prevPreviews) => [
      ...prevPreviews,
      ...newImagePreviews,
    ]);

    // Reset the file input field to allow re-uploading the same file if needed
    e.target.value = "";
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    const updatedImages = [...categoryImageArr];
    const updatedPreviews = [...categoryImagePreview];

    updatedImages.splice(index, 1); // Remove image at the selected index
    updatedPreviews.splice(index, 1); // Remove the corresponding preview

    setCategoryImageArr(updatedImages);
    setCategoryImagePreview(updatedPreviews);
  };

  const handleCategoryAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", categoryFormFields?.name);
    formData.append("color", categoryFormFields?.color);
    categoryImageArr.forEach((image, index) => {
      formData.append("images[]", image); // Use the key 'images[]' to indicate it's an array
    });
    const createProductPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/categories/create", formData);
        if (response.success) {
          setCategoryFormFields({
            name: "",
            color: "",
            setCategoryImageArr: [],
            setCategoryImagePreview: [],
          });
          resolve();
          navigate("/categories");
        } else {
          reject(new Error(response.error || "An error has occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(createProductPromise, {
      loading: "Category is being Created and Images Being Uploaded",
      success: "Category Successfully Created and Associated Images",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  const changeCategoryInputFields = (e) => {
    setCategoryFormFields(() => ({
      ...categoryFormFields,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Category Upload
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Dashboard"
              sx={{
                cursor: "pointer",
              }}
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb
              component="a"
              href="/categories"
              label="categories"
              sx={{
                cursor: "pointer",
              }}
              deleteIcon={<ExpandMoreIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="CategoryUpload" />
          </Breadcrumbs>
        </div>
        <form className="row" onSubmit={handleCategoryAdd}>
          <div className="card p-4 ml-3 w-100">
            <Typography variant="h5" className="mb-0" fontWeight={600}>
              Category Information
            </Typography>
            <div className="formClass ">
              <div className="form-group mt-4">
                <TextField
                  sx={{ background: "white", borderRadius: "8px" }}
                  type="text"
                  placeholder="Name"
                  required
                  size="small"
                  variant="outlined"
                  label="Name"
                  className="w-100"
                  name="name"
                  value={categoryFormFields?.name}
                  onChange={changeCategoryInputFields}
                />
              </div>
              <div className="form-group mt-4">
                <TextField
                  sx={{ background: "white", borderRadius: "8px" }}
                  type="text"
                  placeholder="Color"
                  required
                  size="small"
                  variant="outlined"
                  label="Color"
                  className="w-100"
                  name="color"
                  value={categoryFormFields?.color}
                  onChange={changeCategoryInputFields}
                />
              </div>
            </div>
          </div>

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

            <div
              className="imgUploadBox d-flex align-items-center"
              id="productImageGrid"
            >
              {categoryImagePreview.map((image, index) => (
                <div className="uploadBox" key={index}>
                  <IconButton
                    className="remove"
                    onClick={() => handleRemoveImage(index)}
                  >
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
                      alt={`image-${index}`}
                      effect="blur"
                      className="w-100"
                      src={image}
                    />
                  </div>
                </div>
              ))}
            </div>
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

export default CategoryUploadPage;
