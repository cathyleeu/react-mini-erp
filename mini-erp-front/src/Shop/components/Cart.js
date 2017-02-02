import React, {Component} from 'react'
import AddedProducts from './AddedProducts'
import Invoice from './Invoice'
import './Cart.css'


class Cart extends Component {
  componentWillMount(){
    const {getInvoices} = this.props
    getInvoices()
  }
  render(){
    const {books, selected, goodsSelect, goodsDelete, requestInvoice,user, kinderAddr} = this.props
    const nodes = books.map((book, index) =>
          <AddedProducts
            key={index}
            title={book.title}
            price={book.price}
            id={book.id}
            goodsSelect={goodsSelect}
            goodsDelete={goodsDelete}
          />
        )
    const total = selected.reduce((sum, each) => (sum + each.price * each.amount), 0);
    const emptyCart = (
      <div className="Empty-Container">
        <p className="Empty-alert"> 상품을 선택해 주세요.</p>
      </div>
    )
    const selectedCart = (
      <div>
        <h4 className="Cart-Title">주문서</h4>
        <Invoice
          kinderAddr={kinderAddr}
          nodes={nodes}
          total={total}
          requestInvoice={requestInvoice}
          user={user}
          selected={selected} />
      </div>
    )
    return(
      <div className="Container">
        { nodes.length === 0 ? emptyCart : selectedCart }
      </div>
    )
  }
}

export default Cart
