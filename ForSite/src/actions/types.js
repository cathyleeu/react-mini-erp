// user 인증
export const AUTH_USER = 'AUTH_USER'
export const UNAUTH_USER = 'UNAUTH_USER'
export const AUTH_ERROR = 'AUTH_ERROR'
export const STATUS_ON_LOGIN = 'STATUS_ON_LOGIN'

// For Cart
export const ADD_TO_CART = 'ADD_TO_CART'
export const SELECTED_GOODS = 'SELECTED_GOODS'
export const DELETE_GOODS = 'DELETE_GOODS'


export const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST'
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS'
export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE'


// Fetch Goods
export const START_BOOKS_FETCH = 'START_BOOKS_FETCH'
export const COMPLETE_BOOKS_FETCH = 'COMPLETE_BOOKS_FETCH'


export const INITIAL_KINDER = 'INITIAL_KINDER'  //처음 시작할 때 DB의 kinder불러옴


// 지사 유치원 관리
export const CREATE_KINDER = 'CREATE_KINDER'    // create kinder Id
export const ADD_KINDER = 'ADD_KINDER'
export const UPDATE_KINDER = 'UPDATE_KINDER'
export const DELETE_KINDER = 'DELETE_KINDER'

// 지사 유치원의 반 관리
export const CREATE_KINDER_CLASS = 'CREATE_KINDER_CLASS'
export const ADD_CLASS = 'ADD_CLASS'
export const UPDATE_KINDER_CLASS = 'UPDATE_KINDER_CLASS'
export const DELETE_KINDER_CLASS = 'DELETE_KINDER_CLASS'



//유치원 DB로 전달할 때
export const COMPLETE_ADD_KINDER = 'COMPLETE_ADD_KINDER'


//주문서
export const START_INVOICES_FETCH = 'START_INVOICES_FETCH'
export const COMPLETE_INVOICES_FETCH = 'COMPLETE_INVOICES_FETCH'
