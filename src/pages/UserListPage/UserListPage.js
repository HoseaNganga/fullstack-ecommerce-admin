import React, { useContext, useEffect, useState } from "react";
import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Box,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { deleteData, fetchDataFromApi, modifyData } from "../../utils/api";
import DataContext from "../../DataContext/DataContext";
import toast from "react-hot-toast";
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

const UserListPage = () => {
  const navigate = useNavigate();
  const { themeMode } = useContext(DataContext);
  const [userList, setUserList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [editUserFields, setEditUserFields] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    phone: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]; // Allowed file types

    // Validate file type
    if (file && validTypes.includes(file.type)) {
      setProfileImage(file); // Set the file
      setProfileImagePreview(URL.createObjectURL(file)); // Generate preview URL
      toast.success("Image File Uploaded");
    } else {
      toast.error(
        "Only image files of type jpeg, jpg, png, or webp are allowed."
      );
    }
    e.target.value = ""; // Reset file input so same image can be re-uploaded
  };

  const handleFieldChanges = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEditUserFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleUserEdit = async (id) => {
    setOpen(true);
    setEditId(id);
    const response = await fetchDataFromApi(`/api/user/${id}`);
    setEditUserFields({
      name: response?.user?.name,
      email: response?.user?.email,
      phone: response?.user?.phone,
    });
    setProfileImage(response?.user?.image);
    setProfileImagePreview(response?.user?.image);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(`name`, editUserFields?.name);
    formData.append("email", editUserFields?.email);
    formData.append("phone", editUserFields?.phone);

    // Check if the user uploaded a new image (profileImage will be a file in that case)
    const imageChanged = profileImage instanceof File;

    // If the image has changed, append it to FormData
    if (imageChanged) {
      formData.append("image", profileImage);
    }

    const editUserPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await modifyData(`/api/user/${editId}`, formData);
        if (response.success) {
          // Reset fields
          setEditUserFields({
            name: "",
            email: "",
            phone: "",
          });
          setProfileImage(null);
          setProfileImagePreview(null);

          // Navigate and reload
          resolve();
          window.location.reload();
        } else {
          reject(new Error(response.error || "An error has occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });

    toast.promise(editUserPromise, {
      loading: "User is being edited",
      success: "User successfully edited and associated images updated",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  const handleDeleteUser = async (id) => {
    const deleteUserPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await deleteData(`/api/user/${id}`);
        if (response.success) {
          const refetchUserData = await fetchDataFromApi(`/api/user`);
          setUserList(refetchUserData?.userList);
          resolve();
          navigate("/userlist");
        } else {
          reject(new Error(response.error || "An error has occured"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(deleteUserPromise, {
      loading: "User is being deleted",
      success: "User Successfully deleted and Associated Images",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromApi(`/api/user`);
        setUserList(response?.userList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            ALL USERS
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="UserList" />
          </Breadcrumbs>
        </div>
        <div className="card shadow border-0 p-3 mt-4 adminTableFilter">
          <Typography
            variant="h5"
            fontWeight={600}
            textTransform={"capitalize"}
            gutterBottom
          >
            User List
          </Typography>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th>User Image</th>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>User ID</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {userList?.length !== 0 &&
                  userList?.map((user, index) => (
                    <tr key={user?._id}>
                      <td>#{index}</td>
                      <td>
                        <div className="d-flex">
                          <div className="imgWrapper">
                            <div className="img">
                              <img
                                src={user?.image}
                                alt=""
                                width="50px"
                                height="50px"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{user?.name}</td>
                      <td>{user?.email}</td>
                      <td>{user?._id}</td>
                      <td className="">
                        <div className="actions d-flex align-items-center">
                          <IconButton onClick={() => handleUserEdit(user?._id)}>
                            <EditIcon
                              color="success"
                              sx={{ fontSize: "20px" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteUser(user?._id)}
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
          <DialogTitle>Edit User:</DialogTitle>
          <DialogContent>
            <Box
              sx={{ width: "100%" }}
              className="myAccBox card shadow border-0"
            >
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <form onSubmit={handleEditUser}>
                  <div className="row p-3">
                    <div className="col-md-4">
                      <div className="userImage">
                        <img
                          src={
                            profileImagePreview // If there's a preview, show it
                              ? profileImagePreview
                              : `` // Show first letter or placeholder
                          }
                          alt="profilepic"
                        />
                        <div className="overlay d-flex justify-content-center">
                          <IconButton className="d-flex align-items-center">
                            <UploadFileIcon sx={{ color: "white" }} />
                            <input
                              type="file"
                              className="input"
                              accept="image/png, image/jpeg, image/jpg , image/webp"
                              onChange={handleImageChange}
                            />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="col">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <TextField
                                type="text"
                                variant="outlined"
                                label="Name"
                                required
                                name="name"
                                value={editUserFields?.name}
                                onChange={handleFieldChanges}
                                className="w-100"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <TextField
                                type="email"
                                variant="outlined"
                                label="Email"
                                name="email"
                                value={editUserFields?.email}
                                onChange={handleFieldChanges}
                                required
                                className="w-100"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <TextField
                                type="tel"
                                variant="outlined"
                                label="Phone"
                                required
                                name="phone"
                                value={editUserFields?.phone}
                                onChange={handleFieldChanges}
                                className="w-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
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
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UserListPage;
