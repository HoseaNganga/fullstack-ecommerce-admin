import React, { useEffect, useState } from "react";
import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Rating,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import { fetchDataFromApi, modifyData } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
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

    "&:hover ,&:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editData, setEditData] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    images: [],
    brand: "",
    oldprice: 0,
    newprice: 0,
    category: "",
    subcategory: "",
    countInStock: 0,
    rating: 0,
    productsize: [],
    color: [],
    isFeatured: false,
    imagePublicId: [],
    discount: 0,
    productWeight: 0,
    catName: "",
  });
  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [productsize, setProductSize] = useState([]);
  const [productSizeData, setProductSizeData] = useState([]);
  const [isFeaturedValue, setIsFeaturedValue] = useState(false);
  const [productColorArr, setProductColorArr] = useState([]);
  const [productRatingVal, setProductRatingVal] = useState(0);
  const [productImageArr, setProductImageArr] = useState([]);
  const [productImagePreviewArr, setProductImagePreviewArr] = useState([]);
  const selectCatName = (cat) => {
    productData.catName = cat;
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]; // Allowed file types

    // Filter valid files by checking their type
    const validFiles = files.filter((file) => validTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      toast.error(
        "Only image files of type jpeg, jpg, png, or webp are allowed."
      );
      return;
    }

    // Generate previews for the valid files
    const newImagePreviews = validFiles?.map((file) =>
      URL.createObjectURL(file)
    );

    toast.success("Image File Uploaded");
    // Update the image arrays: Add the new valid files and previews to the state
    setProductImageArr((prevImages) => [...prevImages, ...validFiles]);
    setProductImagePreviewArr((prevPreviews) => [
      ...prevPreviews,
      ...newImagePreviews,
    ]);

    // Reset the file input field to allow re-uploading the same file if needed
    e.target.value = "";
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    const updatedImages = [...productImageArr];
    const updatedPreviews = [...productImagePreviewArr];

    updatedImages.splice(index, 1); // Remove image at the selected index
    updatedPreviews.splice(index, 1); // Remove the corresponding preview

    setProductImageArr(updatedImages);
    setProductImagePreviewArr(updatedPreviews);
  };
  const changeProductInputFields = (e) => {
    setProductData(() => ({
      ...productData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);

    setProductData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };
  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    setProductData((prev) => ({
      ...prev,
      subcategory: e.target.value,
    }));
  };

  const handleIsFeaturedChange = (e) => {
    setIsFeaturedValue(e.target.value);
    setProductData((prev) => ({
      ...prev,
      isFeatured: e.target.value,
    }));
  };
  const handleProductSizeChange = (e) => {
    const {
      target: { value },
    } = e;
    setProductSize(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleProductColorChange = (e) => {
    setProductColorArr(e.target.value.split(",").map((size) => size.trim()));
    setProductData((prev) => ({
      ...prev,
      color: [e.target.value],
    }));
  };
  const handleRatingChange = (newValue) => {
    setProductRatingVal(newValue);

    setProductData((prev) => ({
      ...prev,
      rating: newValue,
    }));
  };
  const handleProductEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productData?.name);
    formData.append("description", productData?.description);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("oldprice", productData?.oldprice);
    formData.append("newprice", productData?.newprice);
    formData.append("isFeatured", isFeaturedValue);
    formData.append("countInStock", productData?.countInStock);
    formData.append("discount", productData?.discount);
    formData.append("productWeight", productData?.productWeight);
    formData.append("rating", productRatingVal);
    formData.append("brand", productData?.brand);
    formData.append("catName", productData?.catName);

    productsize.forEach((size, index) => {
      formData.append("productsize[]", size);
    });

    productColorArr.forEach((color, index) => {
      formData.append("color[]", color);
    });

    const originalProduct = await fetchDataFromApi(`/api/products/${id}`);

    const originalImages = originalProduct
      ? originalProduct?.productItem?.images
      : [];

    // Function to compare two arrays of images (URLs or file references)
    const arraysAreEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      // Check if all elements in both arrays are identical
      return arr1.every((img, index) => img === arr2[index]);
    };

    // Check if the images have changed by comparing the contents of the arrays
    const imagesChanged = !arraysAreEqual(productImageArr, originalImages);

    // If images have changed, append each image to FormData
    if (imagesChanged) {
      productImageArr.forEach((image, index) => {
        formData.append("images[]", image); // Appending each image with a key like 'images[]'
      });
    }

    const editProductPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await modifyData(`/api/products/${id}`, formData);
        if (response.success) {
          setProductData({
            name: "",
            description: "",
            images: [],
            brand: "",
            oldprice: 0,
            newprice: 0,
            category: "",
            subcategory: "",
            countInStock: 0,
            rating: 0,
            productsize: "",
            color: [],
            isFeatured: false,
            discount: 0,
            productWeight: 0,
            catName: "",
          });

          setProductImageArr([]);
          setProductImagePreviewArr([]);
          setCategory("");
          setSubCategory("");
          setProductRatingVal(0);
          setProductSize([]);
          setIsFeaturedValue(false);
          resolve();
          navigate("/productlist");
          window.location.reload();
        } else {
          reject(new Error(response.error || "An error has occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(editProductPromise, {
      loading: "Product is being Edited",
      success: "Product Successfully Edited and Associated Images",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  useEffect(() => {
    setProductData((prevData) => ({
      ...prevData,
      productsize: productsize, // Sync productsize with productData
    }));
  }, [productsize]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductData = async () => {
      try {
        const productData = await fetchDataFromApi(`/api/products/${id}`);
        const categoryData = await fetchDataFromApi("/api/categories");
        const subcategoryData = await fetchDataFromApi("/api/subcategories");
        const productSizeResp = await fetchDataFromApi("/api/productsize");
        setEditData(productData?.productItem);
        setCategoryData(categoryData);
        setSubCategoryData(subcategoryData);
        setProductSizeData(productSizeResp?.productSizeList);
        const validCategoryid = categoryData?.categoryList.find(
          (cat) => cat._id === productData?.productItem?.category._id
        )
          ? productData?.productItem?.category._id
          : "";
        const validsubCategoryid = subcategoryData?.subCategoryList.find(
          (subcat) => subcat._id === productData?.productItem?.subcategory._id
        )
          ? productData?.productItem?.subcategory._id
          : "";
        if (productData?.productItem && productSizeResp?.productSizeList) {
          const selectedSizes = productData?.productItem?.productsize
            .map((size) => {
              const foundsize = productSizeResp?.productSizeList?.find(
                (item) => item._id === size._id
              );
              return foundsize ? size._id : null;
            })
            .filter(Boolean); // Filter out any null values

          setProductSize(selectedSizes);
        }

        setCategory(validCategoryid);
        setSubCategory(validsubCategoryid);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (editData) {
      setProductData({
        name: editData?.name || "",
        description: editData?.description || "",
        images: editData?.images || [],
        brand: editData?.brand || "",
        oldprice: editData?.oldprice || 0,
        newprice: editData?.newprice || 0,
        countInStock: editData?.countInStock || 0,
        isFeatured: false,
        discount: editData?.discount || 0,
        productWeight: editData?.productWeight || 0,
      });
      setProductImageArr(editData?.images || []);
      setProductImagePreviewArr(editData?.images || []);
      setProductColorArr(editData?.color || []);
      setIsFeaturedValue(editData?.isFeatured || false);
      setProductRatingVal(parseInt(editData?.rating || 0));
    }
  }, [editData]);

  console.log(productRatingVal);

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Product Edit
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="#"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb
              component="a"
              href="/productlist"
              label="Products"
              deleteIcon={<ExpandMoreIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="ProductEdit" />
          </Breadcrumbs>
        </div>
        <form className="row" onSubmit={handleProductEdit}>
          <div className="col">
            <div className="card p-4">
              <Typography variant="h5" className="mb-0" fontWeight={600}>
                Edit Information
              </Typography>
              <div className="formClass">
                <div className="form-group mt-4">
                  <TextField
                    sx={{ background: "white", borderRadius: "8px" }}
                    type="text"
                    placeholder="Title"
                    required
                    size="small"
                    variant="outlined"
                    label="Title"
                    className="w-100"
                    name="name"
                    value={productData?.name}
                    onChange={changeProductInputFields}
                  />
                </div>
                <div className="form-group mt-4">
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Description:
                  </Typography>
                  <textarea
                    className="w-100"
                    rows={5}
                    cols={20}
                    required
                    placeholder="Description"
                    name="description"
                    onChange={changeProductInputFields}
                    value={productData?.description}
                  ></textarea>
                </div>
                <div className="d-flex align-items-center">
                  <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Category
                    </InputLabel>
                    <Select
                      className="w-100"
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={category || ""}
                      size="small"
                      label="Category"
                      sx={{ background: "white", borderRadius: "5px" }}
                      onChange={handleCategoryChange}
                      required
                    >
                      {categoryData?.length !== 0 &&
                        categoryData?.categoryList.length !== 0 &&
                        categoryData?.categoryList?.map((category) => (
                          <MenuItem
                            key={category._id}
                            value={category._id}
                            onClick={() => selectCatName(category?.name)}
                          >
                            {category?.name}
                          </MenuItem>
                        ))}

                      {categoryData?.length === 0 && (
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                      )}
                    </Select>
                    <FormHelperText>
                      Please click on the category again...
                    </FormHelperText>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Sub Category
                    </InputLabel>
                    <Select
                      className="w-100"
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={subcategory || ""}
                      size="small"
                      label="subcategory"
                      sx={{ background: "white", borderRadius: "5px" }}
                      onChange={handleSubCategoryChange}
                      required
                      disabled
                    >
                      {subcategoryData?.length !== 0 &&
                        subcategoryData?.subCategoryList.length !== 0 &&
                        subcategoryData?.subCategoryList?.map((subcategory) => (
                          <MenuItem
                            key={subcategory._id}
                            value={subcategory._id}
                          >
                            {subcategory.subcategory}
                          </MenuItem>
                        ))}

                      {categoryData?.length === 0 && (
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
                <div
                  className="d-flex align-items-center mt-4"
                  style={{ gap: "16px" }}
                >
                  <TextField
                    type="number"
                    className="w-100 "
                    label="Regular Price"
                    size="small"
                    sx={{ background: "white", borderRadius: "5px" }}
                    required
                    name="oldprice"
                    value={productData?.oldprice}
                    onChange={changeProductInputFields}
                  />

                  <TextField
                    sx={{ background: "white", borderRadius: "5px" }}
                    type="number"
                    className="w-100 "
                    label="Discount Price "
                    size="small"
                    required
                    name="newprice"
                    value={productData?.newprice}
                    onChange={changeProductInputFields}
                  />
                </div>
                <div className="d-flex align-items-center mt-4">
                  <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Is Featured:
                    </InputLabel>
                    <Select
                      className="w-100"
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={isFeaturedValue}
                      size="small"
                      label="isFeatured"
                      sx={{ background: "white", borderRadius: "5px" }}
                      onChange={handleIsFeaturedChange}
                      required
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"true"}>True</MenuItem>
                      <MenuItem value={"false"}>False</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    required
                    type="number"
                    className="w-100 "
                    label="In Stock"
                    size="small"
                    name="countInStock"
                    onChange={changeProductInputFields}
                    value={productData.countInStock}
                    sx={{ background: "white", borderRadius: "8px" }}
                  />
                </div>
                <div
                  className="d-flex align-items-center mt-4"
                  style={{ gap: "16px" }}
                >
                  <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Product Size
                    </InputLabel>
                    <Select
                      className="w-100"
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={productsize}
                      multiple
                      size="small"
                      label="Product Size"
                      sx={{ background: "white", borderRadius: "5px" }}
                      onChange={handleProductSizeChange}
                    >
                      {productSizeData?.length !== 0 &&
                        productSizeData?.map((size) => (
                          <MenuItem key={size?._id} value={size?._id}>
                            {size?.productsize}
                          </MenuItem>
                        ))}

                      {productSizeData?.length === 0 && (
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <TextField
                    type="text"
                    label="color"
                    name="color"
                    size="small"
                    className="w-100"
                    value={productColorArr.join(",")}
                    onChange={handleProductColorChange}
                  />
                </div>
                <div
                  className="d-flex align-items-center mt-4"
                  style={{ gap: "16px" }}
                >
                  <TextField
                    type="number"
                    className="w-100 "
                    label="Discount-Percent "
                    size="small"
                    sx={{ background: "white", borderRadius: "5px" }}
                    name="discount"
                    onChange={changeProductInputFields}
                    value={productData?.discount}
                  />

                  <TextField
                    sx={{ background: "white", borderRadius: "5px" }}
                    type="number"
                    className="w-100 "
                    label="Product Weight "
                    size="small"
                    value={productData?.productWeight}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Kgs</InputAdornment>
                      ),
                    }}
                    name="productWeight"
                    onChange={changeProductInputFields}
                  />
                </div>
                <div
                  className="d-flex align-items-center justify-content-between w-100  mt-4"
                  style={{ gap: "16px" }}
                >
                  <div className="w-100">
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
                      Rating:
                    </Typography>
                    <Rating
                      value={parseInt(productRatingVal ?? 0)}
                      onChange={(e, newValue) => handleRatingChange(newValue)}
                    />
                  </div>
                  <TextField
                    type="text"
                    name="brand"
                    label="Brand"
                    value={productData.brand}
                    onChange={changeProductInputFields}
                    className="w-100"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-2 ml-3 p-4 w-100 ">
            <div className="imagesUploadSec">
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Media And Published
              </Typography>
            </div>
            <div className="imgUploadBox d-flex align-items-center mt-3">
              <div className="uploadBox">
                <TextField
                  type="file"
                  accept="image/png, image/jpeg, image/jpg , image/webp"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div
              className="imgUploadBox d-flex align-items-center"
              id="productImageGrid"
            >
              {productImagePreviewArr?.map((image, index) => (
                <div className="uploadBox" key={index}>
                  <IconButton
                    className="remove"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon
                      sx={{
                        fontSize: "20px",
                        "&:hover": {
                          color: "red",
                        },
                      }}
                    />
                  </IconButton>
                  <div className="box">
                    <LazyLoadImage
                      alt={`image-${index}`}
                      effect="blur"
                      className="w-100"
                      src={image}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            startIcon={<CloudUploadIcon />}
            variant="contained"
            className="w-100"
            type="submit"
          >
            Edit & VIEW
          </Button>
        </form>
      </div>
    </>
  );
};

export default ProductEditPage;
