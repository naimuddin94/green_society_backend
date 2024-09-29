const message = {
  unauthorized: 'You are not authorized!',
  email_exists: 'Email already exists!',

  // auth related
  login: 'Login Successfully',
  logout: 'Logout Successfully',
  password_not_match: 'Password not match',
  password_changed: 'Password changed successfully',
  invalid_credentials: 'Invalid credentials',

  // user related
  user_created: 'Account register successfully',
  user_creating_error: 'Something went wrong while creating the user',
  user_update: 'Your profile update successfully',
  user_updating_error:
    'Something went wrong while updating the user information',
  user_not_exist: 'User not exists',
  user_delete: 'User deleted successfully',
  user_blocked: 'User blocked successfully',

  // product related
  product_created: 'Product created successfully',
  product_creating_error:
    'Something went wrong while save product in the database',
  product_updated: 'Product update successfully',
  product_updating_error:
    'Something went wrong while updating the product info',
  product_delete: 'Product delete successfully',

  // cart related
  cart_created: 'Thank you for your order',
  cart_creating_error: 'Something went wrong while save cart information',
  cart_updated: 'Cart update successfully',
  cart_updating_error:
    'Something went wrong while updating the cart information',
  cart_delete: 'Cart delete successfully',
} as const;

export default message;
