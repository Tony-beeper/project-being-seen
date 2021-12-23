# Prerequisites

**USER TYPES**: donor, merchant, youth

# Frontend

### `/`: Homepage

**Description**: This is the root directory and homepage of our website. <br />
**Authorization**: All user types are authorized to view this page (including unregistered users). <br />
**Miscellaneous**:

- Users will be able to browse through profiles of homeless youths registered on the site.
- Serves as the base route that other routes will redirect unauthorized users to.

### `/login`: Login page

**Description**: This is the login page where all types of users will be able to login. <br />
**Authorization**: Only unregistered users are authorized to view this page (logged in users are redirected to `/`). <br />
**Miscellaneous**:

- Users will have access to a link to `/login` (in the header) if they are not logged in.
- `POST` requests are used in order to securely transfer credentials to the backend `/api/v1/user/login` endpoint.
- Error handling is done purely server side (for security) and toast notifications provide optimal user experience.

### `/signup`: Signup page

**Description**: This is the signup page where all types of users will be able to register. <br />
**Authorization**: Only unregistered users are authorized to view this page (logged in users are redirected to `/`). <br />
**Miscellaneous**:

- Users will have access to a link to `/signup` (in the header) if they are not logged in.
- `POST` requests are used in order to securely transfer details to the backend `/api/v1/user/:user_type/signup` endpoint.
- Error handling is done purely server side (for security) and toast notifications provide optimal user experience.
- Successful signup will redirect users to their default page (donors -> `/`, youths -> `/store`, merchants -> `/dashboard`).

### `/profile`: Profile page

**Description**: This is the profile page where all types of users will be able to edit details on their account. <br />
**Authorization**: All logged in users are authorized to view this page (unregistered users are redirected to `/`). <br />
**Miscellaneous**:

- Users will have access to a link to `/profile` (in the header) if they are logged in.
- Users will be able to edit their respective profile information (e.g., youths may modify their story, saving plan, etc.).
- Every user type will have a dynamically rendered page showing controls for their specific user type.
- `POST` requests (or `PATCH` is also appropriate) will be used to send data to the backend.

### `/dashboard`: Dashboard page

**Description**: This is the dashboard page where all types of users will be able to access details regarding their accounts. <br />
**Authorization**: All logged in users are authorized to view this page (unregistered users are redirected to `/`). <br />
**Miscellaneous**:

- Users will have access to a link to `/dashboard` (in the header) if they are logged in.
- Users will be able to see an overview of their entire account and history (e.g., youths view their donations, merchants view their store, etc.)
- Every user type will have a dynamically rendered page showing controls for their specific user type.

### `/store`: Store page

**Description**: This is the store page where users will be able to browse through products uploaded by merchants. <br />
**Authorization**: Only youth users are authorized to view this page (all other users are redirected to `/`). <br />
**Miscellaneous**:

- Youths will have access to a link to `/store` (in the header) if they are logged in as a youth.
- Youths will be able to browse offered goods and services from merchants (and categorize, filter, etc.).
- `GET` requests will be used to obtain the listings from the backend.

### `/upload`: Upload page

**Description**: This is the upload page where merchants will be able to upload their products. <br />
**Authorization**: Only merchant users are authorized to view this page (all other users are redirected to `/`). <br />
**Miscellaneous**:

- Merchants will have access to a link to `/profile` (in the header) if they are logged in - upon navigating to their profile, there is an "upload new product" button that will take them to the upload page.
- Merchants will be able to input product names, write a description, add price and a photo of the product.
- `POST` requests are used in order to securely transfer credentials to the backend `/api/v1/user/merchant/upload` endpoint.
- Error handling is done purely server side (for security) and toast notifications provide optimal user experience.
- Successful upload will redirect merchants to their profile.

### `/edit`: Edit page

**Description**: This is the edit page where merchants will be able to edit their products. <br />
**Authorization**: Only merchant users are authorized to view this page (all other users are redirected to `/`). <br />
**Miscellaneous**:

- Merchants will be able to access this page by clicking `Edit` on a product card from their `/dashboard` page.
- Details are filled in automatically and users can edit more details regarding that product.
- `POST` requests are used in order to securely transfer credentials to the backend `/api/v1/user/merchant/update` endpoint.
- Error handling is done purely server side (for security) and toast notifications provide optimal user experience.
- Successful delete will remove product from frontend and backend.

### `/u/:username`: User page

**Description**: This is the user page where you can view a page for a specific page where merchants will be able to upload their products. <br />
**Authorization**: No authorization required. <br />
**Miscellaneous**:

- Donors will have UI to donate to the teen if they are logged in.
- Non-donor user types will just be able to view details on user (no ability to donate).
- `POST` requests are used in order to securely transfer credentials to the backend `/api/v1/payment/donation/create` and `/api/v1/payment/donation/save` endpoint.
- Error handling is done purely server side (for security) and toast notifications provide optimal user experience.
- Successful payment will show a toast notifications.

# Backend

### `POST /api/v1/user/:user_type/signup`: Signup endpoint

**Description**: These are the signup endpoints where all users will be able to create an account. <br />
**Request Fields**: Each signup form has different fields for their specific signup process (error messages detail missing fields). <br />
**Responses**:

- `201`: user was successfully created and a JWT token is passed back (authorization is included as a `role` field within token).
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `500`: unknown internal server error.

### `POST /api/v1/user/login` : Login endpoint

**Description**: This is the login endpoint where all user types will be able to authenticate themselves. <br />
**Authentication**: Requests must pass their username and password as a JSON payload. <br />
**Responses**:

- `200`: user has correct credentials and a JWT token is passed back (authorization is included as a `role` field within token).
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `401`: user cannot be authenticated and an appropriate message is passed back to indicate the specific error.
- `500`: unknown internal server error.

