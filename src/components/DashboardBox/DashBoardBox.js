import {
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import HistoryIcon from "@mui/icons-material/History";

const DashBoardBox = ({ color, title, icon, figure, figure2, grow }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className="dashboardBox"
        style={{
          backgroundImage: `linear-gradient(to right, ${color?.[0]},${color?.[1]})`,
        }}
      >
        {grow === "true" ? (
          <span className="chart">
            <TrendingUpIcon sx={{ fontSize: "80px" }} />
          </span>
        ) : (
          <span className="chart">
            <TrendingDownIcon sx={{ fontSize: "80px" }} />
          </span>
        )}
        <div className="d-flex w-100">
          <div className="col1">
            <Typography variant="h6" className="text-white" fontWeight={600}>
              {title}
            </Typography>
            <Typography variant="body1" className="text-white" fontWeight={600}>
              {figure}
            </Typography>
          </div>
          <div className="ml-auto">
            <IconButton>{icon}</IconButton>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <Typography variant="body2" className="text-white">
            Last Month: {figure2}%
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
      </div>
    </>
  );
};

export default DashBoardBox;
