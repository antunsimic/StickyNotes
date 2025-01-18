# Sticky Notes

Sticky Notes is an online notepad application that allows users to create, edit, and manage notes. The application supports user authentication, note visibility settings, and integration with Google and GitHub for OAuth-based login.

## Features

- **User Authentication**: Users can register, log in, and log out.
- **OAuth Integration**: Users can log in using Google or GitHub accounts.
- **Note Management**: Users can create, edit, and delete notes.
- **Note Visibility**: Notes can be set to private or public.
- **Responsive Design**: The application is designed to be responsive and user-friendly.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js.
- **PostgreSQL**: Database for storing user and note data.
- **EJS**: Templating engine for rendering HTML.
- **Passport.js**: Authentication middleware for Node.js.
- **Bootstrap**: Frontend framework for responsive design.
- **jQuery**: JavaScript library for DOM manipulation.

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/antunsimic/StickyNotes.git
    cd StickyNotes
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a .env file in the root directory and add the following variables:
    ```env
    DATABASE_USER=your_database_user
    DATABASE_PASSWORD=your_database_password
    SESSION_KEY=your_session_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    ```

4. **Run the application**:
    ```sh
    npm start
    ```

5. **Access the application**:
    Open your browser and go to `http://localhost:3000`.

## Usage

- **Register**: Create a new account by providing a username and password.
- **Log In**: Log in with your credentials or use Google/GitHub OAuth.
- **Create Note**: Click on the "New Note" button to create a new note.
- **Edit Note**: Click on a note to view and edit it.
- **Delete Note**: Click the delete button to remove a note.
- **Set Visibility**: Choose between private and public visibility for your notes.

## License

This project is licensed under the terms specified in the LICENSE.md file.

## Acknowledgements

- **Bootstrap**: For the frontend framework.
- **jQuery**: For DOM manipulation.
- **Express**: For the web framework.
- **Passport**: For authentication.
- **dotenv**: For environment variable management.
- **node-postgres**: For PostgreSQL integration.

## Contact

For inquiries regarding commercial use or other questions, please contact antun.simic02@gmail.com