### `GET /api/v1/user/validate`: Validate endpoint

**Description**: This is the validate endpoint where all user types can validate (in terms of expiration, format, etc.) their JWT token. <br />
**Authorization**: Requests must pass their JWT token as an `Authorization` header (bearer format is preferable). <br />
**Responses**:

- `200`: user has a valid token and an appropriate message is passed back.
- `401`: user has an invalid token and an appropriate message is passed back.
- `500`: unknown internal server error.

### `PATCH /api/v1/user/:user_type/update`: Update account information endpoint

**Description**: This is the update account information endpoint where all user types can update details regarding their account (e.g., youths can update their story, saving plan, etc.). <br />
**Authorization**: Requests must pass their JWT token as an `Authorization` header (bearer format is preferable). <br />
**Responses**:

- `200`: user has a valid token and an appropriate message is passed back.
- `401`: user has an invalid token and an appropriate message is passed back.
- `500`: unknown internal server error.

### `POST /api/v1/user/:user_type/private`: Private account information endpoint

**Description**: This is the private account information endpoint where all users can query for all private details regarding their account (this includes public information as well if applicable). <br />
**Authorization**: Requests must pass their JWT token as an `Authorization` header (bearer format is preferable). <br />
**Responses**:

- `200`: request was successful and a success message is sent back.
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `500`: unknown internal server error.

### `POST /api/v1/payment/donation/create`: Create donation endpoint

**Description**: This is the create donation endpoint which creates a donation (order) with PayPal and saves it server side (note, this does not execute payment). <br />
**Request Fields**: Requests must pass the youth username, donor username, and amount as a JSON payload. <br />
**Responses**:

- `201`: donation order was successfully created and an order ID is passed back to approve.
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `404`: youth account or donor account could not be found. (error sent as response)
- `500`: unknown internal server error.

### `POST /api/v1/payment/donation/save`: Save donation endpoint

**Description**: This is the save donation endpoint which saves a donation (if it is approved by PayPal). <br />
**Request Fields**: Requests must pass the order ID that was approved by PayPal and user. <br />
**Responses**:

- `200`: donation order was successfully processed and success message is sent back.
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `404`: order ID could not be found on server side (meaning it is invalid). (error sent as response)
- `500`: unknown internal server error.

### `PUT/DELETE /api/v1/user/donor/follow`: Put/delete follow relationship endpoint

**Description**: This is the put or delete follow relationship endpoint to follow or unfollow users. <br />
**Request Fields**: Requests must pass the name of the youth they want to follow or unfollow. <br />
**Authorization**: Requests must pass their JWT token as an `Authorization` header (bearer format is preferable). <br />
**Responses**:

- `200`: request was successful and a success message is sent back.
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `404`: youth account could not be found with given username. (error sent as response)
- `500`: unknown internal server error.

### `GET /api/v1/user/merchant/products`: Get products endpoint

**Description**: This is the get merchant products endpoint which passes back a single merchant's products or all products in DB. <br />
**Request Fields**: Request may pass a URL parameter denoting the merchant name they want product information for. <br />
**Responses**:

- `200`: request was successful and list of products is sent back (non-existing merchants get empty list).
- `500`: unknown internal server error.

### `POST /api/v1/user/merchant/products/upload`: Upload product endpoint

**Description**: This is the upload product endpoint that merchants use to add new products. <br />
**Request Fields**: Request must pass the product name, description and price as a JSON payload. <br />
**Authorization**: Requests must pass their JWT token as an `Authorization` header (bearer format is preferable). <br />
**Responses**:

- `201`: request was successful and product was added internally.
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `500`: unknown internal server error.

### `POST /api/v1/user/merchant/products/delete`: Delete product endpoint

**Description**: This is the delete product endpoint. <br />
**Request Fields**: Request must pass name (cannot be empty). <br />
**Authorization**: Requests must pass their JWT token as an `Authorization` header (bearer format is preferable). <br />
**Responses**:

- `200`: request was successful and a successful message was sent back.
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `404`: product could not be found with given name.
- `500`: unknown internal server error.

### `PATCH /api/v1/user/merchant/products/update`: Update product endpoint

**Description**: This is the update product endpoint. <br />
**Request Fields**: Request must pass name (cannot be empty), description (cannot be empty), price (cannot be empty), and picture. <br />
**Authorization**: Requests must pass their JWT token as an `Authorization` header (bearer format is preferable). <br />
**Responses**:

- `200`: request was successful and a successful message was sent back.
- `400`: bad request signal when request is malformed, does not contain the required fields, etc. (error sent as response)
- `404`: product could not be found with given name.
- `500`: unknown internal server error.

### `POST /api/v1/payment/purchase`: Purchase product endpoint

**Description**: This is the purchase product endpoint that youth use to purchase products. <br />
**Request Fields**: Request must pass the product name as a JSON payload. <br />
**Authorization**: Requests must pass their JWT token as an `Authorization` header (bearer format is preferable). <br />
**Responses**:

- `200`: request was successful and purchase was successful.
- `400`: bad request due to not enough credits in the youth account, or does not contain the required fields, etc.
- `404`: product could not be found with given name.
- `500`: unknown internal server error.

### `GET /api/v1/user/youth`: Get youths endpoint

**Description**: This is the get youths endpoint which passes back either a single youth or all youths in DB. <br />
**Request Fields**: Request may pass a URL parameter denoting the individual youth they want information for. <br />
**Responses**:

- `200`: request was successful and a success message is sent back.
- `404`: provided youth could not be found on server side (only happens if request for single youth). (error sent as response)
- `500`: unknown internal server error.
