if (process.env.NODE_ENV == 'production') {
    module.exports = { mongoURI: 'mongodb+srv://weather-app:eMCztiZ5YSxSLaEW@cluster0.qmxnh.mongodb.net/weatherapp?retryWrites=true&w=majority' }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/weatherapp' }
}
