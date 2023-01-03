export default function auth(req, res, next) {
    if (req.session.login) {
        next()
    } else {
       res.status(401).send('No autorizado')
    }
}