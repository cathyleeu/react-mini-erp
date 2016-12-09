import { combineReducers } from 'redux'
import { RECEIVE_PRODUCTS, ADD_TO_CART, FETCH_BOOKS } from '../actions/types'

const products = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        //books data 그대로 전달
        quantity: state.quantity - 1
        //카트에 추가될 때 수량은 하나씩 감소
      }
    default:
      return state
  }
}

// const byId = (state = {}, action) => {
//   switch (action.type) {
//     case FETCH_BOOKS:
//     //상품을 받았을 때,
//       return {
//         // books data를 전달
//         ...state,
//         ...action.books.reduce((obj, book) => {
//           obj[book.id] = book
//           return obj
//         }, {})
//       }
//
//     default:
//       const { productId } = action
//       if (productId) {
//         return {
//           ...state,
//           [productId]: product(state[productId], action)
//         }
//       }
//       return state
//   }
// }
//
// const visibleIds = (state = [], action) => {
//   switch (action.type) {
//     case RECEIVE_PRODUCTS:
//       return action.products.map(product => product.id)
//     default:
//       return state
//   }
// }
//
// export default combineReducers({
//   byId,
//   visibleIds
// })
//
export const getProduct = (state, id) =>
  state[id]
//
// export const getVisibleProducts = state =>
//   state.visibleIds.map(id => getProduct(state, id))