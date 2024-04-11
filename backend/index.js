require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(cookieParser());

app.use('/api', userRoutes);
app.use('/api', profileRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

db.connect();

app.listen(3000, () => {
    console.log(`Server started`);
});