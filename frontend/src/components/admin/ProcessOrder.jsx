import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from '../layout/AdminLayout'
import { useOrderDetailsQuery, useUpdateOrderStatusMutation } from "../../redux/api/orderApi";

const ProcessOrder = () => {

  const params = useParams()
  const [ status, setStatus] = useState("Processing")

  const [updateOrderStatus, {error: updateError, isLoading: isUpdateLoading, isSuccess}] = useUpdateOrderStatusMutation()
  const { data, error, isLoading } = useOrderDetailsQuery(params.id)

  const order = data?.order || {};

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    paymentMethod,
    user,
    totalAmount,
    orderStatus,
  } = order;

  const isPaid = paymentInfo?.status === "paid" ? true : false;

  const updateStatusHandler = (id) => {
    const statusData = {status}
    updateOrderStatus({id, body: statusData})
  }

  useEffect(() => {
    if(orderStatus){
      setStatus(orderStatus)
    }
  },[orderStatus])

  useEffect(() => {
    if (isSuccess) {
      toast.success("Order updated successfully");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (updateError) {
      toast.error(updateError?.data?.message);
    }
  }, [error, updateError, isSuccess]);

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"Process Order"} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-8 order-details">
          <h3 className="mt-5 mb-4">Order Details</h3>

          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{order?._id}</td>
              </tr>
              <tr>
                <th scope="row">Order Status</th>
                <td
                  className={
                    String(orderStatus).includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  {orderStatus}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Shipping Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th scope="row">Phone No</th>
                <td>{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>
                  {shippingInfo?.address}, {shippingInfo?.city},{" "}
                  {shippingInfo?.zipCode}, {shippingInfo?.country}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Payment Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Status</th>
                <td className={isPaid ? "greenColor" : "redColor"}>
                  {paymentInfo?.status}
                </td>
              </tr>
              <tr>
                <th scope="row">Method</th>
                <td>{paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">Stripe ID</th>
                <td>{paymentInfo?.id || "Nill"}</td>
              </tr>
              <tr>
                <th scope="row">Amount</th>
                <td>${totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 my-4">Order Items:</h3>

          <hr />
          {
            orderItems.map((item) => (
              <div key={item?._id} className="cart-item my-1">
                <div className="row my-5">
                  <div className="col-4 col-lg-2">
                    <img
                      src={item?.image ? item?.image : "../images//default_product.png"}
                      alt=""
                      height="45"
                      width="65"
                    />
                  </div>
                  <div className="col-5 col-lg-5">
                    <Link to={`/product/${item?.product}`}>{item?.name}</Link>
                  </div>
                  <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                    <p>${item?.price}</p>
                  </div>
                  <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                    <p>{item?.quantity} Piece(s)</p>
                  </div>
                </div>
              </div>
            ))
          }
          <hr />
        </div>

        <div className="col-12 col-lg-3 mt-5">
          <h4 className="my-4">Status</h4>

          <div className="mb-3">
            <select className="form-select" name="status" value={status} onChange={(e)=> setStatus(e.target.value)}>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <button className="btn btn-primary w-100" onClick={()=>updateStatusHandler(order?._id)} disabled={isUpdateLoading}>Update Status</button>

          {/* <h4 className="mt-5 mb-3">Order Invoice</h4>
          <a href="#" className="btn btn-success w-100">
            <i className="fa fa-print"></i> Generate Invoice
          </a> */}
        </div>
      </div>
    </AdminLayout>
  )
}

export default ProcessOrder