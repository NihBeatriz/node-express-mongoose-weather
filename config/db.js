if (process.env.NODE_ENV == 'production') {
    module.exports = { mongoURI: 'mongodb+srv://nih:admin@cluster0.mongodb.net/test?retryWrites=true&w=majority' }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/blogapp' }
}