

export default {
    port: process.env.PORT || 3100,
    database: process.env.MONGODB_URI || 'mongodb://localhost:27017/booking'
};
