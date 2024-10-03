import React, { useEffect, useState } from "react";
import {
  Typography,
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Dialog,
  DialogTitle,
  Rating,
  Button,
  IconButton,
} from "@mui/material";
import { QuantityBox } from "../../components";
import HomeIcon from "@mui/icons-material/Home";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
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

const OrdersPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [viewProductData, setViewProductData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClickOpen = async (id) => {
    setOpen(true);
    if (id) {
      const response = await fetchDataFromApi(`/api/orders?orderId=${id}`);
      setViewProductData(response);
    }
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleMinus = () => {};

  const handlePlus = () => {};

  const handleDeleteOrder = (id) => {
    const deleteOrderPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await deleteData(`/api/orders/${id}`);
        if (response.success) {
          const fetchOrders = await fetchDataFromApi(`/api/orders`);
          setOrderData(fetchOrders);
          resolve();
        } else {
          reject(new Error(response.error || "An error occured"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });

    toast.promise(deleteOrderPromise, {
      loading: "Order is being deleted..",
      success: "Order deleted Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromApi(`/api/orders`);
        setOrderData(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Orders List
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadCrumb
              component="a"
              href="/"
              label="Home"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadCrumb label="Orders" />
          </Breadcrumbs>
        </div>

        <div className="card shadow border-0 p-3 mt-4 adminTableFilter">
          <Typography
            variant="h5"
            fontWeight={600}
            textTransform={"capitalize"}
            gutterBottom
          >
            All Orders
          </Typography>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Order Id</th>
                  <th> Products</th>
                  <th>userId</th>
                  <th>Payment Status</th>
                  <th>Date Ordered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderData &&
                  orderData?.orderList?.length !== 0 &&
                  orderData?.orderList?.map((item) => (
                    <tr key={item?._id}>
                      <td>{item?.orderId}</td>
                      <td>
                        <Button
                          variant="contained"
                          onClick={() => handleClickOpen(item?.orderId)}
                        >
                          View
                        </Button>
                      </td>

                      <td>{item?.userId}</td>
                      <td>
                        <span className="badge-secondary p-1 text-success font-weight-bold">
                          Paid
                        </span>
                      </td>
                      <td className="w-100">
                        {format(new Date(item?.createdAt), "PPpp")}
                      </td>
                      <td>
                        <IconButton
                          onClick={() => handleDeleteOrder(item?._id)}
                        >
                          <DeleteIcon color="error" sx={{ fontSize: "20px" }} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Orders</DialogTitle>
          <div className="adminTableFilter">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Product</th>
                    <th> Price</th>
                    <th style={{ textAlign: "center" }}>Quantity</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {viewProductData?.orderList &&
                    viewProductData?.orderList.length !== 0 &&
                    viewProductData?.orderList?.map((order) =>
                      order?.products?.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div className="cartItem d-flex align-items-center ">
                              <div className="imgWrapper">
                                <img
                                  src={item?.images[0]}
                                  alt={item?.productName}
                                  width={"50px"}
                                  height={"50px"}
                                />
                              </div>
                              <div className="info">
                                <Typography
                                  variant="subtitle1"
                                  className="productName"
                                >
                                  {item?.productName.slice(0, 11)}...
                                </Typography>
                                <Rating
                                  value={parseInt(item?.rating ?? 0)}
                                  readOnly
                                  size="small"
                                />
                              </div>
                            </div>
                          </td>
                          <td>${item?.price}</td>
                          <td>
                            <QuantityBox
                              quantityNumber={item?.quantity}
                              minusFunc={handleMinus}
                              plusFunc={handlePlus}
                            />
                          </td>
                          <td>{item?.productSize}</td>
                          <td>{item?.productColor}</td>
                          <td>${item?.subtotal}</td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default OrdersPage;
