# Motivation

Due to the rising number of homeless youth, youth homelessness is becoming more and more prevalent. Our vision is to build a holistic online platform that can bridge merchants, donors, and homeless youth together. We aim to act as a catalyst in which to reduce the barriers for homeless youth to seek help and for donors who are willing to donate. The website accepts money from donors and goes directly to homeless youth as a credit point that can be exchanged for educational support or living needs (grocery, clothing, etc.). The homeless individuals will be able to upload their information and stories for donors to see. If the donor obliges, they will be able to select individuals they want to aid. Alternatively, they can also choose to donate to our organization directly.

# Backend Setup

### Prerequisites

- node.js v16.10.0+
- npm v7.24.1+

### Optional

The following are needed only if you want to use your own Azure storage account or Mongo database. Otherwise, default credentials and connection strings are already included. To use your custom values, replace the environment variable values present in the `/backend/.env` folder of the repository.

- Azure blob storage account credentials
- MongoDB connection string

### Installation

1. Clone the repo if needed

   ```sh
   git clone https://github.com/UTSCCSCC01/projectf21-admin.git
   ```

2. Install NPM packages (note: run command inside the `/backend` folder)

   ```sh
   npm install
   ```

3. Start the application (note: run command inside the `/backend` folder)

   ```sh
   node server.js
   ```

# Frontend Setup

### Prerequisites

- node.js v16.10.0+
- npm v7.24.1+

### Installation

1. Clone the repo if needed

   ```sh
   git clone https://github.com/UTSCCSCC01/projectf21-admin.git
   ```

2. Install NPM packages (note: run command inside the `/frontend` folder)

   ```sh
   npm install
   ```

3. Start the application (note: run command inside the `/frontend` folder)

   ```sh
   npm start
   # Live development server

   npm run build
   # Optimized production build
   ```

### Testing

Running `npm test` inside the `/frontend` folder will run any tests that are present.

# Contribution

We will be using Git flow with the `main` (product) branch, `develop` branch and as many feature branches as needed named after the feature that will be worked on in that branch. Each feature branch needs to be reviewed (using pull-request) by another team member before merging into the `develop` branch. Approximately at the end of each sprint, we will submit a pull-request to merge the `develop` branch into the `main` branch (this will also need to be reviewed by team members).
