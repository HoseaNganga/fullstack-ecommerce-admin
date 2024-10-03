import React, { useContext, useEffect, useState } from "react";
import adminlogo from "../../ImageAssets/adminlogo.PNG";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import googleimg from "../../ImageAssets/googleimg.PNG";
import { Link, useNavigate } from "react-router-dom";
import DataContext from "../../DataContext/DataContext";
import { postData } from "../../utils/api";
import toast from "react-hot-toast";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const LoginPage = () => {
  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();
  const { setHeaderFooterShow, themeMode } = useContext(DataContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registerFormFields, setRegisterFormFields] = useState({
    email: "",
    password: "",
    isAdmin: true,
  });
  const changeInputFields = (e) => {
    setRegisterFormFields(() => ({
      ...registerFormFields,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate();

  const handleCancel = () => {
    setHeaderFooterShow(true);
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginAdminPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData(
          "/api/admin/signin",
          registerFormFields
        );
        if (response.success) {
          const admin = {
            name: response?.admin?.name,
            email: response?.admin?.email,
            userId: response?.admin?._id,
          };
          localStorage.setItem("token", response?.token);
          localStorage.setItem("admin", JSON.stringify(admin));

          resolve(response); // Resolve the promise on success
          setHeaderFooterShow(true);
          window.location.href = "/";
          setRegisterFormFields({
            email: "",
            password: "",
          });
        } else {
          reject(new Error(response.error || "An error occurred")); // Reject the promise on failure
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(loginAdminPromise, {
      loading: "Logging in Admin..",
      success: "Admin Logged In Successfully",
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
      <section className="section loginSection signInPage">
        <div className="container">
          <div className="imgWrapper  ">
            <img src={adminlogo} alt="logo" />
          </div>
          <div className=" box card p-3 shadow border-0 mt-3">
            <Typography
              variant="h6"
              textTransform={"capitalize"}
              fontWeight={600}
              sx={{ padding: "4px 30px", color: "blue" }}
            >
              Sign in
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <TextField
                  type="email"
                  label="Email"
                  required
                  name="email"
                  onChange={changeInputFields}
                  variant="filled"
                  className="w-100 mb-4"
                  sx={{
                    "& .MuiFilledInput-root": {
                      color: themeMode ? "" : "white",
                    },
                  }}
                />
                <TextField
                  type={passwordVisible ? "text" : "password"}
                  label="Password"
                  required
                  name="password"
                  onChange={changeInputFields}
                  variant="filled"
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
              </div>
              <a className="border-effect cursor" href="/">
                Forgot Password?
              </a>
              <div className="d-flex align-items-center row mt-3">
                <Button variant="contained" className="col" type="submit">
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  className="col ml-3"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>

              <p className="mt-3">
                Not Registered?{" "}
                <Link className="border-effect" to={"/register"}>
                  Sign Up
                </Link>{" "}
              </p>

              <Typography
                variant="subtitle2"
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
      </section>
    </>
  );
};

export default LoginPage;
