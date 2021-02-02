import React from 'react';
import { Link } from 'react-router-dom';
// import Rating from './Rating';
import gif from '../images/hover-fudge.gif';
// import sfx from '../sfx/running.mp3';

export default function Product(props){
    const {product}=props
    return(
        <div key={product._id} className="card-css product">
            <Link to={`/product/${product._id}`}>
                <img className="gif" src={gif} alt="gif"></img>  
                    <img  className="medium" src={product.image} alt={product.name}/>
                <div className="card-body-css">
                        <h2 className="left">{product.name}</h2>
                        <h2 className="right price">₱{product.price}</h2>
                {/* <Rating
                    rating= {product.rating}
                    numReview={product.numReview}> 
                </Rating> */}
                </div>
            </Link>
        </div>
    )
}
