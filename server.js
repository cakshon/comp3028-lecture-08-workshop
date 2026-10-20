import express from 'express';
import sql from './db.js';

const app = express();
const port = Number(process.env.PORT || 3000);

// Allows Express to read JSON sent in request bodies.
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Workshop 8!' });
});

// Check that Node.js can actually query PostgreSQL.
app.get('/health', async (req, res) => {
  try {
    const rows = await sql`SELECT 1 AS ok`;
    res.json({ message: 'Database connected', result: rows[0] });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Return every user, sorted by ID.
app.get('/users', async (req, res) => {
  try {
    const rows = await sql`
      SELECT user_id, name, age
      FROM users
      ORDER BY user_id
    `;
    res.json(rows);
  } catch (error) {
    console.error('GET /users failed:', error);
    res.status(500).json({ error: 'Could not retrieve users' });
  }
});

// Example: GET /users/search?name=Ja
app.get('/users/search', async (req, res) => {
  const name = req.query.name;
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Provide a name query' });
  }

  try {
    const pattern = `%${name.trim()}%`;
    const rows = await sql`
      SELECT user_id, name, age
      FROM users
      WHERE LOWER(name) LIKE LOWER(${pattern})
      ORDER BY user_id
    `;
    return res.json(rows);
  } catch (error) {
    console.error('Search failed:', error);
    return res.status(500).json({ error: 'Could not search users' });
  }
});

// Example: GET /users/1
app.get('/users/:id', async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isSafeInteger(userId) || userId < 1) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  try {
    const rows = await sql`
      SELECT user_id, name, age
      FROM users
      WHERE user_id = ${userId}
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error('Get one user failed:', error);
    return res.status(500).json({ error: 'Could not retrieve user' });
  }
});

// Example: POST /users with JSON { "name": "John", "age": 30 }
app.post('/users', async (req, res) => {
  const { name, age } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    name.trim().length === 0 ||
    name.trim().length > 100 ||
    !Number.isInteger(age) ||
    age < 0 || age > 130
  ) {
    return res.status(400).json({
      error: 'Provide a non-empty name (max 100 characters) '
        + 'and an integer age between 0 and 130'
    });
  }

  const user = { name: name.trim(), age };

  try {
    const rows = await sql`
      INSERT INTO users ${sql(user)}
      RETURNING user_id, name, age
    `;
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create user failed:', error);
    return res.status(500).json({ error: 'Could not create user' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
