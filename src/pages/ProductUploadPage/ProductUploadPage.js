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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
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

const ProductUploadPage = () => {
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [productsize, setProductSize] = useState([]);
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [productSizeData, setProductSizeData] = useState([]);
  const [productRatingVal, setProductRatingVal] = useState(0);
  const [productFormFields, setProductFormFields] = useState({
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
  const [isFeaturedValue, setIsFeaturedValue] = useState(false);
  const [productImageArr, setProductImageArr] = useState([]);
  const [productImagePreviewArr, setProductImagePreviewArr] = useState([]);
  const [productColorArr, setProductColorArr] = useState([]);
  const selectCatName = (cat) => {
    productFormFields.catName = cat;
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
    setProductFormFields(() => ({
      ...productFormFields,
      [e.target.name]: e.target.value,
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
    productFormFields.productsize = productsize;
  };

  const handleProductAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productFormFields?.name);
    formData.append("description", productFormFields?.description);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("oldprice", productFormFields?.oldprice);
    formData.append("newprice", productFormFields?.newprice);
    formData.append("isFeatured", isFeaturedValue);
    formData.append("countInStock", productFormFields?.countInStock);
    formData.append("discount", productFormFields?.discount);
    formData.append("productWeight", productFormFields?.productWeight);
    formData.append("rating", productRatingVal);
    formData.append("brand", productFormFields?.brand);
    formData.append("catName", productFormFields?.catName);

    productsize.forEach((size, index) => {
      formData.append("productsize[]", size);
    });

    productColorArr.forEach((color, index) => {
      formData.append("color[]", color);
    });
    productImageArr.forEach((image, index) => {
      formData.append("images[]", image); // Use the key 'images[]' to indicate it's an array
    });

    const createProductPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/products/create", formData);
        if (response.success) {
          setProductFormFields({
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
          resolve();
          navigate("/productlist");
        } else {
          reject(new Error(response.error || "An error has occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(createProductPromise, {
      loading: "Product is being Created and Images Being Uploaded",
      success: "Product Successfully Created and Associated Images",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategoryData = async () => {
      try {
        const resp = await fetchDataFromApi("/api/categories");
        const subCategoryResp = await fetchDataFromApi("/api/subcategories");
        const productSizeResp = await fetchDataFromApi("/api/productsize");
        setCategoryData(resp);
        setSubCategoryData(subCategoryResp);
        setProductSizeData(productSizeResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryData();
  }, []);
  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Product Upload
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
              label="Product List"
              deleteIcon={<ExpandMoreIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="ProductUpload" />
          </Breadcrumbs>
        </div>

        <form className="row " onSubmit={handleProductAdd}>
          <div className="col">
            <div className="card p-4">
              <Typography variant="h5" className="mb-0" fontWeight={600}>
                Basic Information
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
                    value={productFormFields?.name}
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
                    value={productFormFields?.description}
                    onChange={changeProductInputFields}
                  ></textarea>
                  <FormHelperText>This is a required field</FormHelperText>
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
                      value={category}
                      size="small"
                      label="Category"
                      sx={{ background: "white", borderRadius: "5px" }}
                      onChange={(e) => setCategory(e.target.value)}
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
                    <FormHelperText>This is a required field</FormHelperText>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Sub Category
                    </InputLabel>
                    <Select
                      className="w-100"
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={subcategory}
                      size="small"
                      label="subcategory"
                      sx={{ background: "white", borderRadius: "5px" }}
                      onChange={(e) => setSubCategory(e.target.value)}
                      required
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
                    <FormHelperText>This is a required field</FormHelperText>
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
                    onChange={changeProductInputFields}
                    value={productFormFields?.oldprice}
                  />

                  <TextField
                    sx={{ background: "white", borderRadius: "5px" }}
                    type="number"
                    className="w-100 "
                    label="Discount Price "
                    size="small"
                    required
                    name="newprice"
                    value={productFormFields?.newprice}
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
                      label="Category"
                      sx={{ background: "white", borderRadius: "5px" }}
                      onChange={(e) => setIsFeaturedValue(e.target.value)}
                      required
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"true"}>True</MenuItem>
                      <MenuItem value={"false"}>False</MenuItem>
                    </Select>
                    <FormHelperText>This is a required Field</FormHelperText>
                  </FormControl>
                  <TextField
                    required
                    type="number"
                    className="w-100 "
                    label="In Stock"
                    size="small"
                    name="countInStock"
                    helperText="This is a required field"
                    onChange={changeProductInputFields}
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
                      {productSizeData?.productSizeList?.length !== 0 &&
                        productSizeData?.productSizeList?.map((size) => (
                          <MenuItem key={size?._id} value={size?._id}>
                            {size?.productsize}
                          </MenuItem>
                        ))}

                      {categoryData?.length === 0 && (
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
                    helperText="If multiple colors please separate as follows (black,red,green)"
                    className="w-100"
                    value={productColorArr.join(",")}
                    onChange={(e) =>
                      setProductColorArr(
                        e.target.value.split(",").map((size) => size.trim())
                      )
                    }
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
                    required
                    sx={{ background: "white", borderRadius: "5px" }}
                    name="discount"
                    value={productFormFields?.discount}
                    onChange={changeProductInputFields}
                  />

                  <TextField
                    sx={{ background: "white", borderRadius: "5px" }}
                    type="number"
                    className="w-100 "
                    label="Product Weight "
                    size="small"
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
                  className="d-flex align-items-center mt-4"
                  style={{ gap: "16px" }}
                >
                  <div
                    className="d-flex align-items-center justify-space-between  mt-4 w-100"
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
                        value={productRatingVal}
                        onChange={(event, newValue) => {
                          setProductRatingVal(newValue);
                        }}
                      />
                    </div>

                    <TextField
                      type="text"
                      name="brand"
                      label="Brand"
                      onChange={changeProductInputFields}
                      className="w-100 "
                      size="small"
                    />
                  </div>
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
            PUBLISH & VIEW
          </Button>
        </form>
      </div>
    </>
  );
};

export default ProductUploadPage;
