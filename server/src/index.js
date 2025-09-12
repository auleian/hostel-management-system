import dotenv from 'dotenv';
import app from './server.js';

dotenv.config();

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

