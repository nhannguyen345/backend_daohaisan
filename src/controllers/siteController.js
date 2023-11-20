const home = (req, res, next) => {
    res.sendFile(__dirname + '/../public/home.html')
}

module.exports = {
    home,
}
