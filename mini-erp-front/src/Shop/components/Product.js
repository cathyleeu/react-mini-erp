import React from 'react'

const Product = ({ price, title, img, className }) => (
  <div className={className}>
    <img src={img} role="presentation"/>
    <p>{title} - {price}원</p>
  </div>
)

export default Product
