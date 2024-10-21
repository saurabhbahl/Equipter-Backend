# Equipter E-Commerce

## 🛠️ Project Installation Steps 

1. **Clone the Repository:**
   Clone the repository to your local computer by running the following command:

            git clone <url>


2. **Ensure Your .env File is Properly Set Up in server folder:**
   Copy and Paste the env variables in root:

      
        DB_URL='postgresql://postgres:admin@localhost:5432/equipter?schema=public'
        PORT=3000
        JWT_SECRET="your_jwt_secret_here"
        FRONTEND_URL='http://localhost:5173'
        MAILER_EMAIL=your_email_here@gmail.com
        MAILER_PASSWORD=your_app_password_here
        
        SF_ACCESS_TOKEN_URL='https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=your_client_id&client_secret=your_client_secret&username=your_salesforce_username&password=your_salesforce_password'
        SF_INSTANCE_URL='your_salesforce_instance_url'
        SF_CLIENT_ID='your_salesforce_client_id'
        SF_CLIENT_SECRET='your_salesforce_client_secret'
        SF_USERNAME='your_salesforce_username'
        SF_PASSWORD='your_salesforce_password'
        SF_SECURITY_TOKEN='your_salesforce_security_token'
        SF_OBJECT_URL='https://your_salesforce_instance_url/services/data/v52.0/sobjects'




3. **Before running the project make sure that Nodejs(min. version 20) is installed and Postgres database is running on your computer**

      [PostgreSQL Download Link](https://www.postgresql.org/download/)
   
      [Node.js Download Link](https://nodejs.org/en/download/prebuilt-installer)

5. **Navigate to the Project Folder and run the  command:**

   After cloning the repo, navigate to the project folder and run  commands in project terminal:

            npm install
            npm run db:generate
            npm run db:migrate
            npm run db:seed
            npm run start:dev
   
   
# 📦Packages and Libraries

   ### Server-side Dependencies (Backend)
   - **@faker-js/faker**: For generating fake data.
   - **bcryptjs**: Password hashing library.
   - **cors**: Middleware for enabling Cross-Origin Resource Sharing.
   - **dotenv**: For loading environment variables from .env files.
   - **drizzle-orm**: Database ORM for working with SQL databases.
   - **express**: Web framework for Node.js.
   - **jsonwebtoken**: For creating and verifying JSON Web Tokens.
   - **nodemailer**: For sending emails.
   - **nodemon**: Tool for restarting the server automatically when file changes occur.
   - **pg**: PostgreSQL client for Node.js.
   - **pg-hstore**: Library for serializing JSON objects to HStore format in PostgreSQL.
   - **postgres**: Node.js driver for PostgreSQL databases.
   - **zod**: Schema declaration and validation.
   
   ### Dev Dependencies (Backend)
   - **drizzle-kit**: CLI for generating and running migrations for Drizzle ORM.
   
   
