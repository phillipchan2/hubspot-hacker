module.exports = {
	serializeQueryParameters(json) {
		return '?' +
		Object.keys(json).map(function(key) {
			return encodeURIComponent(key) + '=' +
			encodeURIComponent(json[key]);
		}).join('&');
	}
};