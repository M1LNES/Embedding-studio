const path = require('path')

module.exports = (webpackDevMiddleware, webpackConfig) => (req, res, next) => {
	const reqPath = req._parsedUrl.pathname
	// find the file that the browser is looking for
	const file = reqPath.split('/').pop()
	if (file.endsWith('.js')) {
		res.end(
			webpackDevMiddleware.context.outputFileSystem.readFileSync(
				path.join(webpackConfig.output.path, file)
			)
		)
	} else if (file.indexOf('.') === -1) {
		// if the url does not have an extension,
		// assume they've navigated to something like /home and want index.html
		res.end(
			webpackDevMiddleware.context.outputFileSystem.readFileSync(
				path.join(webpackConfig.output.path, 'index.html')
			)
		)
	} else {
		next()
	}
}
