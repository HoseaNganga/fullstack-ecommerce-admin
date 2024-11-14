import React, { useContext, useEffect, useState } from "react";
import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteData, fetchDataFromApi, modifyData } from "../../utils/api";
import DataContext from "../../DataContext/DataContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import nodata from "../../ImageAssets/nodata.png";
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

const SubCategoriesListPage = () => {
  const navigate = useNavigate();
  const { themeMode } = useContext(DataContext);
  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = useState(null);
  const [editSubCategoryFormFields, setEditSubCategoryFormFields] = useState({
    category: "",
    subcategory: "",
  });

  const handleSubCategoryChange = (e) => {
    setEditSubCategoryFormFields((prev) => ({
      ...prev,
      subcategory: e.target.value,
    }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setEditSubCategoryFormFields((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };
  const handleSubCategoryEdit = async (id) => {
    setOpen(true);
    const response = await fetchDataFromApi(`/api/subcategories/${id}`);
    const categoryData = await fetchDataFromApi(`/api/categories`);
    const validCategoryid = categoryData?.categoryList?.find(
      (cat) => cat._id === response?.subcategory?.category?._id
    )
      ? response?.subcategory?.category?._id
      : "";
    setCategory(validCategoryid);

    setEditSubCategoryFormFields({
      category: validCategoryid,
      subcategory: response ? response?.subcategory?.subcategory : "",
    });
    setEditId(id);
  };

  const handleSubCategoryDelete = (id) => {
    const deleteCategoryPromise = new Promise(async (resolve, reject) => {
      try {
        deleteData(`/api/subcategories/${id}`).then((res) => {
          fetchDataFromApi("/api/subcategories").then((res) => {
            setData(res);
            navigate("/subcategories");
          });
        });
        resolve();
      } catch (error) {
        reject();
      }
    });

    toast.promise(deleteCategoryPromise, {
      loading: "Sub-Category is being deleted..",
      success: "Sub-Category deleted Successfully",
      error: "Error..Sub-Category Not edited",
    });
  };

  const handlePaginationChange = (e, value) => {
    fetchDataFromApi(`/api/subcategories?page=${value}`).then((res) => {
      setData(res);
    });
  };
  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };
  const handleEditCategory = async (e) => {
    e.preventDefault();
    const editCategoryPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await modifyData(
          `/api/subcategories/${editId}`,
          editSubCategoryFormFields
        );
        if (response.success) {
          setEditSubCategoryFormFields({
            category: "",
            subcategory: "",
          });
          setCategory("");
          const refetchData = await fetchDataFromApi("/api/subcategories");
          setData(refetchData);
          resolve();
          navigate("/subcategories");
          window.location.reload();
        } else {
          reject(new Error(response.error || "An error has occured"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(editCategoryPromise, {
      loading: "Sub-Category is being edited...",
      success: "Sub-Category edited successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  useEffect(() => {
    const fetchSubCategoryData = async () => {
      try {
        const resp = await fetchDataFromApi("/api/subcategories");
        setData(resp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubCategoryData();
  }, []);

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            SUBCATEGORY LIST
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
            <StyledBreadCrumb label="subcategories" />
            <StyledBreadCrumb
              component="a"
              href="/subcategories/add"
              label="Upload SubCategory"
              sx={{
                cursor: "pointer",
                background: "blue",
                color: "white",
              }}
            />
          </Breadcrumbs>
        </div>
        <div className="card shadow border-0 p-3 mt-4 adminTableFilter">
          <Typography
            variant="h5"
            fontWeight={600}
            textTransform={"capitalize"}
            gutterBottom
          >
            All SUBCATEGORIES
          </Typography>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th>category Image</th>
                  <th>Category</th>
                  <th>SubCategory</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.subCategoryList?.length !== 0 &&
                  data?.subCategoryList?.map((subCategory, index) => (
                    <tr key={subCategory._id}>
                      <td>#{index}</td>
                      <td>
                        <div className="d-flex">
                          <div className="imgWrapper">
                            <div className="img">
                              {subCategory?.category?.images.map((img) => (
                                <img
                                  key={img}
                                  src={img}
                                  alt=""
                                  width="50px"
                                  height="50px"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {subCategory?.category?.name}
                      </td>

                      <td
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {subCategory?.subcategory}
                      </td>

                      <td className="">
                        <div className="actions d-flex align-items-center">
                          <IconButton
                            onClick={() =>
                              handleSubCategoryEdit(subCategory._id)
                            }
                          >
                            <EditIcon
                              color="success"
                              sx={{ fontSize: "20px" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleSubCategoryDelete(subCategory._id)
                            }
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
            <div className="d-flex tableFooter">
              <Typography marginBottom={0}>
                Showing <b>{data?.subCategoryList?.length}</b> out of{" "}
                <b>{data?.totalPosts}</b> results
              </Typography>
              <Pagination
                count={data?.totalPages}
                showFirstButton
                showLastButton
                color="primary"
                className="pagination"
                onChange={handlePaginationChange}
              />
            </div>
            {data?.subCategoryList?.length === 0 && (
              <div className="d-flex align-items-center justify-content-center ">
                <img src={nodata} alt="holderimage" />
              </div>
            )}
          </div>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: themeMode === false ? "#2c4477" : "",
            },
          }}
        >
          <DialogTitle>Edit SUB-Category:</DialogTitle>
          <DialogContent>
            <form onSubmit={handleEditCategory}>
              <div className="formClass ">
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
                      name="category"
                      size="small"
                      label="Category"
                      sx={{ background: "white", borderRadius: "5px" }}
                      onChange={handleCategoryChange}
                      required
                    >
                      {data?.subCategoryList?.length !== 0 &&
                        data?.subCategoryList?.map((subcategory) => (
                          <MenuItem
                            key={subcategory._id}
                            value={subcategory?.category?._id}
                          >
                            {subcategory?.category?.name}
                          </MenuItem>
                        ))}

                      {data?.subCategoryList?.length === 0 && (
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
                    name="subCategory"
                    value={editSubCategoryFormFields?.subcategory}
                    onChange={handleSubCategoryChange}
                  />
                </div>
              </div>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={handleClose} autoFocus>
                  Edit
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SubCategoriesListPage;
