import React, {useEffect} from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import {listProducts} from '../actions/productActions';
// import slider1 from '../images/slider-1.png';
import image from '../images/slider-2.jpg';
// import slider3 from '../images/slider-3.jpg';
// import slider4 from '../images/slider-4.jpg';
// import slider5 from '../images/slider-5.jpg';

export default function HomeScreen(){
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;

    useEffect(() => {
        dispatch(listProducts({}));
    }, [dispatch]);

    return(
        <div>
            <div className="row-css center-css">
                <img src={image} className="responsive-img" alt="img"></img>
            </div>
        {loading ? (<LoadingBox></LoadingBox>)
        : error ? (<MessageBox variant = "danger">{error}</MessageBox>)
        :   (
            <div className="row-css center-css">
            {products.map((product) => (
                <Product key={product._id} product={product}></Product>
            ))}
            </div>
            )
        }
        </div>  
    );
}
