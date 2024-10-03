import React, { useEffect, useState } from "react";
import {
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
} from "@mui/material";
import { BestSellingProduct, DashboardBox } from "../../components";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import QrCodeIcon from "@mui/icons-material/QrCode";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HistoryIcon from "@mui/icons-material/History";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);
    } else {
      navigate("/register");
    }
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {isLogin && (
        <div className="rightContent w-100">
          <div className="card shadow border-0 w-100 flex row p-4  ">
            <Typography variant="h5" className="mb-0" fontWeight={600}>
              Ecommerce
            </Typography>
            <Breadcrumbs
              aria-label="breadcrumb"
              className="ml-auto breadcrumbs_"
            >
              <StyledBreadCrumb
                component="a"
                href="#"
                label="Home"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadCrumb
                component="a"
                href="#"
                label="Dashboard"
                deleteIcon={<ExpandMoreIcon fontSize="small" />}
              />
              <StyledBreadCrumb label="Ecommerce" />
            </Breadcrumbs>
          </div>
          <div className="row dashboardBoxWrapperRow ">
            <div className="col-md-8">
              <div className="dashboardBoxWrapper d-flex">
                <DashboardBox
                  color={["#1da256", "#48d483"]}
                  title="Total Users"
                  icon={<PersonIcon />}
                  figure="277"
                  figure2="+30"
                  grow="true"
                />
                <DashboardBox
                  color={["#c012e2", "#eb64fe"]}
                  title="Total Orders"
                  icon={<ShoppingCartIcon />}
                  figure="338"
                  figure2="+30"
                  grow="true"
                />
                <DashboardBox
                  color={["#2c78e5", "#60aff5"]}
                  title="Total Products"
                  icon={<QrCodeIcon />}
                  figure="557"
                  figure2="-30"
                  grow="false"
                />
                <DashboardBox
                  color={["#e1950e", "#f3cd29"]}
                  title="Total Reviews"
                  icon={<StarIcon />}
                  figure="166"
                  figure2="+30"
                  grow="true"
                />
              </div>
            </div>
            <div className="col-md-4 pl-0">
              <div className="box graphBox">
                <div className="d-flex align-items-center">
                  <Typography variant="h6" className="text-white">
                    Total Sales
                  </Typography>
                  <IconButton
                    className="ml-auto"
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <MoreVertIcon />
                  </IconButton>
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
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      Last Day
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      Last Week
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      Last Month
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      Last Year
                    </MenuItem>
                  </Menu>
                </div>
                <Typography
                  variant="body1"
                  className="text-white"
                  fontWeight={600}
                  marginTop={2}
                >
                  $30,540,460
                </Typography>
                <Typography
                  variant="body2"
                  className="text-white"
                  sx={{ opacity: "0.6" }}
                >
                  Last Month: 40.63%
                </Typography>
              </div>
            </div>
          </div>
          <BestSellingProduct />
        </div>
      )}
    </>
  );
};

export default Dashboard;
