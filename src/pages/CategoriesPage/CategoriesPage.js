import React, { useContext, useEffect, useState } from "react";
import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  TextField,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteData, fetchDataFromApi, modifyData } from "../../utils/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DataContext from "../../DataContext/DataContext";
import toast from "react-hot-toast";
import nodata from "../../ImageAssets/nodata.png";
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

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { themeMode } = useContext(DataContext);
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = useState(null);
  const [editCategoryFormFields, setEditCategoryFormFields] = useState({
    name: "",
    color: "",
  });
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

  const changeCategoryInputFields = (e) => {
    setEditCategoryFormFields(() => ({
      ...editCategoryFormFields,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategoryEdit = async (id) => {
    setOpen(true);
    setEditId(id);
    const response = await fetchDataFromApi(`/api/categories/${id}`);
    console.log(response);
    setEditCategoryFormFields({
      name: response ? response?.category?.name : "",
      color: response ? response?.category?.color : "",
    });
    setCategoryImageArr(response ? response?.category?.images : []);
    setCategoryImagePreview(response ? response?.category?.images : []);
  };
  const handleEditCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const originalCategory = await fetchDataFromApi(
      `/api/categories/${editId}`
    );
    const originalImages = originalCategory
      ? originalCategory?.category?.images
      : [];

    formData.append("name", editCategoryFormFields?.name);
    formData.append("color", editCategoryFormFields?.color);

    // Function to compare two arrays of images (URLs or file references)
    const arraysAreEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      // Check if all elements in both arrays are identical
      return arr1.every((img, index) => img === arr2[index]);
    };

    // Check if the images have changed by comparing the contents of the arrays
    const imagesChanged = !arraysAreEqual(categoryImageArr, originalImages);

    // If images have changed, append each image to FormData
    if (imagesChanged) {
      categoryImageArr.forEach((image, index) => {
        formData.append("images[]", image); // Appending each image with a key like 'images[]'
      });
    }
    const editCategoryPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await modifyData(
          `/api/categories/${editId}`,
          formData
        );
        if (response.success) {
          setEditCategoryFormFields({
            name: "",
            color: "",
          });

          setCategoryImageArr([]);
          setCategoryImagePreview([]);
          resolve();
          navigate("/categories");
          window.location.reload();
        } else {
          reject(new Error(response.error || "An error has occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(editCategoryPromise, {
      loading: "Category is being Edited",
      success: "Category Successfully Edited and Associated Images",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleDelete = (id) => {
    const handleDeleteCategoryPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await deleteData(`/api/categories/${id}`);
        if (response.success) {
          const refetchData = await fetchDataFromApi(`/api/categories`);
          setData(refetchData);
          resolve();
          window.location.reload();
        } else {
          reject(new Error(response.error || "An error has occured"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(handleDeleteCategoryPromise, {
      loading: "Category is being deleted",
      success: "Category Successfully deleted and Associated Images",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  const handlePaginationChange = (e, value) => {
    fetchDataFromApi(`/api/categories?page=${value}`).then((res) => {
      setData(res);
    });
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const resp = await fetchDataFromApi("/api/categories");
        setData(resp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryData();
  }, []);

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            ALL CATEGORIES
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="categories" />
            <StyledBreadCrumb
              component="a"
              href="/category/add"
              label="Add New Category"
              sx={{
                background: "blue",
                color: "white",
                cursor: "pointer",
              }}
            />
          </Breadcrumbs>
        </div>

        <div className="card shadow border-0 p-3 mt-4 adminTableFilter">
          <Typography
            variant="h5"
            fontWeight={600}
            textTransform={"capitalize"}
            gutterBottom
          >
            All Categories
          </Typography>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th>category Image</th>
                  <th>Category Name</th>
                  <th>color</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.categoryList?.length !== 0 &&
                  data?.categoryList?.map((category, index) => (
                    <tr key={category._id}>
                      <td>#{index}</td>
                      <td>
                        <div className="d-flex">
                          <div className="imgWrapper">
                            <div className="img">
                              {category?.images.map((img) => (
                                <img
                                  key={img}
                                  src={img}
                                  alt=""
                                  width="50px"
                                  height="50px"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {category.name}
                      </td>

                      <td
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {category.color}
                      </td>

                      <td className="">
                        <div className="actions d-flex align-items-center">
                          <IconButton
                            onClick={() => handleCategoryEdit(category._id)}
                          >
                            <EditIcon
                              color="success"
                              sx={{ fontSize: "20px" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(category._id)}
                          >
                            <DeleteIcon
                              color="error"
                              sx={{ fontSize: "20px" }}
                            />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="d-flex tableFooter">
              <Typography marginBottom={0}>
                Showing <b>{data?.categoryList?.length}</b> out of{" "}
                <b>{data?.totalPosts}</b> results
              </Typography>
              <Pagination
                count={data?.totalPages}
                showFirstButton
                showLastButton
                color="primary"
                className="pagination"
                onChange={handlePaginationChange}
              />
            </div>
            {data?.categoryList?.length === 0 && (
              <div className="d-flex align-items-center justify-content-center ">
                <img src={nodata} alt="holderimage" />
              </div>
            )}
          </div>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: themeMode === false ? "#2c4477" : "",
            },
          }}
        >
          <DialogTitle>Edit Category:</DialogTitle>
          <DialogContent>
            <form onSubmit={handleEditCategory}>
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
                    value={editCategoryFormFields?.name}
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
                    value={editCategoryFormFields?.color}
                    onChange={changeCategoryInputFields}
                  />
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
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={handleClose} autoFocus>
                  Edit
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CategoriesPage;
