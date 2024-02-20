import React from 'react';
import "./ImageCard.css";

const ImageCard = ({ image, caption }) => {

    console.debug("ImageCard:", image);
    return (
       <div className='ImageCard card-body'>
        <img src={image} alt='Trip image' />
        <h4> {caption} </h4>
       </div>
    );

};

export default ImageCard;