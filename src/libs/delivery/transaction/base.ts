import { BlastEngine } from '../../..';

class Base {
	static client?: BlastEngine;
	public fromName = '';
	public fromEmail = '';
	public subject = '';
	public encode = 'UTF-8';
	public text_part = '';
	public html_part = '';
	public url?: string;
	public attachments: string[] = [];

	setSubject(subject: string): BEReturnType {
		this.subject = subject;
		return this;
	}

	setFrom(email: string, name = ''): BEReturnType {
		this.fromEmail = email;
		this.fromName = name;
		return this;
	}

	setEncode(encode: string): BEReturnType {
		this.encode = encode;
		return this;
	}

	setText(text: string): BEReturnType {
		this.text_part = text;
		return this;
	}

	setHtml(html: string): BEReturnType {
		this.html_part = html;
		return this;
	}

	addAttachment(file: GoogleAppsScript.Base.Blob): BEReturnType {
		const boundary = this.createBoundary(file, 'file');
		this.attachments.push(boundary);
		return this;
	}

	req(method: GoogleAppsScript.URL_Fetch.HttpMethod, url: string, params?: RequestParams): SuccessFormat {
		try {
			const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
				method,
				headers: {
					'Authorization': `Bearer ${Base.client?.token}`,
				}
			};

			if (['POST', 'PUT', 'PATCH'].indexOf(method.toUpperCase()) > -1) {
				options.payload = params;
			}
			const res = this.attachments.length > 0 ? this.sendAttachment(url, options) : this.sendJson(url, options);
			return JSON.parse(res.getContentText()) as SuccessFormat;
		} catch (e: any) {
			console.error(e);
			if ('response' in e) {
				throw e.response.text;
			}
			throw e;
		}
	}

	sendJson(url: string, params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.HTTPResponse {
		params.headers!['Content-Type'] = 'application/json';
		return UrlFetchApp.fetch(url, params);
	}

	sendAttachment(url: string, params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const json: GoogleAppsScript.URL_Fetch.Payload = params.payload!
		const data = Utilities.newBlob(JSON.stringify(json), 'application/json', 'data')
		const payload = `${this.attachments.join("\r\n")}\r\n${this.createBoundary(data, 'data', true)}`
		return UrlFetchApp.fetch(url, {...params, ...{payload}});
	}

	getBoundary(): string {
		return `BlastengineGAS`;
	}

	createBoundary(file: GoogleAppsScript.Base.Blob, name: string, last: boolean = false): string {
		const boundary = `----${this.getBoundary()}${last ? '--' : ''}`;
		const ary = [];
		ary.push(`Content-Disposition: form-data; name="${name}"; filename="${file.getName()}"`);
		ary.push(`Content-Type: ${file.getContentType() || 'application/octet-stream'}; charset=UTF-8`);
		ary.push(``);
		ary.push(file.getBytes());
		ary.push(boundary)
		return ary.join("\r\n");
	}
}

export default Base;