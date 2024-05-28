export const enum SUCCESSFUL_RESPONSE {
  status = 200,
  message = 'Operation Successful',
}
export const enum INTERNAL_SERVER_ERROR_RESPONSE {
  status = 500,
  message = 'Internal Server Error',
}
export const enum OPERATION_FAILED_RESPONSE {
  status = 500,
  message = 'Operation Failed',
}

export const enum BAD_REQUEST_RESPONSE {
  status = 400,
  message = 'Bad Request',
}

export const enum OPERATION_NOT_ALLOWED_RESPONSE {
  status = 400,
  message = 'Your not allow to perform this action',
}

export const enum NOT_FOUND_RESPONSE {
  status = 404,
  message = 'Record Not Found',
}

export const enum USER_NOT_FOUND_RESPONSE {
  status = 404,
  message = 'User Not Found',
}

export const enum ACCOUNT_ALREADY_VERIFIED {
  status = 200,
  message = 'Account is already verified.',
}

export const enum UNAUTHORIZED_RESPONSE {
  status = 401,
  message = 'Unauthorized',
}

export const enum FORBIDDEN_RESPONSE {
  status = 403,
  message = 'Access Forbidden',
}

export const enum CREATION_RESPONSE {
  status = 201,
  message = 'Resource Created',
}

export const enum ALREADY_EXIST_RESPONSE {
  status = 409,
  message = 'Record Already Exist',
}

export const enum EMAIL_ALREADY_EXIST_RESPONSE {
  status = 409,
  message = 'Email Already Exist',
}

export const enum UNPROCESSABLE_RESPONSE {
  status = 422,
  message = 'Cannot Be Processed',
}

export const enum DELETE_RECORD_RESPONSE {
  status = 200,
  message = 'Record Deleted Successfully',
}

export const enum AGREEMENT_NOT_FOUND_RESPONSE {
  status = 404,
  message = 'No agreement found.',
}

export const enum INVALID_TOKEN_RESPONSE {
  status = 498,
  message = 'Invalid token',
}

export const enum INVALID_OTP {
  status = 400,
  message = 'Invalid OTP entered.',
}
export const enum EXPIRY_TIME_HAS_PASSED {
  status = 400,
  message = 'Expiry time has passed',
}
export const enum RECORD_NOT_UPDATED_RESPONSE {
  status = 304,
  message = 'Record not modified',
}
export const enum ACCOUNT_VERIFIED {
  status = 200,
  message = 'Account verified successfully',
}
export const enum UNABLE_TO_CREATE_PRODUCT {
  status = 400,
  message = 'Unable to create product.'
}
export const enum CREATE_CATEGORY {
  status = 200,
  message = 'Category created successfully.'
}
export const enum CATEGORY_ERROR {
  status = 400,
  message = 'Please select a category'
}
export const enum UNABLE_TO_CREATE_CATEGORY {
  status = 400,
  message = 'Unable to create product.'
}
export const enum UNABLE_TO_GET_CATEGORY {
  status = 400,
  message = 'Unable to get categories.'
}
// 
export const enum PRODUCT_NOT_FOUND {
  status = 404,
  message = 'Product not found.'
}