module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next); //catch(e => next(e)) both works
    }
}