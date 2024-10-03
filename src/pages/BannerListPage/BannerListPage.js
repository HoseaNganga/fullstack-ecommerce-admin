import React, { useEffect, useState } from "react";
import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteData, fetchDataFromApi } from "../../utils/api";

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

const BannerListPage = () => {
  const [bannerData, setBannerData] = useState([]);
  const handleDeleteBanner = (id) => {
    const deleteBannerPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await deleteData(`/api/banner/${id}`);
        if (response.success) {
          const refetchBannerData = await fetchDataFromApi(`/api/banner`);
          setBannerData(refetchBannerData);
          resolve();
        } else {
          reject(new Error(response.error || "An unexpected error occured"));
        }
      } catch (error) {
        console.log(error);
      }
    });
    toast.promise(deleteBannerPromise, {
      loading: "Banner is being deleted..",
      success: "Banner deleted Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  useEffect(() => {
    const fetchBannerData = async () => {
      const response = await fetchDataFromApi(`/api/banner`);
      setBannerData(response);
    };
    fetchBannerData();
  }, []);
  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            ALL Banners
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="BannerList" />
          </Breadcrumbs>
        </div>
        <div className="card shadow border-0 p-3 mt-4 adminTableFilter">
          <Typography
            variant="h5"
            fontWeight={600}
            textTransform={"capitalize"}
            gutterBottom
          >
            All Banners
          </Typography>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th>Banner Image</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {bannerData?.bannerList?.length !== 0 &&
                  bannerData?.bannerList?.map((banner, index) => (
                    <tr key={banner?._id}>
                      <td>#{index}</td>
                      <td>
                        <div className="d-flex">
                          <div className="imgWrapper">
                            <div className="img">
                              <img
                                src={banner?.image}
                                alt={`BannerImage`}
                                width="50px"
                                height="50px"
                                style={{
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="actions d-flex align-items-center">
                          <IconButton
                            onClick={() => handleDeleteBanner(banner._id)}
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
      </div>
    </>
  );
};

export default BannerListPage;
