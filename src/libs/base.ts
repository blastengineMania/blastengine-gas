import { BlastEngine } from '../';
import { BEReturnType, RequestParams, SearchCondition, SuccessEmailFormat, SuccessFormat } from '../../types/misc';

class Base {
	static client?: BlastEngine;
	public delivery_id?: number;
	public fromName = '';
	public fromEmail = '';
	public subject = '';
	public encode = 'UTF-8';
	public text_part = '';
	public html_part = '';
	public url?: string;
	public attachments: number[][] = [];
	public file?: number[];

	public status?: string;
	public delivery_time?: Date;
	public updated_time?: Date;
	public created_time?: Date;
	public reservation_time?: Date;
	public delivery_type?: string;
	public open_count?: number;
	public total_count?: number;
	public sent_count?: number;
	public drop_count?: number;
	public soft_error_count?: number;
	public hard_error_count?: number;

	sets(params: {[key: string]: any}): BEReturnType {
		for (const key in params) {
			this.set(key, params[key]);
		}
		return this;
	}

	set(key: string, value: any): BEReturnType {
		switch (key) {
			case 'delivery_id':
				this.delivery_id = value;
				break;
			case 'from':
				this.setFrom(value.email, value.name);
				break;
			case 'status':
				this.status = value;
				break;
			case 'delivery_time':
				this.delivery_time = new Date(value);
				break;
			case 'updated_time':
				this.updated_time = new Date(value);
				break;
			case 'created_time':
				this.created_time = new Date(value);
				break;
			case 'reservation_time':
				this.reservation_time = new Date(value);
				break;
			case 'delivery_type':
				this.delivery_type = value;
				break;
			case 'subject':
				this.subject = value;
				break;
		}
	}

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

	get(): boolean {
		const path = `/deliveries/${this.delivery_id}`
		const res = this.req('get', path) as SuccessEmailFormat;
		this.fromEmail = res.from.email;
		this.fromName = res.from.name;
		this.subject = res.subject;
		this.text_part = res.text_part;
		this.html_part = res.html_part;
		
		if (res.delivery_time) {
			this.delivery_time = new Date(res.delivery_time);
		}
		if (res.updated_time) {
			this.updated_time = new Date(res.updated_time);
		}
		if (res.created_time) {
			this.created_time = new Date(res.created_time);
		}
		if (res.reservation_time) {
			this.reservation_time = new Date(res.reservation_time);
		}
		this.status = res.status;
		this.delivery_type = res.delivery_type;
		if (res.open_count) {
			this.open_count = res.open_count;
		}
		if (res.total_count) {
			this.total_count = res.total_count;
		}
		if (res.sent_count) {
			this.sent_count = res.sent_count;
		}
		if (res.drop_count) {
			this.drop_count = res.drop_count;
		}
		if (res.soft_error_count) {
			this.soft_error_count = res.soft_error_count;
		}
		if (res.hard_error_count) {
			this.hard_error_count = res.hard_error_count;
		}
		return true;
	}

	delete(): SuccessFormat {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.delivery_id!}`;
		const res = this.req('delete', url);
		return res;
	}

	static req(method: GoogleAppsScript.URL_Fetch.HttpMethod, path: string, params?: RequestParams, binary = false): SuccessFormat {
		if (!Base.client) throw 'Client is not found.';
		const obj = new Base;
		return obj.req(method, path, params, binary);
	}

	req(method: GoogleAppsScript.URL_Fetch.HttpMethod, path: string, params?: RequestParams, binary = false): SuccessFormat {
		const url = `https://app.engn.jp/api/v1${path}`;
		try {
			const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
				method,
				headers: {
					'Authorization': `Bearer ${Base.client?.token}`,
				}
			};
			// CSVファイルを添付する場合
			if (params && 'file' in params) {
				this.file = this.createBoundary(params.file!, 'file');
				delete params.file;
			}
			if (['POST', 'PUT', 'PATCH'].indexOf(method.toUpperCase()) > -1) {
				options.payload = params;
			}
			const res = this._getResponse(url, options);
			if (binary) {
				return {
					data: res.getBlob(),
				};
			} else {
				return JSON.parse(res.getContentText()) as SuccessFormat;
			}
		} catch (e: any) {
			if ('response' in e) {
				throw e.response.text;
			}
			throw e;
		}
	}

	_getResponse(url: string, options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.HTTPResponse {
		if (this.file) {
			return this.sendAttachment(url, options);
		}
		if (this.attachments.length > 0) {
			return this.sendAttachment(url, options);
		}
		return this.sendJson(url, options);
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
		Array.prototype.push.apply(payload, this.file || this.attachments.flat());
		Array.prototype.push.apply(payload, footer);
		params.headers!['Content-Type'] = `multipart/form-data; boundary=${this.getBoundary()}`;
		return UrlFetchApp.fetch(url, {...params, ...{payload}});
	}

	getBoundary(): string {
		return `--BlastengineGAS`;
	}

	static searchParamsToQueryString(params?: SearchCondition): string {
		if (!params || Object.keys(params).length === 0) return '';
		if (params.delivery_start && params.delivery_start instanceof Date) {
			params.delivery_start = Utilities.formatDate(params.delivery_start, 'JST', 'yyyy-MM-dd\'T\'HH:mm:ss\'+09:00\'');
		}
		if (params.delivery_end && params.delivery_end instanceof Date) {
			params.delivery_end = Utilities.formatDate(params.delivery_end, 'JST', 'yyyy-MM-dd\'T\'HH:mm:ss\'+09:00\'');
		}
		const queryString = Object.entries(params)
				.flatMap(([k, v]) => Array.isArray(v) ? 
					v.map(e => `${k}[]=${encodeURIComponent(e)}`) :
					`${k}=${encodeURIComponent(v as string | number | boolean)}`).join("&");
		return queryString;
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