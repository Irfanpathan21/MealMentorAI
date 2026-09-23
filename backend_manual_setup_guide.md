# MealMentor AI: Step-by-Step Azure Cloud & Backend Manual Setup Guide

Since AI agents cannot access your personal Azure billing portal, browser-based Azure console, or local system installations, this guide provides the exact clicking, configuration, and provisioning steps you need to perform to set up the infrastructure.

---

## Prerequisites
1.  **Azure Account**: You need a Microsoft Azure account. If you don't have one, register for a [Free Azure Account](https://azure.microsoft.com/free/).
2.  **Azure OpenAI Access**: Note that Azure OpenAI requires manual registration for subscriptions. Ensure your subscription is approved for Azure OpenAI access.
3.  **Local Tools**: Install [Node.js 20 LTS](https://nodejs.org/), [Git](https://git-scm.com/), and [pgAdmin 4](https://www.pgadmin.org/) (or use VS Code with the PostgreSQL extension) on your PC.

---

## Step 1: Create an Azure Resource Group

A Resource Group is a logical folder that groups all your project's cloud resources together.

1.  Log in to the [Azure Portal](https://portal.azure.com/).
2.  In the search bar at the top, type **Resource Groups** and select it under Services.
3.  Click the **+ Create** button.
4.  Configure the fields:
    *   **Subscription**: Select your active Azure subscription.
    *   **Resource Group**: Type `rg-mealmentor-prod`.
    *   **Region**: Select a region close to you that supports Azure OpenAI (e.g., **East US** or **Sweden Central**).
5.  Click **Review + create**, then click **Create**.

---

## Step 2: Set Up Azure OpenAI & Deploy Models

You need to deploy two models: `gpt-4o` (for image analysis and dietitian chat) and `text-embedding-ada-002` (for profile embeddings).

### 2.1 Create the Azure OpenAI Resource
1.  In the Azure Portal search bar, type **Cognitive Services** or **Azure OpenAI** and select **Azure OpenAI**.
2.  Click **+ Create**.
3.  Configure the fields:
    *   **Subscription**: Select your subscription.
    *   **Resource Group**: Select `rg-mealmentor-prod`.
    *   **Region**: Select **East US** (highly recommended for `gpt-4o` availability).
    *   **Name**: Type `openai-mealmentor`.
    *   **Pricing tier**: Select **S0** (Standard).
4.  Click **Next** until you reach the **Review + Submit** tab. Click **Create**.
5.  Once deployment completes, click **Go to resource**.
6.  Under **Resource Management** in the left sidebar, click **Keys and Endpoint**.
7.  Copy **Key 1** and the **Endpoint URL** to a temporary notepad file. You will need these for your backend `.env` file.

### 2.2 Deploy the Models in OpenAI Studio
1.  On the Overview page of your `openai-mealmentor` resource, click the **Go to Azure OpenAI Studio** button (or go directly to [oai.azure.com](https://oai.azure.com/)).
2.  In the left sidebar of the Studio, click **Deployments** under Management.
3.  Click **+ Create new deployment**.
4.  Set up the **GPT-4o Vision & Chat model**:
    *   **Model**: Select `gpt-4o`.
    *   **Model version**: Select the default (e.g., `2024-05-13` or newer).
    *   **Deployment name**: Type `gpt-4o-deployment`.
    *   Click **Create**.
5.  Click **+ Create new deployment** again.
6.  Set up the **Embeddings model**:
    *   **Model**: Select `text-embedding-ada-002`.
    *   **Model version**: Select default.
    *   **Deployment name**: Type `ada-embedding-deployment`.
    *   Click **Create**.

---

## Step 3: Configure Azure Blob Storage

This storage account will store uploaded food images and medical PDF reports.

### 3.1 Create the Storage Account
1.  In the Azure Portal search bar, type **Storage accounts** and select it.
2.  Click **+ Create**.
3.  Configure the fields:
    *   **Subscription**: Select your subscription.
    *   **Resource Group**: Select `rg-mealmentor-prod`.
    *   **Storage account name**: Type a unique, lowercase name (e.g., `storemealmentor` + some random numbers, like `storemealmentor45`).
    *   **Region**: Select the same region as your resource group (e.g., **East US**).
    *   **Performance**: Select **Standard**.
    *   **Redundancy**: Select **Locally-redundant storage (LRS)** (cheapest, suitable for development).
4.  Click **Review + create**, then click **Create**.

### 3.2 Create Blob Containers & Set Access
1.  Once deployment completes, open your storage account resource.
2.  In the left sidebar under **Data storage**, click **Containers**.
3.  Click **+ Container**.
    *   **Name**: Type `food-images`.
    *   **Anonymous access level**: Select **Blob (anonymous read access for blobs only)**. This allows your React Native app to load images directly via URL.
    *   Click **Create**.
4.  Click **+ Container** again.
    *   **Name**: Type `health-reports`.
    *   **Anonymous access level**: Select **Private** (medical reports should not be publicly accessible).
    *   Click **Create**.

### 3.3 Retrieve the Access Keys
1.  In the storage account left sidebar under **Security + networking**, click **Access keys**.
2.  Click **Show keys** at the top.
3.  Copy the **Connection string** under `key1` to your notepad.

---

## Step 4: Provision Azure PostgreSQL & Configure Vector Extension

This is the primary relational database, which will also handle vector calculations for user profile similarity searching.

### 4.1 Create the PostgreSQL Server
1.  In the Azure Portal search bar, type **Azure Database for PostgreSQL flexible servers** and select it.
2.  Click **+ Create**.
3.  Configure the fields:
    *   **Subscription**: Select your subscription.
    *   **Resource Group**: Select `rg-mealmentor-prod`.
    *   **Server name**: Type `db-mealmentor` (must be unique).
    *   **Region**: Select your region (e.g., **East US**).
    *   **Workload type**: Select **Development** (cheapest configuration).
    *   **Compute + storage**: Click *Configure server* -> select **Burstable, B1ms** size with **32 GB storage** to keep costs minimum.
    *   **Database name**: Type `mealmentor`.
    *   **Admin username**: Type a secure username (e.g., `dbadmin`).
    *   **Password**: Type a secure password. *Write this down immediately.*
4.  Click **Next: Networking**.
5.  Configure **Firewall Rules**:
    *   Check **Allow public access from any Azure service within Azure to this server** (crucial so that your Azure Node App Service can connect).
    *   Click **+ Add current client IP address** (this allows your home development PC/IDE to connect to the database during local coding).
6.  Click **Review + create**, then click **Create** (this takes about 5 minutes to provision).

### 4.2 Enable the pgvector extension manually
1.  Open **pgAdmin 4** on your local machine.
2.  Right-click **Servers** -> **Register** -> **Server...**
3.  On the **General** tab:
    *   **Name**: Type `Azure PostgreSQL`.
4.  On the **Connection** tab:
    *   **Host name/address**: Paste your server name (e.g., `db-mealmentor.postgres.database.azure.com`).
    *   **Port**: `5432`.
    *   **Maintenance database**: `mealmentor` (or `postgres`).
    *   **Username**: `dbadmin` (the admin username you chose).
    *   **Password**: The password you chose.
    *   Click **Save**.
5.  Once connected, expand your server, navigate to **Databases** -> **mealmentor**.
6.  Right-click on **mealmentor** and select **Query Tool**.
7.  Type and execute the following SQL command:
    ```sql
    CREATE EXTENSION IF NOT EXISTS vector;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    ```
8.  Verify the success output in pgAdmin. The database is now ready for your table schemas.

---

## Step 5: Local Node.js Backend Setup & Run

Now connect your local development backend to the newly provisioned cloud components.

### 5.1 Initialize Folder & Install packages
1.  Create a folder named `backend` on your computer.
2.  Open your terminal in that folder and run:
    ```bash
    npm init -y
    npm install express pg dotenv jsonwebtoken bcryptjs cors multer @azure/openai @azure/storage-blob
    ```

### 5.2 Create the Environment Config File
Create a file named `.env` in the `backend/` root directory and populate it with the keys you gathered during the steps above:

```env
PORT=5000

# Azure Database configuration
DB_USER=dbadmin
DB_HOST=db-mealmentor.postgres.database.azure.com
DB_NAME=mealmentor
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# JWT Secret for app logins
JWT_SECRET=super_secret_jwt_string_123

# Azure Storage (Blob) Connection String
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your_storage_name;AccountKey=your_storage_key==;EndpointSuffix=core.windows.net

# Azure OpenAI (Cognitive Services) Settings
AZURE_OPENAI_ENDPOINT=https://openai-mealmentor.openai.azure.com/
AZURE_OPENAI_API_KEY=your_openai_key_from_step_2_1
```

### 5.3 Write Database Pool Handler (`db.js`)
Create a file named `db.js` inside the `backend/` directory to manage database connections:

```javascript
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false // Required for Azure PostgreSQL secure connection
  }
});

export default {
  query: (text, params) => pool.query(text, params),
};
```

### 5.4 Write Express Server Shell (`index.js`)
Create an `index.js` file inside `backend/` to start listening for API calls:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ status: 'healthy', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 5.5 Start the Server
Run the backend server locally to test connections:
```bash
node index.js
```
Open a browser and navigate to `http://localhost:5000/api/health`. If you see a JSON response showing the server timestamp, **your backend is successfully connected to your Azure PostgreSQL database!**
