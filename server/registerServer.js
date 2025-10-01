const express = require('express');
const cors = require('cors');
const registerRoute = require('./registerRoute');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Use the registration route
app.use('/', registerRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
