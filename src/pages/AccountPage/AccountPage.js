import {
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Breadcrumbs,
  styled,
  Chip,
  emphasize,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useParams } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { fetchDataFromApi, modifyData } from "../../utils/api";
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

const AccountPage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [editUserFields, setEditUserFields] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    phone: "",
  });
  const [editPasswordFields, setEditPasswordFields] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const navigate = useNavigate();

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

  const handlePasswordFieldChanges = (e) => {
    const { name, value } = e.target;
    setEditPasswordFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };
  const handleUserEdit = async (e) => {
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

    const { oldpassword, newpassword, confirmpassword } = editPasswordFields;

    // Check if the user wants to change the password (i.e., they've filled in any of the password fields)
    const wantsToChangePassword = oldpassword || newpassword || confirmpassword;

    if (wantsToChangePassword) {
      if (!oldpassword || !newpassword || !confirmpassword) {
        toast.error(
          "All password fields must be filled to change the password."
        );
        return; // Exit early if any password field is missing
      }

      if (newpassword !== confirmpassword) {
        toast.error("New password and confirm password do not match.");
        return; // Exit early if passwords don't match
      }

      // Append the passwords if the user is changing them
      formData.append("password", newpassword);
      formData.append("oldpassword", oldpassword);
    }

    const editUserPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await modifyData(`/api/admin/${id}`, formData);
        if (response.success) {
          // Reset fields
          setEditUserFields({
            name: "",
            email: "",
            phone: "",
            password: "",
          });
          setEditPasswordFields({
            oldpassword: "",
            newpassword: "",
            confirmpassword: "",
          });
          setProfileImage(null);
          setProfileImagePreview(null);

          // Navigate and reload
          resolve();
          navigate(`/account/${id}`);
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

  /* const handleUserEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(`name`, editUserFields?.name);
    formData.append("email", editUserFields?.email);
    formData.append("phone", editUserFields?.phone);
    // Check if the user uploaded a new image (profileImage will be a file in that case)
    const imageChanged = profileImage instanceof File;
    const { oldpassword, newpassword, confirmpassword } = editPasswordFields;

    // If the image has changed append it to FormData
    if (imageChanged) {
      formData.append("image", profileImage);
    }

    if (oldpassword && newpassword && confirmpassword) {
      if (newpassword !== confirmpassword) {
        toast.error("New password and confirm password do not match.");
        return; // Exit early if passwords don't match
      }

      // If they match, append the new password and old password to formData
      formData.append("password", newpassword);
      formData.append("oldpassword", oldpassword);
    } else {
      toast.error(
        "You must provide all three password fields to change the Password "
      );
      return;
    }

    const editUserPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await modifyData(`/api/admin/${id}`, formData);
        if (response.success) {
          setEditUserFields({
            name: "",
            email: "",
            phone: "",
            password: "",
          });
          setEditPasswordFields({
            oldpassword: "",
            newpassword: "",
            confirmpassword: "",
          });
          setProfileImage(null);
          setProfileImagePreview(null);
          resolve();
          navigate(`/account/${id}`);
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
      loading: "User is being Edited",
      success: "User Successfully Edited and Associated Images",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  }; */

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const response = await fetchDataFromApi(`/api/admin/${id}`);

        // Only update state if there are changes

        setEditUserFields({
          name: response?.admin?.name || "",
          email: response?.admin?.email || "",
          phone: response?.admin?.phone || "",
        });

        setUserData(response?.admin);
        setProfileImage(response?.admin?.image);
        setProfileImagePreview(response?.admin?.image);
      };

      fetchData();
    }
  }, [id]);

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Hey {userData?.name} and welcome to your Account
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="Account View" />
          </Breadcrumbs>
        </div>

        <div className="card shadow ">
          <Box sx={{ width: "100%" }} className="myAccBox card shadow border-0">
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <form onSubmit={handleUserEdit}>
                <div className="row p-3">
                  <div className="col-md-4">
                    <div className="userImage">
                      <img
                        src={
                          profileImagePreview // If there's a preview, show it
                            ? profileImagePreview
                            : `https://via.placeholder.com/150?text=${userData?.email?.charAt(
                                0
                              )}` // Show first letter or placeholder
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
                        <div className="col-md-6">
                          <div className="form-group">
                            <TextField
                              type={oldPasswordVisible ? "text" : "password"}
                              label="Old Password"
                              variant="outlined"
                              className="w-100"
                              name="oldpassword"
                              value={editPasswordFields?.oldpassword}
                              onChange={handlePasswordFieldChanges}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {oldPasswordVisible ? (
                                      <VisibilityOffIcon
                                        onClick={() =>
                                          setOldPasswordVisible(false)
                                        }
                                      />
                                    ) : (
                                      <VisibilityIcon
                                        onClick={() =>
                                          setOldPasswordVisible(true)
                                        }
                                      />
                                    )}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <TextField
                              type={newPasswordVisible ? "text" : "password"}
                              label="New Password"
                              variant="outlined"
                              className="w-100"
                              name="newpassword"
                              value={editPasswordFields?.newpassword}
                              onChange={handlePasswordFieldChanges}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {newPasswordVisible ? (
                                      <VisibilityOffIcon
                                        onClick={() =>
                                          setNewPasswordVisible(false)
                                        }
                                      />
                                    ) : (
                                      <VisibilityIcon
                                        onClick={() =>
                                          setNewPasswordVisible(true)
                                        }
                                      />
                                    )}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <TextField
                              type={passwordVisible ? "text" : "password"}
                              label="ReType Password"
                              variant="outlined"
                              className="w-100"
                              name="confirmpassword"
                              value={editPasswordFields?.confirmpassword}
                              onChange={handlePasswordFieldChanges}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {passwordVisible ? (
                                      <VisibilityOffIcon
                                        onClick={() =>
                                          setPasswordVisible(false)
                                        }
                                      />
                                    ) : (
                                      <VisibilityIcon
                                        onClick={() => setPasswordVisible(true)}
                                      />
                                    )}
                                  </InputAdornment>
                                ),
                              }}
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
        </div>
      </div>
    </>
  );
};

export default AccountPage;
