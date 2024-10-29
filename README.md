# **Q&A Platform**

A full-stack web application for a question/answer system, enabling users to create, manage, and delegate questions and answers efficiently. The application includes CRUD functionality, bulk assignment, custom properties/tags, and filtering/search capabilities. This project uses **Express.js** for the backend with **Airtable** as the database and **React.js** with **Tailwind CSS** for the frontend interface.

---

## **Table of Contents**

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Future Improvements](#future-improvements)

---

## **Features**

- **Create, Update, Delete, Assign** questions and answers
- **Bulk Assign** questions to a single user
- **Custom Properties/Tags** for questions
- **Fuzzy Search** and **Advanced Filtering** by assigned user and properties
- **History Tracking** for question updates

## **Tech Stack**

- **Backend**: Node.js, Express.js, Airtable
- **Frontend**: React.js, Material-UI (or Tailwind CSS), Axios
- **Other Tools**: dotenv, concurrently, Jest (for testing)

---

## **Getting Started**

### Prerequisites

- **Node.js** (v12 or later)
- **Airtable Account**: Set up an Airtable base with the fields provided in the task description.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/demo-fs-webapp.git
   cd demo-fs-webapp
   ```

2. **Backend Setup**:

   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:

   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**:

   - Create `.env` files in both the `backend` and `frontend` folders.
   - In `/backend/.env`, add:
     ```env
     AIRTABLE_ACCESS_TOKEN=<your_airtable_access_token>
     AIRTABLE_BASE_ID=<your_airtable_base_id>
     PORT=5000
     ```
   - In `/frontend/.env`, add:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api/questions
     ```

5. **Run the Application**:

   - From the root folder, start both the backend and frontend concurrently:

     ```bash
     npm install
     npm start
     ```

   - Alternatively, you can start each separately:

     ```bash
     # Backend
     cd backend
     npm start

     # Frontend
     cd ../frontend
     npm start
     ```

6. **Access the Application**:
   - Visit `http://localhost:3000` to access the frontend.

---

## **Project Structure**

```
qa-platform/
├── backend/               # Express.js backend code
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   └── index.js       # Main server file
│   ├── .env               # Environment variables for backend
│   └── package.json       # Backend dependencies and scripts
│
├── frontend/              # React.js frontend code
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/           # API methods to connect to backend
│   │   └── App.js         # Main entry point for React app
│   ├── .env               # Environment variables for frontend
│   └── package.json       # Frontend dependencies and scripts
│
└── README.md              # Root documentation
```

---

## **API Documentation**

| Endpoint                     | Method | Description                       |
| ---------------------------- | ------ | --------------------------------- |
| `/api/questions`             | POST   | Create a new question             |
| `/api/questions`             | GET    | Retrieve questions with filters   |
| `/api/questions/:id`         | PUT    | Update a question or answer       |
| `/api/questions/:id`         | DELETE | Delete a question                 |
| `/api/questions/assign`      | PATCH  | Bulk assign questions to a user   |
| `/api/questions/search?q={}` | GET    | Fuzzy search on questions/answers |

### Sample Request

- **Create Question**

  ```bash
  POST /api/questions
  Content-Type: application/json

  {
    "question": "Is data encrypted?",
    "createdBy": "user@example.com",
  }
  ```

---

Feel free to reach out for any questions or further assistance with the setup.
