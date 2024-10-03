import {
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Pagination,
  IconButton,
  Rating,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DataContext from "../../DataContext/DataContext";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import nodata from "../../ImageAssets/noproduct.jpg";

const BestSellingProducts = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(10);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const { themeMode } = useContext(DataContext);
  const [productData, setProductData] = useState({
    productList: [],
    totalPages: 0,
    totalPosts: 0,
  });
  const [categoryData, setCategoryData] = useState({
    categoryList: [],
    totalPages: 0,
    totalPosts: 0,
  });

  const handlePaginationChange = (e, value) => {
    fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
      setProductData(res);
    });
  };

  const deleteCategory = (id) => {
    const deleteProductPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await deleteData(`/api/products/${id}`);
        if (response.success) {
          const refetchData = await fetchDataFromApi(`/api/products`);
          setProductData(refetchData);
          navigate("/productlist");
          resolve();
        } else {
          reject(new Error(response.error || "An error has occured"));
        }
      } catch (error) {
        reject();
      }
    });

    toast.promise(deleteProductPromise, {
      loading: "Product is being deleted..",
      success: "Product deleted Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await fetchDataFromApi(`/api/products`);
        setProductData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductData();
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const data = await fetchDataFromApi(`/api/categories`);
        setCategoryData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryData();
  }, []);

  return (
    <>
      <div className="card shadow border-0 p-3 mt-4 adminTableFilter">
        <Typography
          variant="h5"
          fontWeight={600}
          textTransform={"capitalize"}
          gutterBottom
        >
          best selling products
        </Typography>
        <div className="row cardFilters">
          <div className="col-md-3">
            <Typography variant="subtitle1" fontWeight={600}>
              SHOW BY:
            </Typography>
            <div>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 120,
                  "& .MuiMenu-paper": {
                    backgroundColor: "blue", // Set background color for the Select component
                    color: "white", // Set text color for the Select component
                  },
                }}
              >
                <InputLabel id="demo-simple-select-helper-label">
                  Rows
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={rows}
                  label="rows"
                  onChange={(e) => setRows(e.target.value)}
                  size="small"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: themeMode ? "" : "#1b2b4d",
                        color: themeMode ? "" : "white",
                      },
                    },
                  }}
                  sx={{
                    padding: "0px 20px",
                    color: themeMode ? "black" : "white",
                  }}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={8}>Eight</MenuItem>
                  <MenuItem value={6}>Six</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="col-md-3">
            <Typography variant="subtitle1" fontWeight={600}>
              CATEGORY BY:
            </Typography>
            <div>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Category
                </InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: themeMode ? "" : "#1b2b4d",
                        color: themeMode ? "" : "white",
                      },
                    },
                  }}
                  sx={{
                    padding: "0px 20px",
                    color: themeMode ? "black" : "white",
                  }}
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={category}
                  label="category"
                  onChange={(e) => setCategory(e.target.value)}
                  size="small"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categoryData?.categoryList?.length !== 0 &&
                    categoryData?.categoryList?.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category?.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="col-md-3 ">
            <Typography variant="subtitle1" fontWeight={600}>
              Brand BY:
            </Typography>
            <div>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  {" "}
                  Brand
                </InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: themeMode ? "" : "#1b2b4d",
                        color: themeMode ? "" : "white",
                      },
                    },
                  }}
                  sx={{
                    padding: "0px 20px",
                    color: themeMode ? "black" : "white",
                  }}
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={brand}
                  label="brand"
                  onChange={(e) => setBrand(e.target.value)}
                  size="small"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {productData?.productList?.length !== 0 &&
                    productData?.productList
                      ?.filter((product) => product.brand.trim() !== "")
                      .map((product) => (
                        <MenuItem key={product._id} value={product.brand}>
                          {product?.brand}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>UID</th>
                <th>Product</th>
                <th>category</th>
                <th>Sub Category</th>
                <th>brand</th>
                <th>price</th>
                <th>size</th>
                <th>stock</th>
                <th>rating</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {productData?.productList?.length !== 0 &&
                productData?.productList?.map((product, index) => (
                  <tr key={product._id}>
                    <td>#{index}</td>
                    <td>
                      <div className="d-flex">
                        <div className="imgWrapper">
                          <div className="img">
                            <img
                              src={product?.images[0]}
                              alt={product?.name}
                              width="50px"
                              height="50px"
                            />
                          </div>
                        </div>
                        <div className="info" style={{ marginLeft: "5px" }}>
                          <Typography variant="subtitle1">
                            {product.name.slice(0, 22)}....
                          </Typography>
                          <Typography
                            variant="caption"
                            className="table-cell-nowrap"
                          >
                            {product.description.slice(0, 22)}....
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {product?.category?.name}
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {product?.subcategory?.subcategory}
                    </td>
                    <td>{product?.brand}</td>
                    <td>
                      <del className="oldPrice text-danger ">
                        ${product?.oldprice}
                      </del>
                      <span className="newPrice text-success bold">
                        ${product?.newprice}
                      </span>
                    </td>
                    <td>
                      {product &&
                        product?.productsize?.length !== 0 &&
                        product?.productsize?.map((size) => (
                          <span
                            className="badge badge-primary mr-1"
                            key={size?._id}
                          >
                            {size?.productsize}
                          </span>
                        ))}
                    </td>
                    <td>{product?.countInStock}</td>
                    <td>
                      <Rating value={product?.rating} />
                    </td>
                    <td className="">
                      <div className="actions d-flex align-items-center">
                        <IconButton href={`/product/${product?._id}`}>
                          <VisibilityIcon
                            color="secondary"
                            sx={{ fontSize: "20px", opacity: "1" }}
                          />
                        </IconButton>
                        <IconButton href={`/product/edit/${product?._id}`}>
                          <EditIcon color="success" sx={{ fontSize: "20px" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteCategory(product?._id)}
                        >
                          <DeleteIcon color="error" sx={{ fontSize: "20px" }} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="d-flex tableFooter">
            <Typography marginBottom={0}>
              Showing <b>{productData?.productList?.length}</b> out of{" "}
              <b>{productData?.totalPosts}</b> results
            </Typography>
            <Pagination
              count={productData?.totalPages}
              showFirstButton
              showLastButton
              color="primary"
              className="pagination"
              onChange={handlePaginationChange}
            />
          </div>
          {productData?.productList?.length === 0 && (
            <div className="d-flex align-items-center justify-content-center">
              <img src={nodata} height={"250px"} alt="noData" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BestSellingProducts;
