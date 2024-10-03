import {
  emphasize,
  styled,
  Breadcrumbs,
  Chip,
  Typography,
  IconButton,
  Button,
  Rating,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import React, { useContext, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import CategoryIcon from "@mui/icons-material/Category";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import TagIcon from "@mui/icons-material/Tag";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import DataContext from "../../DataContext/DataContext";
import ReplyIcon from "@mui/icons-material/Reply";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { format } from "date-fns";

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

const ProductDetailsPage = () => {
  const { id } = useParams();
  const zoomSliderBig = useRef(null);
  const [productData, setProductData] = useState({});
  const [reviewData, setReviewData] = useState([]);
  const zoomSlider = useRef(null);
  const { themeMode } = useContext(DataContext);
  const productSliderOptions = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const productSlider2Options = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };
  const goto = (index) => {
    zoomSlider.current.slickGoTo(index);
    zoomSliderBig.current.slickGoTo(index);
  };
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetchDataFromApi(`/api/products/${id}`);
        setProductData(response?.productItem);

        const reviewResponse = await fetchDataFromApi(
          `/api/reviews?productId=${id}`
        );
        setReviewData(reviewResponse);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductData();
  }, [id]);

  return (
    <>
      <div className="rightContent w-100">
        <div className="card shadow border-0 w-100 flex row p-4  ">
          <Typography variant="h5" className="mb-0" fontWeight={600}>
            Product View
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
            <StyledBreadCrumb label="Product View" />
          </Breadcrumbs>
        </div>
        {productData && Object.keys(productData).length !== 0 && (
          <>
            <div className="card productDetailSection">
              <div className="row">
                <div className="col-md-5 mb-4 p-3 ">
                  {productData &&
                    productData?.images &&
                    productData?.images?.length !== 0 && (
                      <div className="sliderWrapper p-4" key={productData?._id}>
                        <Typography variant="h6" fontWeight={530} gutterBottom>
                          Product Gallery
                        </Typography>
                        <Slider
                          {...productSliderOptions}
                          className={`sliderBig ${
                            themeMode ? "sliderBigStyle" : ""
                          }`}
                          ref={zoomSliderBig}
                        >
                          {productData &&
                            productData?.images &&
                            productData?.images?.length !== 0 &&
                            productData?.images?.map((image, index) => (
                              <div
                                key={index}
                                className={`item ${
                                  themeMode ? "sliderSmallItemStyle" : ""
                                }`}
                              >
                                <img
                                  src={image}
                                  alt=""
                                  className="w-100"
                                  onClick={() => goto(index)}
                                />
                              </div>
                            ))}
                        </Slider>

                        <Slider
                          {...productSlider2Options}
                          ref={zoomSlider}
                          className="sliderSmall"
                        >
                          {productData &&
                            productData?.images &&
                            productData?.images?.length !== 0 &&
                            productData?.images?.map((image, index) => (
                              <div
                                key={index}
                                className={`item ${
                                  themeMode ? "sliderSmallItemStyle" : ""
                                }`}
                              >
                                <img
                                  src={image}
                                  alt=""
                                  className="w-100"
                                  onClick={() => goto(index)}
                                />
                              </div>
                            ))}
                        </Slider>
                      </div>
                    )}
                </div>
                <div className="col-md-7 p-3 mb-4">
                  <div className="p-4">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Product Details
                    </Typography>
                    {productData && Object.keys(productData).length !== 0 && (
                      <>
                        <Typography variant="h6" gutterBottom>
                          {productData?.name}
                        </Typography>
                        <div className="productInfo">
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <BrandingWatermarkIcon
                                  sx={{ fontSize: "20px" }}
                                />
                              </IconButton>
                              <Typography variant="subtitle2">Brand</Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              <Typography variant="subtitle2" fontWeight={600}>
                                : {productData?.brand}
                              </Typography>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <CategoryIcon sx={{ fontSize: "20px" }} />
                              </IconButton>
                              <Typography variant="subtitle2">
                                Category
                              </Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              <Typography variant="subtitle2" fontWeight={600}>
                                : {productData?.catName}
                              </Typography>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <TagIcon sx={{ fontSize: "20px" }} />
                              </IconButton>
                              <Typography variant="subtitle2">
                                Sub-Category
                              </Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              :
                              <span>
                                <ul className="list list-inline btags">
                                  <li className="list-inline-item">
                                    <span>
                                      {productData?.subcategory?.subcategory}
                                    </span>
                                  </li>
                                </ul>
                              </span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <ColorLensIcon sx={{ fontSize: "20px" }} />
                              </IconButton>
                              <Typography variant="subtitle2">Color</Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              :
                              <span>
                                <ul className="list list-inline btags">
                                  {productData?.color &&
                                    productData?.color?.map((color, index) => (
                                      <li
                                        className="list-inline-item"
                                        key={index}
                                      >
                                        <span>{color}</span>
                                      </li>
                                    ))}
                                </ul>
                              </span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <AspectRatioIcon sx={{ fontSize: "20px" }} />
                              </IconButton>
                              <Typography variant="subtitle2">Size</Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              :
                              <span>
                                <ul className="list list-inline btags">
                                  {productData?.productsize &&
                                    productData?.productsize?.map(
                                      (size, index) => (
                                        <li
                                          className="list-inline-item"
                                          key={size?._id}
                                        >
                                          <span>{size?.productsize}</span>
                                        </li>
                                      )
                                    )}
                                </ul>
                              </span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <LocalOfferIcon sx={{ fontSize: "20px" }} />
                              </IconButton>
                              <Typography variant="subtitle2">Price</Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              :
                              <del className="oldPrice text-danger  ">
                                ${productData?.oldprice}
                              </del>
                              <span className="newPrice text-success bold ml-3">
                                ${productData?.newprice}
                              </span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <ShoppingCartIcon sx={{ fontSize: "20px" }} />
                              </IconButton>
                              <Typography variant="subtitle2">Stock</Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              :{" "}
                              <span> ({productData?.countInStock}) pieces</span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <StarIcon sx={{ fontSize: "20px" }} />
                              </IconButton>
                              <Typography variant="subtitle2">Price</Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              :<span>(03) Reviews</span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3 d-flex align-items-center">
                              <IconButton className="mr-1">
                                <PublishedWithChangesIcon
                                  sx={{ fontSize: "20px" }}
                                />
                              </IconButton>
                              <Typography variant="subtitle2">
                                Published
                              </Typography>
                            </div>
                            <div className="col-sm-7 d-flex align-items-center">
                              :
                              <span>
                                {productData?.updatedAt
                                  ? format(
                                      new Date(productData.updatedAt),
                                      "PPpp"
                                    )
                                  : "No date available"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <Typography
                  variant="h6"
                  className="mt-4"
                  fontWeight={600}
                  gutterBottom
                >
                  Product Description
                </Typography>
                <Typography>{productData?.description}</Typography>
              </div>
              <div className="ratingSection p-4">
                <Typography
                  variant="h6"
                  className="mt-4"
                  fontWeight={600}
                  gutterBottom
                >
                  Rating Analytics
                </Typography>
                <div className="ratingRow d-flex align-items-center">
                  <span className="col1">5 star</span>
                  <div className="col2">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="col3">(22)</span>
                </div>
                <div className="ratingRow d-flex align-items-center">
                  <span className="col1">4 star</span>
                  <div className="col2">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="col3">(22)</span>
                </div>
                <div className="ratingRow d-flex align-items-center">
                  <span className="col1">3 star</span>
                  <div className="col2">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="col3">(22)</span>
                </div>
                <div className="ratingRow d-flex align-items-center">
                  <span className="col1">2 star</span>
                  <div className="col2">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="col3">(22)</span>
                </div>
                <div className="ratingRow d-flex align-items-center">
                  <span className="col1">1 star</span>
                  <div className="col2">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="col3">(22)</span>
                </div>
              </div>
              <div className="reviewSection p-4">
                <Typography
                  variant="h6"
                  className="mt-4"
                  fontWeight={600}
                  gutterBottom
                >
                  Customer Review
                </Typography>
                {reviewData?.productReviews &&
                  reviewData?.productReviews?.length !== 0 &&
                  reviewData?.productReviews?.map((review) => (
                    <div className="reviewRow mt-4" key={review?._id}>
                      <div className="row">
                        <div className="col-sm-7 d-flex">
                          <div className="d-flex align-items-center flex-column">
                            <div className="userInfo d-flex align-items-center mb-3">
                              <div className="userImg">
                                <span
                                  className="rounded-circle"
                                  style={{
                                    color: "grey",
                                    border: "1px solid #233a95",
                                    width: "50px",
                                    height: "50px",
                                  }}
                                >
                                  {review ? review?.customerName.charAt(0) : ""}
                                </span>
                              </div>

                              <div className="info ml-2">
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {review?.customerName}
                                </Typography>
                                <Typography variant="body2">
                                  {format(new Date(review?.updatedAt), "PPpp")}
                                </Typography>
                              </div>
                            </div>
                            <Rating
                              readOnly
                              value={parseInt(review?.rating ?? 0)}
                            />
                          </div>
                        </div>
                        <div className="col-md-5 d-flex alifn-items-center">
                          <div className="ml-auto">
                            <Button
                              className="ml-auto"
                              variant="contained"
                              startIcon={<ReplyIcon />}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                        <Typography className="w-100 mt-3">
                          {review?.review}
                        </Typography>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetailsPage;
