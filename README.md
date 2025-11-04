# Matcha - Dating Application

Matcha is a full-featured dating application developed as part of the 42 school curriculum. It allows users to create a profile, search for other users based on specific criteria, interact with them (likes, profile visits), and chat in real-time.

## Tech Stack

- **Frontend:** Angular
- **Backend:** Node.js with Express.js (TypeScript)
- **Real-time Communication:** Socket.IO
- **Database:** PostgreSQL
- **DB Admin Management:** pgAdmin
- **Containerization:** Docker & Docker Compose
- **Reverse Proxy:** Nginx

## Prerequisites

Before you start, make sure you have the following tools installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- `make`

## Configuration

The project uses environment variables to manage sensitive information and configuration. You need to create three environment files at the root of the project:

1.  `.env`
2.  `.db.env`
3.  `.pgadmin.env`

Here are the variables to define in each file:

---

### 1. `.env` File

This file contains the API keys and secrets for the application.

```env
# Secrets for JWT token generation
ACCESS_SECRET=YOUR_ACCESS_TOKEN_SECRET
REFRESH_SECRET=YOUR_REFRESH_TOKEN_SECRET

# Secrets for forgotten password encryption
RESET_PASSWORD_SECRET=YOUR_RESET_PASSWORD_SECRET
RESET_PASSWORD_INIT_VECTOR=YOUR_RESET_PASSWORD_INIT_VECTOR

# Secrets for email account activation
ACTIVATION_ACCOUNT_SECRET=YOUR_EMAIL_ACTIVATION_SECRET
ACTIVATION_ACCOUNT_INIT_VECTOR=YOUR_EMAIL_ACTIVATION_INIT_VECTOR

# Base URL of your application (e.g., http://localhost:8080)
URL=http://localhost:8080

# Key for the IP geolocation service
IP_LOCATION_KEY=YOUR_IP_LOCATION_KEY

# Credentials for sending emails (via Gmail)
EMAIL=YOUR_EMAIL_ADDRESS@gmail.com
MAIL_APP_PASSWORD=YOUR_GMAIL_APP_PASSWORD

# Google credentials for OAuth2 authentication
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Firebase configuration (for image storage)
FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY="YOUR_FIREBASE_PRIVATE_KEY"
FIREBASE_CLIENT_MAIL=YOUR_FIREBASE_CLIENT_EMAIL
```

---

### 2. `.db.env` File

This file contains the credentials for the PostgreSQL database.

```env
# Database user
POSTGRES_USER=user
# Database password
POSTGRES_PASSWORD=password
# Database name
POSTGRES_DB=matcha
```

---

### 3. `.pgadmin.env` File

This file contains the credentials for the pgAdmin administration interface.

```env
# Email to log in to pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@example.com
# Password to log in to pgAdmin
PGADMIN_DEFAULT_PASSWORD=admin
```

## Running the Project

Once the configuration files are created and filled, you can launch the entire application with a single `make` command.

```bash
# Starts all services (builds images if necessary)
make
```

The application will then be accessible at [http://localhost:8080](http://localhost:8080).

### Other useful `make` commands

-   `make up`: Starts the containers (equivalent to `make`).
-   `make down`: Stops the containers.
-   `make stop`: Stops the containers without deleting them.
-   `make re`: Stops, deletes containers and volumes, then restarts everything.
-   `make clean`: Stops and deletes containers, volumes, and orphan networks.
-   `make fclean`: Complete cleanup, deletes all Docker data (volumes, networks). **Warning, this command is destructive.**
-   `make logs`: Displays the logs of all services in real-time.
-   `make ps`: Lists the currently running containers.

## Project Structure

```
.
├── api/              # Backend in Express.js
├── client/           # Frontend in Angular
├── nginx/            # Nginx reverse proxy configuration
├── postgres/         # PostgreSQL database configuration
├── shared-models/    # Data models shared between services
├── socket/           # Socket.IO service for the chat
├── docker-compose.yml # Container orchestration
├── Makefile          # Simplified commands for project management
└── README.md         # This file
```