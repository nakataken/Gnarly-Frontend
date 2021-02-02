import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';


export default function OrderScreen(props) {
  const orderId = props.match.params.id;
 
  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;


  const dispatch = useDispatch();
  useEffect(() => {
    const addPayPalScript = async () => {
        const { data } = await Axios.get('/api/config/paypal');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
      if (
        !order ||
        successPay ||
        successDeliver ||
        (order && order._id !== orderId)
      ) {
        dispatch({ type: ORDER_PAY_RESET });
        dispatch({ type: ORDER_DELIVER_RESET });
        dispatch(detailsOrder(orderId));
      } else {
        if (!order.isPaid) {
          if (!window.paypal) {
            addPayPalScript();
          } else {
            setSdkReady(true);
          }
        }
      }
    }, [dispatch, orderId, sdkReady, successPay, successDeliver, order]);

  
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order, paymentResult));
    };
    const deliverHandler = () => {
      dispatch(deliverOrder(order._id));
    };
  
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>Order {order._id}</h1>
      <div className="row-css top-css">
        <div className="col-2-css">
          <ul>
            <li>
              <div className="row-css border cart-text">
              <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="row-css border cart-text">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="row-css border cart-text">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row-css">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30-css">
                          <Link className="uppercase" to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x ₱{item.price} = ₱{item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1-css">
          <div className="card-css card-body-css">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row-css">
                  <div>Items</div>
                  <div>₱{order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row-css">
                  <div>Shipping</div>
                  <div>₱{order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row-css">
                  <div>Tax</div>
                  <div>₱{order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row-css">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>₱{order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>

              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}

                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </>
                  )}
                </li>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  {errorDeliver && (
                    <MessageBox variant="danger">{errorDeliver}</MessageBox>
                  )}
                  <button
                    type="button"
                    className="primary block"
                    onClick={deliverHandler}
                  >
                    Deliver Order
                  </button>
                </li>
              )}

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}