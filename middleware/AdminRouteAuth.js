
const adminRouteAuth = function(req, res, next) {
    const session = req.session.key;
    const role = req.session.role;
    if (!session || role !== "admin") {
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
}

module.exports = adminRouteAuth;
