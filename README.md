### README.md

# N-Cash Server: Backend for Mobile Financial Service (MFS) Web App

This repository contains the backend code for the N-Cash Mobile Financial Service (MFS) web application. It is built using Node.js, Express.js, and MongoDB, following the MVC pattern. The backend handles user authentication, including password hashing with bcrypt, token verification with JWT, and cookie management with cookie-parser.

### Features

- User authentication with JWT.
- Password hashing with bcrypt.
- Follows the MVC pattern.
- Uses cookie-parser for managing cookies.
- MongoDB for the database.

### Technologies Used

- **Node.js**
- **Express.js**
- **bcrypt**
- **JWT (JSON Web Tokens)**
- **cookie-parser**
- **MongoDB**

### How to Run the Project

Follow these steps to set up and run the project locally:

1. **Clone the Repository:**

```bash
git clone https://github.com/nazim1971/N-cash-server.git
cd n-cash-server
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Set Up Environment Variables:**

Create a `.env` file in the root directory of your project and add the necessary environment variables:

```
ACCESS_TOKEN_SECRET=your_access_token_secret
DB_USER=your_mongodb_user
DB_PASS=your_mongodb_password
```

Replace `your_access_token_secret`, `your_mongodb_user` and `your_mongodb_password` with the actual values from your MongoDB setup.

4. **Run the Project:**

```bash
npm run dev
```

The server should now be running locally. You can make API requests to `http://localhost:3000`.

### Contact

For any questions or support, please reach out to [nazimmuddin10@gmail.com](mailto:nazimmuddin10@gmail.com).
