import React, { useContext, useEffect, useState } from "react";
import adminlogo from "../../ImageAssets/adminlogo.PNG";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import googleimg from "../../ImageAssets/googleimg.PNG";
import { Link, useNavigate } from "react-router-dom";
import DataContext from "../../DataContext/DataContext";
import HomeIcon from "@mui/icons-material/Home";
import { toast } from "react-hot-toast";
import { postData } from "../../utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const RegisterPage = () => {
  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const { setHeaderFooterShow } = useContext(DataContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [registerFormFields, setRegisterFormFields] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    passwordConfirm: "",
    isAdmin: true,
  });
  const changeInputFields = (e) => {
    setRegisterFormFields(() => ({
      ...registerFormFields,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (registerFormFields.passwordConfirm !== registerFormFields.password) {
      return toast.error("Password fields do not match");
    }

    // Check if terms are checked
    if (!termsChecked) {
      return toast.error("Please agree to the Terms and Conditions");
    }

    // If everything is okay
    const registerAdminPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData(
          "/api/admin/signup",
          registerFormFields
        );

        if (response.success) {
          resolve();
          setRegisterFormFields({
            name: "",
            email: "",
            password: "",
            phone: "",
            isAdmin: false,
            passwordConfirm: "",
          });

          navigate("/login");
        } else {
          reject(new Error(response.error || "An error occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(registerAdminPromise, {
      loading: "Admin is being Created..",
      success: "Admin Created Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // eslint-disable-next-line
      const token = credential.accessToken;

      const user = result.user;

      const fields = {
        name: user.providerData[0].displayName,
        email: user.providerData[0].email,
        password: null,
        image: user.providerData[0].photoURL,
        phone: user.providerData[0].phoneNumber,
      };
      const loginPromiseWithGoogle = new Promise(async (resolve, reject) => {
        try {
          const response = await postData("/api/admin/authWithGoogle", fields);
          console.log(response);
          if (response.success) {
            localStorage.setItem("token", response.token);
            const admin = {
              name: response?.admin?.name,
              email: response?.admin?.email,
              userId: response?.admin?._id,
            };
            localStorage.setItem("admin", JSON.stringify(admin));
            resolve();
            window.location.href = "/";
          } else {
            reject(new Error(response.error || "An error occurred")); // Reject the promise on failure
          }
        } catch (error) {
          console.log(error);
          reject();
        }
      });

      toast.promise(loginPromiseWithGoogle, {
        loading: "Logging in User..",
        success: "User Logged In Successfully",
        error: (err) => `${err?.message || "An unexpected error occurred"}`,
      });
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeaderFooterShow(false);
  }, [setHeaderFooterShow]);
  return (
    <>
      <section className="registerSection">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="registerCard">
              <Typography
                variant="h3"
                fontWeight={700}
                textTransform={"uppercase"}
                sx={{ color: "#403e57" }}
                gutterBottom
              >
                best ux/ui fashion ecommerce dashboard & panel
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#5e5d72" }}
                gutterBottom
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste,
                officiis voluptatibus atque obcaecati debitis repudiandae
                consequuntur ducimus iure dolorum, quisquam in labore, ullam
                pariatur possimus vitae similique temporibus repellendus dolor!
              </Typography>

              <Button
                variant="contained"
                href="/"
                startIcon={<HomeIcon />}
                sx={{
                  "&:hover": {
                    color: "#fff",
                  },
                }}
              >
                Go To Home
              </Button>
            </div>
          </div>
          <div className="col-md-3">
            <div className="section signInPage registerPage ">
              <div className="container">
                <div className="imgWrapper  ">
                  <img src={adminlogo} alt="logo" />
                </div>
                <div className=" box card p-3 shadow border-0 mt-4">
                  <Typography
                    variant="h6"
                    textTransform={"capitalize"}
                    fontWeight={600}
                    sx={{ padding: "10px 30px", color: "blue" }}
                  >
                    Sign up
                  </Typography>
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <TextField
                        type="text"
                        label="Name"
                        required
                        variant="outlined"
                        className="w-100 mb-2"
                        size="small"
                        name="name"
                        onChange={changeInputFields}
                      />
                      <TextField
                        type="email"
                        label="Email"
                        required
                        variant="outlined"
                        className="w-100 mb-2"
                        size="small"
                        name="email"
                        onChange={changeInputFields}
                      />
                      <TextField
                        type="text"
                        label="phone"
                        required
                        variant="outlined"
                        className="w-100 mb-2"
                        size="small"
                        name="phone"
                        onChange={changeInputFields}
                      />
                      <TextField
                        type={passwordVisible ? "text" : "password"}
                        label="Password"
                        size="small"
                        required
                        name="password"
                        onChange={changeInputFields}
                        variant="outlined"
                        className="w-100"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {passwordVisible ? (
                                <VisibilityOffIcon
                                  onClick={() => setPasswordVisible(false)}
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
                      <TextField
                        type={passwordConfirm ? "text" : "password"}
                        label="password confirm"
                        size="small"
                        required
                        variant="outlined"
                        className="w-100 mt-2"
                        name="passwordConfirm"
                        onChange={changeInputFields}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {passwordConfirm ? (
                                <VisibilityOffIcon
                                  onClick={() => setPasswordConfirm(false)}
                                />
                              ) : (
                                <VisibilityIcon
                                  onClick={() => setPasswordConfirm(true)}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={termsChecked}
                            onChange={() => setTermsChecked(!termsChecked)}
                          />
                        }
                        label="I Agree to the terms and conditions"
                        sx={{ fontSize: "10px" }}
                      />
                    </FormGroup>
                    <div className="d-flex align-items-center row">
                      <Button variant="contained" className="col" type="submit">
                        Create Account
                      </Button>
                    </div>

                    <p className="mt-3">
                      Already Registered?{" "}
                      <Link className="border-effect" to={"/login"}>
                        Login
                      </Link>{" "}
                    </p>

                    <Typography
                      variant="body1"
                      textAlign={"center"}
                      fontWeight={600}
                    >
                      Or
                    </Typography>
                    <Button className="" onClick={signInWithGoogle}>
                      <img src={googleimg} alt="" className="w-100" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
