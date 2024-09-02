const express = require('express');
const connectDB = require('./config/dbConfig');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const authMiddleware = require('./middlewares/authMiddleware');
require('dotenv').config();

const app = express();
connectDB();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// i18next Middleware
i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        backend: {
            loadPath: './translations/{{lng}}.json',
        },
    });
app.use(i18nextMiddleware.handle(i18next));
// app.use(authMiddleware);

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/libraries', require('./routes/libraryRoutes'));
app.use('/api/libraries', require('./routes/inventoryRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
