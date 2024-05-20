# Robotic System Dashboard

This project is a Robotic System Dashboard that allows users to monitor and manage robots, including creating, updating, and deleting robot entries. The dashboard also displays various charts and statistics about the robots.

## Features

- User Authentication (Login and Registration)
- Display a list of robots with their details
- Create new robots
- Update robot details
- Delete robots
- Visualize robot data using charts (battery levels, operational statuses)
- Toast notifications for create, update, and delete actions

## Screenshots 
![Screenshot (174)](https://github.com/IshaGitHubProfile/assignment-eric/assets/143515190/0a595089-52be-495b-932b-4d7fdd0a1598)
![Screenshot (176)](https://github.com/IshaGitHubProfile/assignment-eric/assets/143515190/a8a5af26-290c-46af-8a5f-7b7cd96477a9)
![Screenshot (177)](https://github.com/IshaGitHubProfile/assignment-eric/assets/143515190/152d0f00-9acb-44dd-9ff2-5e50e33903a6)


## Technologies Used

### Frontend

- React
- Chart.js
- React Chartjs 2
- Axios
- React Router DOM
- React Datepicker
- React Toastify

### Backend

- Node.js
- Express
- MongoDB
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Installation

#### Clone the repository

git clone https://github.com/IshaGitHubProfile/Robotic-System-Dashboard.git

cd Robotic-System-Dashboard

#### Setup the backend

cd backend

npm install

Create a .env file in the backend directory with the following contents:

MONGO_URI=<your_mongo_uri>

JWT_SECRET=<your_jwt_secret>

PORT = 5000

#### Setup the frontend

cd ../frontendd

npm install

### Running the Application

#### Start the backend server

cd backend

node server.js

#### Start the frontend development server

cd frontendd

npm start

The frontend will typically be available at http://localhost:3000 and the backend at http://localhost:5000.

### API Endpoints

#### Authentication

POST /api/auth/register - Register a new user

POST /api/auth/login - Login a user

#### Robots

GET /api/robots - Get all robots

GET /api/robots/:id - Get a single robot by ID

POST /api/robots - Create a new robot

PATCH /api/robots/:id - Update a robot by ID

DELETE /api/robots/:id - Delete a robot by ID

