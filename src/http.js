export default {
	get: function (url) {
		return new Promise((resolve, reject) => {
			let request = new XMLHttpRequest();
			request.open('GET', 'fetch.php?' + url, true);
			request.onload = function () {
				if (request.status >= 200 && request.status < 400) {
					resolve(request.responseText);
				} else {
					reject({
						status: request.status,
						statusText: request.statusText,
						responseText: request.responseText,
						message: 'Request failed: ' + request.status
					});
				}
			};

			request.onerror = function () {
				reject({
					message: 'Client connection error'
				});
			};

			request.send();
		});
	}
};
