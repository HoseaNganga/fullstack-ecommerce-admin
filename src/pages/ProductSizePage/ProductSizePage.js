import React, { useContext, useEffect, useState } from "react";
import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteData,
  fetchDataFromApi,
  modifyData,
  postData,
} from "../../utils/api";
import toast from "react-hot-toast";
import DataContext from "../../DataContext/DataContext";
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

    "&:hover ,&:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ProductSizePage = () => {
  const { themeMode } = useContext(DataContext);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [editId, setEditId] = useState(null);
  const [productsizeField, setProductSizeField] = useState({
    productsize: "",
  });
  const [productsizeFieldedit, setProductSizeFieldEdit] = useState({
    productsize: "",
  });

  const [productSizeData, setProductSizeData] = useState([]);

  const changeInputFields = (e) => {
    setProductSizeField(() => ({
      ...productsizeField,
      [e.target.name]: e.target.value,
    }));
  };
  const handleProductSizeChange = (e) => {
    setProductSizeFieldEdit(() => ({
      ...productsizeFieldedit,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProductSizeAdd = (e) => {
    e.preventDefault();
    const addProductSizePromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData(
          `/api/productsize/create`,
          productsizeField
        );
        if (response.success) {
          setProductSizeField({
            productsize: "",
          });
          resolve();
          window.location.reload();
        } else {
          reject(new Error(response.error || "An error has occured"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(addProductSizePromise, {
      loading: "ProductSize is being Created..",
      success: "ProductSize Created Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  const handleProductSizeEdit = async (id) => {
    setOpen(true);
    setEditId(id);
    const response = await fetchDataFromApi(`/api/productsize/${id}`);
    console.log(response);
    setProductSizeFieldEdit({
      productsize: response?.productSizeItem?.productsize,
    });
  };

  const handleEditProductSize = async (e) => {
    e.preventDefault();
    const editProductSizePromise = new Promise(async (resolve, reject) => {
      try {
        const response = await modifyData(
          `/api/productsize/${editId}`,
          productsizeFieldedit
        );

        if (response.success) {
          setOpen(false);
          setProductSizeFieldEdit({
            productsize: "",
          });
          resolve();
          window.location.reload();
        } else {
          reject(new Error(response.error || "An error has occured"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(editProductSizePromise, {
      loading: "Product Size is being edited...",
      success: "Product Size edited successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  const handleProductSizeDelete = (id) => {
    const deleteProductSizePromise = new Promise(async (resolve, reject) => {
      try {
        const response = await deleteData(`/api/productsize/${id}`);
        if (response.success) {
          const refetchData = await fetchDataFromApi(`/api/productsize`);
          setProductSizeData(refetchData);
          resolve();
          window.location.reload();
        } else {
          reject(new Error(response.error || "An error has occured"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });

    toast.promise(deleteProductSizePromise, {
      loading: "Product Size is being deleted..",
      success: "Product Size deleted Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchProductSizeData = await fetchDataFromApi("/api/productsize");
        setProductSizeData(fetchProductSizeData);
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Product Size Upload
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="Product Size Upload" />
          </Breadcrumbs>
        </div>
        <form className="row" onSubmit={handleProductSizeAdd}>
          <div className="col">
            <div className="card p-4">
              <div className="formClass">
                <div className="form-group mt-4">
                  <TextField
                    type="text"
                    label="Product Size"
                    name="productsize"
                    placeholder="Product Size"
                    className="w-100"
                    onChange={changeInputFields}
                    value={productsizeField?.productsize}
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
        <div className="card shadow border-0 p-3 mt-4 adminTableFilter">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th>Product Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {productSizeData &&
                  productSizeData?.productSizeList?.length !== 0 &&
                  productSizeData?.productSizeList?.map((size) => (
                    <tr key={size?._id}>
                      <td>#</td>
                      <td
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {size?.productsize}
                      </td>

                      <td className="">
                        <div className="actions d-flex align-items-center">
                          <IconButton
                            onClick={() => handleProductSizeEdit(size?._id)}
                          >
                            <EditIcon
                              color="success"
                              sx={{ fontSize: "20px" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => handleProductSizeDelete(size?._id)}
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
            {productSizeData?.productSizeList?.length === 0 && (
              <div className="d-flex align-items-center justify-content-center">
                <img src={nodata} alt="noData" />
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
            <form onSubmit={handleEditProductSize}>
              <div className="formClass ">
                <div className="form-group mt-4">
                  <TextField
                    type="text"
                    label="Product Size"
                    name="productsize"
                    placeholder="Product Size"
                    className="w-100"
                    onChange={handleProductSizeChange}
                    value={productsizeFieldedit?.productsize}
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

export default ProductSizePage;
