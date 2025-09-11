import express from 'express';
import mongoose from 'mongoose';
import config from './config/database.js';
import router from './Routes/bookingRoutes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//creating a connection between controller and database
mongoose.connect(config.database);

const db = mongoose.connection;
//checking if db has connected
db.once("open", () => {
console.log("connected to db");
})
db.on("error", (err) => {
console.error(err);
});


app.use('/api', router);

export default app;