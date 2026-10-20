# Workshop 8 - Node.js Data Dive: Starter Project

The companion project for `Workshop_8_Node_Data_Dive_Beginner_Guide.pdf`.

1. Install Node.js LTS and PostgreSQL. Use pgAdmin to create `workshop8_db`.
2. Run the SQL in `schema.sql` in the new database (only once to avoid duplicate seeds).
3. Copy `.env.example` to `.env`, and replace `YOUR_POSTGRES_PASSWORD` with your PostgreSQL password.
4. In this project folder run `npm install express postgres dotenv`.
5. Run `npm start`.
6. Visit http://localhost:3000/health and http://localhost:3000/users.
7. Install VS Code REST Client to send the requests in `requests.http`, or use Postman.

This bundle includes the complete reference code for Parts A-E. For the most learning, follow the PDF guide and type the code yourself before comparing.

**Security:** never commit `.env` or share real database credentials.
