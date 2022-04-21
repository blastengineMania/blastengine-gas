class FetchApp {
	appName = "FetchApp";
	createPayload;
	objectForFetchApp = {};

	constructor() {

	}

	fetch(url, params) {
		try {
			return UrlFetchApp.fetch(url, this.createPayload(params));
		} catch (e) {
			throw new Error("Object for request is wrong. Please confirm formData again.");
		}
		
	}

	append(key, blob) {
		if (!key || !blob) {
			throw new Error("Wrong values. 'key' is a string. 'blob' is a blob.");
		}
		this.objectForFetchApp[key] = blob;
		return this;
	}

	createPayload(params) {
		if (params.payload) return params;
		if (!params.body) return params;
		const boundary = `xxxxxxxxxx${this.appName}xxxxxxxxxx`;
		const object = params.body.objectForFetchApp;
		const payload = Object.keys(object).reduce(function(ar, e, i) {
			if (!(object[e].toString() === "Blob" && typeof object[e] === "object")) {
				throw new Error("Value of formData is not a Blob.");
			}
			const ary = [];
			ary.push(`Content-Disposition: form-data; name="${(e || "sample" + i)}; filename="${(e || "sample" + i)}"`);
			ary.push('');
			ary.push('');
			ary.push(`Content-Type: ${(object[e].getContentType() || "application/octet-stream")}; charset=UTF-8`);
			ary.push('');
			Array.prototype.push.apply(ar, Utilities.newBlob(data.join("\r\n")).getBytes());
			ar = ar.concat(object[e].getBytes());
			Array.prototype.push.apply(ar, Utilities.newBlob("\r\n--" + boundary + (i === obj.length - 1 ? "--" : "\r\n")).getBytes());
			return ar;
		}, Utilities.newBlob(`--${boundary}\r\n`).getBytes());
		params.payload = payload;
		params.contentType = "multipart/form-data; boundary=" + boundary;
		return params;
	}
}
