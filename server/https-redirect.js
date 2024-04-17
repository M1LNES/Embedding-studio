module.exports = function (req, res, next) {
	if (
		process.env.NODE_ENV === 'production' &&
		(req.headers['x-forwarded-proto'] || '').toLowerCase() !== 'https'
	) {
		return res.redirect('https://' + req.headers.host + req.url)
	}
	return next()
}
