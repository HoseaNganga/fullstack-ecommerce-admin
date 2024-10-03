import { Button, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import DataContext from "../../DataContext/DataContext";
import CategoryIcon from "@mui/icons-material/Category";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import PhotoIcon from "@mui/icons-material/Photo";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { themeMode } = useContext(DataContext);
  const [toggleSubMenu, setToggleSubMenu] = useState(false);
  const openSubMenu = (index) => {
    setActiveTab(index);

    setToggleSubMenu(!toggleSubMenu);
  };
  return (
    <>
      <div className="sidebar">
        <Typography
          variant="subtitle1"
          sx={{ color: themeMode ? "#5e5d72" : "#e7e0e0" }}
          gutterBottom
          marginTop={2}
          fontWeight={600}
          paddingLeft={2}
        >
          Main Pages
        </Typography>
        <ul>
          <li>
            <Button
              className={`d-flex align-items-center justify-content-between w-100 ${
                activeTab === 0 ? "active" : ""
              } `}
              startIcon={<DashboardIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
                "&:hover": {
                  color: "#0858f7",
                },
              }}
              href=""
              onClick={() => openSubMenu(0)}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Dashboard
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 0 && toggleSubMenu ? "open" : "collapse"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                    href="/"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      E-commerce
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Analytics
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Crm
                    </Typography>
                  </Button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Button
              className={`d-flex align-items-center justify-content-between w-100 ${
                activeTab === 1 ? "active" : ""
              } `}
              startIcon={<LockIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
                "&:hover": {
                  color: "#0858f7",
                },
              }}
              href=""
              onClick={() => openSubMenu(1)}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Authentication
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 1 && toggleSubMenu ? "open" : "collapse"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                    href="/login"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Login
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/register"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Register
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Forgot Password
                    </Typography>
                  </Button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Button
              className={`d-flex align-items-center justify-content-between w-100 ${
                activeTab === 2 ? "active" : ""
              } `}
              startIcon={<AccountCircleIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
                "&:hover": {
                  color: "#0858f7",
                },
              }}
              href=""
              onClick={() => openSubMenu(2)}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Users
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 2 && toggleSubMenu ? "open" : "collapse"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                    href="/userlist"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      User List
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      User Profile
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      My Account
                    </Typography>
                  </Button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Button
              className={`d-flex align-items-center justify-content-between w-100 ${
                activeTab === 3 ? "active" : ""
              } `}
              startIcon={<CategoryIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
                "&:hover": {
                  color: "#0858f7",
                },
              }}
              href=""
              onClick={() => openSubMenu(3)}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Category
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 3 && toggleSubMenu ? "open" : "collapse"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                    href="/categories"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Category List
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/category/add"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      CategoryUpload
                    </Typography>
                  </Button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Button
              className={`d-flex align-items-center justify-content-between w-100 ${
                activeTab === 4 ? "active" : ""
              } `}
              startIcon={<LabelOutlinedIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
                "&:hover": {
                  color: "#0858f7",
                },
              }}
              href=""
              onClick={() => openSubMenu(4)}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                SubCategory
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 4 && toggleSubMenu ? "open" : "collapse"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                    href="/subcategories/add"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Add Subcategory
                    </Typography>
                  </Button>
                </li>
                <li>
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                    href="/subcategories"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      SubCategoryList
                    </Typography>
                  </Button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Button
              className={`d-flex align-items-center justify-content-between w-100 ${
                activeTab === 5 ? "active" : ""
              } `}
              startIcon={<QrCodeIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
              }}
              href=""
              onClick={() => openSubMenu(5)}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
                sx={{
                  "&:hover": {
                    color: "#0858f7",
                  },
                }}
              >
                Products
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 5 && toggleSubMenu ? "open" : "collapse"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                    href="/productlist"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Product List
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Product View
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/productupload"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Product Upload
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/productsize/add"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Product Size Upload
                    </Typography>
                  </Button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Button
              className=" d-flex align-items-center justify-content-between w-100 "
              startIcon={<ReceiptIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
              }}
              href="/"
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Invoices
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
          </li>
          <li>
            <Button
              className={`d-flex align-items-center justify-content-between w-100 ${
                activeTab === 6 ? "active" : ""
              } `}
              startIcon={<PhotoIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
              }}
              href=""
              onClick={() => openSubMenu(6)}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
                sx={{
                  "&:hover": {
                    color: "#0858f7",
                  },
                }}
              >
                Banners
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 6 && toggleSubMenu ? "open" : "collapse"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Button
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                    href="/bannerList"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Banner List
                    </Typography>
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    href="/banner/create"
                    sx={{
                      color: themeMode ? "#5e5d72" : "#e7e0e0",
                      display: "block",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      textTransform={"none"}
                      fontSize={"inherit"}
                    >
                      Banner Create
                    </Typography>
                  </Button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Button
              className=" d-flex align-items-center justify-content-between w-100 "
              startIcon={<ShoppingCartIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
              }}
              href="/orders"
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Orders
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
          </li>

          <li>
            <Button
              className=" d-flex align-items-center justify-content-between w-100 "
              startIcon={<EmailIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
              }}
              href="/"
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Messages
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
          </li>
          <li>
            <Button
              className=" d-flex align-items-center justify-content-between w-100 "
              startIcon={<NotificationsIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
              }}
              href="/"
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Notifications
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
          </li>
          <li>
            <Button
              className=" d-flex align-items-center justify-content-between w-100 "
              startIcon={<SettingsIcon />}
              sx={{
                color: themeMode ? "#5e5d72" : "#e7e0e0",
              }}
              href="/"
            >
              <Typography
                variant="caption"
                fontWeight={600}
                textTransform={"none"}
                fontSize={"inherit"}
              >
                Settings
              </Typography>

              <span className="d-flex align-items-center ">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
          </li>
        </ul>
        <div className="logOutWrapper mt-4">
          <div className="logOutBox">
            <Button variant="contained" className="" startIcon={<LockIcon />}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
