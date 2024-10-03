import React, { useEffect, useState } from "react";
import {
  Typography,
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { BestSellingProduct, DashboardBox } from "../../components";
import HomeIcon from "@mui/icons-material/Home";
import { fetchDataFromApi } from "../../utils/api";
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

const ProductListPage = () => {
  const [productData, setProductData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await fetchDataFromApi(`/api/products`);
        setProductData(data);
        const brands = data?.productList?.filter(
          (product) => product.brand.trim() !== ""
        );
        setBrandData(brands);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductData();
  }, []);

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Product List
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Home"
              sx={{
                cursor: "pointer",
              }}
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="ProductList" />
            <StyledBreadCrumb
              component="a"
              href="/productupload"
              label="Add Product"
              sx={{
                cursor: "pointer",
                background: "blue",
                color: "white",
              }}
            />
          </Breadcrumbs>
        </div>
        <div className="row dashboardBoxWrapperRow ml-1 ">
          <div className="w-100">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                title="Total Products"
                icon={<QrCodeIcon />}
                figure={productData?.totalPosts}
                figure2="-30"
                grow="false"
              />
              <DashboardBox
                color={["#e1950e", "#f3cd29"]}
                title="Total Categories"
                icon={<CategoryIcon />}
                figure={productData?.totalPosts}
                figure2="+30"
                grow="true"
              />
              <DashboardBox
                color={["#1da256", "#48d483"]}
                title="Total Brands"
                icon={<BrandingWatermarkIcon />}
                figure={brandData?.length}
                figure2="+30"
                grow="true"
              />
            </div>
          </div>
        </div>
        <BestSellingProduct />
      </div>
    </>
  );
};

export default ProductListPage;
