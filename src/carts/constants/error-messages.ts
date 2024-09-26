export const cartErrorCodes = {
  ERROR_INVALID_FORMAT: 'Invalid cart id format.',
  ERROR_NOT_FOUND: 'Cart(s) not found.',
  ERROR_NOT_FOUND_PRODUCT: 'Product(s) not found in cart.',
  ERROR_NOT_STOCK: 'Product(s) out of stock.',
  ERROR_STOCK_CONFLICT: 'Product(s) quantity request should be less than one stored in product cart.',
  ERROR_MIN_QUANTITY: 'Product(s) quantity request should be greater than zero.',
  ERROR_UNEXPECTED: 'Unexpected error.',
  ERROR_CONFLICT: 'Cart already exists.',
};
