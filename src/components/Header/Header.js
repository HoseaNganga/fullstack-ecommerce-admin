import React, { useContext } from "react";
import adminlogo from "../../ImageAssets/adminlogo.PNG";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Divider,
} from "@mui/material";
import { SearchBox } from "../index";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";
/* import userImg from "../../ImageAssets/authorreview.png"; */
import Logout from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DataContext from "../../DataContext/DataContext";

const Header = () => {
  const {
    isSideBarOpen,
    setIsSideBarOpen,
    anchorEl,
    notificationsAnchorEl,
    emailAnchorEl,
    orderAnchorEl,
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
    setThemeMode,
    themeMode,
    user,
    handleLogOut,
    handleAccountClose,
  } = useContext(DataContext);

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            <div className="col-sm-2 part1">
              <Link to={"/"} className="d-flex align-items-center">
                <img src={adminlogo} alt="adminLogo" className="logo" />
              </Link>
            </div>
            <div className="col-sm-3 d-flex align-items-center part2 pl-4">
              <IconButton
                className="mr-3"
                onClick={() => setIsSideBarOpen(!isSideBarOpen)}
              >
                {isSideBarOpen ? <MenuOpenIcon /> : <MenuIcon />}
              </IconButton>
              <SearchBox />
            </div>
            <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
              <IconButton
                className="mr-3"
                onClick={() => setThemeMode(!themeMode)}
                sx={{ background: themeMode ? "#e7e0e0" : "white" }}
              >
                {themeMode ? (
                  <LightModeIcon color={themeMode ? "info" : "secondary"} />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
              <IconButton
                className="mr-3"
                onClick={handleOrderClick}
                aria-controls={orderopen ? "order-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={orderopen ? "true" : undefined}
              >
                <ShoppingCartIcon color="info" />
              </IconButton>
              <Menu
                anchorEl={orderAnchorEl}
                className="dropDownList"
                id="order-menu"
                open={orderopen}
                onClose={handleOrderClose}
                onClick={handleOrderClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <div className="head pl-3 pb-2 w-100 ">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Orders(34)
                  </Typography>
                </div>
                <div className="scroll">
                  <MenuItem onClick={handleOrderClose}>
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem Ipsum</b> Now
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          Lorem ipsum dolor sit amet,
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                </div>
                <Button
                  color="info"
                  textTransform={"capitalize"}
                  variant="contained"
                  className="w-100"
                  sx={{
                    position: "sticky",
                    bottom: 0,
                  }}
                >
                  View All Orders
                </Button>
              </Menu>
              <IconButton
                className="mr-3"
                onClick={handleEmailClick}
                aria-controls={emailopen ? "email-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={emailopen ? "true" : undefined}
              >
                <EmailIcon color="info" />
              </IconButton>
              <Menu
                className="dropDownList"
                anchorEl={emailAnchorEl}
                id="email-menu"
                open={emailopen}
                onClose={handleEmailClose}
                onClick={handleEmailClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <div className="head pl-3 pb-2 w-100 ">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Messages(34)
                  </Typography>
                </div>
                <Divider />
                <div className="scroll">
                  <MenuItem onClick={handleEmailClose}>
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem Ipsum</b> Now
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          Lorem ipsum dolor sit amet,
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleEmailClose}>
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem Ipsum</b> Now
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          Lorem ipsum dolor sit amet,
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider />
                </div>
                <Button
                  color="info"
                  textTransform={"capitalize"}
                  variant="contained"
                  className="w-100"
                  sx={{
                    position: "sticky",
                    bottom: 0,
                  }}
                >
                  View All emails
                </Button>
              </Menu>
              <IconButton
                className="mr-3"
                onClick={handleNotificationClick}
                aria-controls={
                  notificationsopen ? "notifications-menu" : undefined
                }
                aria-haspopup="true"
                aria-expanded={notificationsopen ? "true" : undefined}
              >
                <NotificationsIcon color="info" />
              </IconButton>
              <Menu
                className=" dropDownList "
                anchorEl={notificationsAnchorEl}
                id="notifications-menu"
                open={notificationsopen}
                onClose={handleNotificationClose}
                onClick={handleNotificationClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <div className="head pl-3 pb-2 w-100 ">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Notifications(34)
                  </Typography>
                </div>
                <Divider />
                <div className="scroll">
                  <MenuItem
                    onClick={handleNotificationClose}
                    className="mb-2"
                    sx={{ background: "#ebf6ff" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem</b> ipsum dolor sit, amet consectetur{" "}
                          <b>adipisicing elit</b>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          few seconds ago!
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={handleNotificationClose}
                    className="mb-2"
                    sx={{ background: "#ebf6ff" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem</b> ipsum dolor sit, amet consectetur{" "}
                          <b>adipisicing elit</b>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          few seconds ago!
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={handleNotificationClose}
                    className="mb-2"
                    sx={{ background: "#ebf6ff" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem</b> ipsum dolor sit, amet consectetur{" "}
                          <b>adipisicing elit</b>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          few seconds ago!
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={handleNotificationClose}
                    className="mb-2"
                    sx={{ background: "#ebf6ff" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem</b> ipsum dolor sit, amet consectetur{" "}
                          <b>adipisicing elit</b>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          few seconds ago!
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={handleNotificationClose}
                    className="mb-2"
                    sx={{ background: "#ebf6ff" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem</b> ipsum dolor sit, amet consectetur{" "}
                          <b>adipisicing elit</b>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          few seconds ago!
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={handleNotificationClose}
                    className="mb-2"
                    sx={{ background: "#ebf6ff" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="rounded-circle dropDown ">
                        <img src={user} alt="" width={"50px"} />
                      </span>
                      <div className="dropDownInfo ml-2 ">
                        <Typography variant="subtitle2" fontWeight={520}>
                          <b>Lorem</b> ipsum dolor sit, amet consectetur{" "}
                          <b>adipisicing elit</b>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#0858f7" }}
                          fontWeight={600}
                        >
                          few seconds ago!
                        </Typography>
                      </div>
                    </div>
                  </MenuItem>
                  <Button
                    color="info"
                    textTransform={"capitalize"}
                    variant="contained"
                    className="w-100 pl-2 "
                    sx={{
                      position: "sticky",
                      bottom: 0,
                    }}
                  >
                    View All Notifications
                  </Button>
                </div>
              </Menu>
              {isLoggedIn ? (
                <div className="myAccWrapper">
                  <div className="myAcc d-flex align-items-center">
                    <div className="userImg">
                      <span
                        className="rounded-circle"
                        style={{ color: "grey" }}
                      >
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                    <Button
                      endIcon={<KeyboardArrowDownIcon />}
                      className="userInfo"
                      onClick={handleClick}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <div className="col">
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          textTransform={"capitalize"}
                        >
                          {user?.name?.slice(0, 11)}..
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          fontSize={"12px"}
                          color={"grey"}
                          textTransform={"lowercase"}
                        >
                          {user?.email?.slice(0, 11)}..
                        </Typography>
                      </div>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={handleAccountClose}>
                        <Avatar /> My account
                      </MenuItem>

                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <LockResetIcon color="error" />
                        </ListItemIcon>
                        Reset Password
                      </MenuItem>

                      <MenuItem onClick={handleLogOut}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              ) : (
                <Button
                  variant="contained"
                  className=""
                  sx={{
                    borderRadius: "30px",
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                  href="/login"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
