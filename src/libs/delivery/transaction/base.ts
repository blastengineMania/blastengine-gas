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
	public attachments: number[][] = [];

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
		params.payload = JSON.stringify(params.payload);
		return UrlFetchApp.fetch(url, params);
	}

	sendAttachment(url: string, params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const json: GoogleAppsScript.URL_Fetch.Payload = params.payload!
		const data = Utilities.newBlob(JSON.stringify(json), 'application/json', 'data')
		const header = Utilities.newBlob(`--${this.getBoundary()}\r\n`).getBytes();
		const footer = this.createBoundary(data, 'data', true);
		const payload: number[] = [];
		Array.prototype.push.apply(payload, header);
		Array.prototype.push.apply(payload, this.attachments.flat());
		Array.prototype.push.apply(payload, footer);
		params.headers!['Content-Type'] = `multipart/form-data; boundary=${this.getBoundary()}`;
		return UrlFetchApp.fetch(url, {...params, ...{payload}});
	}

	getBoundary(): string {
		return `--BlastengineGAS`;
	}

	createBoundary(file: GoogleAppsScript.Base.Blob, name: string, last: boolean = false): number[] {
		const boundary = `--${this.getBoundary()}`;
		const filename = "=?UTF-8?B?" + Utilities.base64Encode(file.getName(), Utilities.Charset.UTF_8) + "?=";
		const ary = [];
		const headers = [
			`Content-Disposition: form-data; name="${name}"; filename="${filename}"`,
			`Content-Type: ${file.getContentType() || 'application/octet-stream'}; charset=UTF-8`,
			``,
			``,
		].join("\r\n");
		const header = Utilities.newBlob(headers).getBytes();
		const footer = Utilities.newBlob(`\r\n${boundary}${last ? '--' : "\r\n"}`).getBytes();
		Array.prototype.push.apply(header, file.getBytes());
		Array.prototype.push.apply(header, footer);
		return header;
	}
}

export default Base;