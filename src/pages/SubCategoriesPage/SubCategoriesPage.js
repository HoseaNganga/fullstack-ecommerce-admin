import React, { useEffect, useState } from "react";
import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchDataFromApi, postData } from "../../utils/api";
import toast from "react-hot-toast";
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

    "&:hover ,&:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const SubCategoriesPage = () => {
  const navigate = useNavigate();
  const [subCategoryData, setSubCategoryData] = useState({
    category: "",
    subcategory: "",
  });
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState("");
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategoryData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };
  const changeCategoryInputFields = (e) => {
    setSubCategoryData(() => ({
      ...subCategoryData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubCategoryAdd = (e) => {
    e.preventDefault();
    const addSubCategoryPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData(
          `/api/subcategories/create`,
          subCategoryData
        );
        if (response.success) {
          setSubCategoryData({
            category: "",
            subcategory: "",
          });
          setCategory("");
          resolve();
          navigate("/subcategories");
        } else {
          reject(new Error(response.error || "An error has occured "));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(addSubCategoryPromise, {
      loading: "Subcategory is being Created..",
      success: "SubCategory Created Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategoryData = async () => {
      try {
        const categoryData = await fetchDataFromApi("/api/categories");
        setCategoryData(categoryData);
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
            Add SubCategory
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
              sx={{
                cursor: "pointer",
              }}
            />
            <StyledBreadCrumb
              component="a"
              href="/subcategories"
              label="subcategories"
              icon={<ExpandMoreIcon fontSize="small" />}
              sx={{
                cursor: "pointer",
              }}
            />
            <StyledBreadCrumb label="SubCategories Upload" />
          </Breadcrumbs>
        </div>
        <form className="row" onSubmit={handleSubCategoryAdd}>
          <div className="col">
            <div className="card p-4">
              <div className="formClass">
                <div className="form-group mt-4">
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
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
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
                <div className="form-group mt-4">
                  <TextField
                    sx={{ background: "white", borderRadius: "8px" }}
                    type="text"
                    placeholder="Title"
                    required
                    size="small"
                    variant="outlined"
                    label="subcategory"
                    className="w-100"
                    name="subcategory"
                    value={subCategoryData?.subcategory}
                    onChange={changeCategoryInputFields}
                  />
                </div>
              </div>
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

export default SubCategoriesPage;
