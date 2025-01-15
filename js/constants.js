// Host
const HOST_AUTHORIZATION = 'http://localhost:8083';
const HOST_PRODUCTS = 'http://localhost:8086';
const HOST_ORDERS = 'http://localhost:8084';

// Authorizations
const API_LOGIN = HOST_AUTHORIZATION + '/auth/signin';
const API_SIGNUP = HOST_AUTHORIZATION + '/auth/signup';
const API_PROFILE = HOST_AUTHORIZATION + '/users/profile';

// Products
const API_CATEGORIES = HOST_PRODUCTS + '/categories';

const API_PRODUCTS = HOST_PRODUCTS + '/products';
const API_PRODUCTS_DETAIL = (productId) => `${HOST_PRODUCTS}/products/${productId}`;
const API_PRODUCTS_SEACH_AND_FILTER = HOST_PRODUCTS + '/products/search-and-filter';
const API_PRODUCTS_MY_STORE_SEACH_AND_FILTER = HOST_PRODUCTS + '/products/my-store/search-and-filter';

// Reviews
const API_REVIEWS = HOST_PRODUCTS + '/reviews';
const API_REVIEW_DETAIL = (productId) => `${HOST_PRODUCTS}/reviews/${productId}`;

// Carts
const API_CART = (productId) => `${HOST_ORDERS}/cart/${productId}`;
const API_DELETE_CART_ITEM = (cartItemId) => `${HOST_ORDERS}/cart/${cartItemId}`;
const API_CART_DETAIL = HOST_ORDERS + '/cart';
const API_TOTAL_ITEM_OF_CART = HOST_ORDERS + '/cart/total-item';

// Purchase Order
const API_PURCHASE_ORDER = HOST_ORDERS + '/purchase-order';
