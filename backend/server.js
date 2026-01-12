const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', text: 'Personal Life Tracker API' });
});

app.get('/', (req, res) => {
  res.send('¡El backend está funcionando correctamente!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
