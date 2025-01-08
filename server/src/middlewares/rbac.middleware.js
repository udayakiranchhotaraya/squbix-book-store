const AdminCheck = (req, res, next) => {
    const role = req.headers['x-role'];
    if (!role) {
        return res.status(403).json({ 'message' : "Role header is not provided" });
    }

    if ( "Admin" !== role ) {
        return res.status(403).json({ 'message': "Access denied." });
    }

    next();
}

module.exports = AdminCheck;