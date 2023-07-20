import Base from './base';
import Job from './job';
import { BulkUpdateTo, RequestParamsBulkBegin, RequestParamsBulkCommit, RequestParamsBulkUpdate, SuccessFormat } from '../../types/misc';

export default class Bulk extends Base {
	delivery_id?: number;
	to: BulkUpdateTo[] = [];
	date?: Date;

	register(): SuccessFormat {
		const url = '/deliveries/bulk/begin';
		const res = this.req('post', url, this.saveParams());
		this.delivery_id = res.delivery_id;
		this.attachments = []; // reset
		return res;
	}

	update(): SuccessFormat {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const params = this.updateParams();
		if (params.to && params.to.length > 50) {
			const ary = params.to.map(to => {
				const params: {[key: string]: string} = {
					email: to.email,
				};
				(to.insert_code || []).forEach(code => {
					params[code.key.replace(/__(.*?)__/, "$1")] = code.value;
				});
				return params;
			});
			const job = this.import(ary);
			while (!job.finished()) {
				Utilities.sleep(1000);
			}
			return {
				delivery_id: this.delivery_id,
			};
		} else {
			const url = `/deliveries/bulk/update/${this.delivery_id!}`;
			const res = this.req('put', url, params);
			return res;
		}
	}

	send(date?: Date): SuccessFormat {
		if (!date) {
			date = new Date;
			date.setMinutes(date.getMinutes() + 1);
		}
		this.date = date;
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `/deliveries/bulk/commit/${this.delivery_id!}`;
		const res = this.req('patch', url, this.commitParams());
		return res;
	}

	setTo(email: string, insertCode?: {[key: string]: string}): Bulk {
		const params: BulkUpdateTo = { email };
		if (insertCode) {
			params.insert_code = [];
			for (const key in insertCode){
				params.insert_code?.push({
					key: `__${key}__`,
					value: insertCode[key],
				})
			}
		}
		this.to.push(params);
		return this;
	}

	import(ary: {[key: string]: string}[], ignore_errors = false): Job {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const csv = this._toCSV(ary);
		const file = Utilities.newBlob(csv, 'text/csv', 'data.csv');
		return this._import(file, ignore_errors);
	}

	importFile(fileId: string, ignore_errors = false): Job {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const file = DriveApp.getFileById(fileId);
		return this._import(file.getBlob(), ignore_errors);
	}

	_import(file: GoogleAppsScript.Base.Blob, ignore_errors = false): Job {
		const url = `/deliveries/${this.delivery_id!}/emails/import`;
		const res = this.req('post', url, {
			ignore_errors,
			file,
		});
		this.file = undefined;
		return new Job(res.job_id);
	}

	_toCSV(ary: {[key: string]: string}[]): string {
		const headers: string[] = ['email'];
		for (const row of ary) {
			for (const key in row) {
				if (headers.indexOf(key) > -1) continue;
				headers.push(key);
			}
		}
		const lines = ary.map(row => {
			const line: string[] = [];
			for (const key of headers) {
				line.push(`"${row[key].replace(/\"/g, '\"\"') || ''}"`);
			}
			return line.join(',');
		});
		for (const index in headers) {
			if (parseInt(index) > 0) {
				headers[index] = `__${headers[index].replace(/\"/g, '\"\"')}__`;
			}
		}
		return `"${headers.join('","')}"\n${lines.join('\n')}`;
	}
	
	saveParams(): RequestParamsBulkBegin {
		return {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			subject: this.subject,
			encode: this.encode,
			text_part: this.text_part,
			html_part: this.html_part,
		};
	}

	updateParams(): RequestParamsBulkUpdate {
		return {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			subject: this.subject,
			to: this.to,
			text_part: this.text_part,
			html_part: this.html_part,
		};
	}

	commitParams(): RequestParamsBulkCommit {
		const reservation_time = Utilities.formatDate(this.date!, 'JST', "yyyy-MM-dd'T'HH:mm:ss'+09:00'");
		return {
			reservation_time,
		}
	}
}