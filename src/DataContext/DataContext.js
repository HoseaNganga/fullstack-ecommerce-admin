import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  /* FORMDATA */
  const [categoryFormFields, setCategoryFormFields] = useState({
    name: "",
    color: "",
  });

  /* FORMDATA */

  /* FORM DATA SUBMITION */

  /* FORM DATA SUBMITION */

  const [user, setUser] = useState({
    name: "",
    email: "",
    id: "",
  });
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [emailAnchorEl, setEmailAnchorEl] = useState(null);
  const [orderAnchorEl, setOrderAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [headerFooterShow, setHeaderFooterShow] = useState(true);
  const [themeMode, setThemeMode] = useState(true);
  const open = Boolean(anchorEl);
  const notificationsopen = Boolean(notificationsAnchorEl);
  const emailopen = Boolean(emailAnchorEl);
  const orderopen = Boolean(orderAnchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    localStorage.clear();
    setAnchorEl(null);

    navigate("/login");
    toast.success("Successfully Logged Out..Please Log in ");
  };
  const handleNotificationClick = (event) => {
    if (notificationsAnchorEl) {
      handleNotificationClose();
    } else {
      setNotificationsAnchorEl(event.currentTarget);
    }
  };
  const handleNotificationClose = () => {
    setNotificationsAnchorEl(null);
  };
  const handleEmailClick = (event) => {
    if (emailAnchorEl) {
      handleOrderClose();
    } else {
      setEmailAnchorEl(event.currentTarget);
    }
  };
  const handleEmailClose = () => {
    setEmailAnchorEl(null);
  };
  const handleOrderClick = (event) => {
    if (orderAnchorEl) {
      handleOrderClose();
    } else {
      setOrderAnchorEl(event.currentTarget);
    }
  };
  const handleOrderClose = () => {
    setOrderAnchorEl(null);
  };

  const handleAccountClose = () => {
    navigate(`/account/${user?.id}`);
    setAnchorEl(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null && token !== "" && token !== undefined) {
      setIsLoggedIn(true);
      const adminObjParsed = JSON.parse(localStorage.getItem("admin"));
      setUser({
        name: adminObjParsed?.name,
        email: adminObjParsed?.email,
        id: adminObjParsed?.userId,
      });
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (themeMode === true) {
      window.document.body.classList.remove("dark");
      window.document.body.classList.add("light");
      localStorage.setItem("themeMode", "light");
    } else {
      window.document.body.classList.remove("light");
      window.document.body.classList.add("dark");
      localStorage.setItem("themeMode", "dark");
    }
  }, [themeMode]);
  return (
    <DataContext.Provider
      value={{
        isSideBarOpen,
        setIsSideBarOpen,
        anchorEl,
        setAnchorEl,
        notificationsAnchorEl,
        setNotificationsAnchorEl,
        emailAnchorEl,
        setEmailAnchorEl,
        orderAnchorEl,
        setOrderAnchorEl,
        open,
        notificationsopen,
        emailopen,
        orderopen,
        handleClick,
        handleClose,
        handleNotificationClick,
        handleNotificationClose,
        handleEmailClick,
        handleEmailClose,
        handleOrderClick,
        handleOrderClose,
        isLoggedIn,
        setIsLoggedIn,
        headerFooterShow,
        setHeaderFooterShow,
        setThemeMode,
        themeMode,
        categoryFormFields,
        setCategoryFormFields,
        user,
        setUser,
        handleLogOut,
        handleAccountClose,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
