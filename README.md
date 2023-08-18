# Sell Site

This repository contains the source code for a comprehensive web application that encompasses user registration, login, account management, and password change functionalities. The application is constructed using HTML, CSS, and JavaScript for the front end, while the back end employs Express.js, PostgreSQL, and bcrypt. The following sections provide a comprehensive overview of the different elements of this project.

## Front End

### Login Page (`index.html`)

The login page (`index.html`) offers a user-friendly interface for users to input their email and password for logging in. Upon successful login, users are directed to the VPN page.

### Registration Page (`register.html`)

The registration page (`register.html`) enables users to create an account by supplying their email, nickname, and password. The form validates user inputs and displays relevant error messages. After successful registration, users are redirected to the login page.

### Account Page (`vpn.html`)

The account page (`vpn.html`) is accessible exclusively to authenticated users. It showcases the user's account information, encompassing username, email, and registration date. Users can also undertake actions such as altering their password, updating their profile, and logging out.

### Account Dashboard (`kabinet.html`)

The account dashboard (`kabinet.html`) offers users a central hub to access their account details. It showcases account information, provides links to change passwords and update profiles, and enables users to log out.

### Change Password Page (`KKKparol.html`)

The change password page (`KKKparol.html`) enables users to modify their password. Users input their old password, new password, and confirm the new password. The page validates user input, ensures password confirmation, and triggers the password change process.

## Back End

### Server (`server.js`)

The primary server file (`server.js`) configures the Express server, establishes a connection to the PostgreSQL database, and defines routes for various user-oriented actions.

### User Authentication

User authentication is enforced through bcrypt to securely hash and validate passwords. During registration, passwords are hashed before storage. For login and password changes, password hashes are compared for validation.

### Routes

- `/register`: Manages user registration, validates input, and stores hashed passwords in the database.
- `/login`: Facilitates user login and session creation.
- `/logout`: Handles user logout by terminating the session.
- `/change-password`: Supports password alteration, validates the old password, and updates the password in the database.
- `/get-user-data`: Retrieves user data for the account dashboard.

## Usage

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up a PostgreSQL database and update the `db_params` in `server.js` accordingly.
4. Start the server: `npm start`

## Note

This project serves as an illustrative example showcasing user registration, login, and account management features. It's imperative to integrate robust security practices and thorough input validation in a production environment. For instance, this project doesn't incorporate HTTPS, and the front end's input validation is rudimentary.
