import { BlastEngine } from '../../../../';
import Base from '../base';

export default class Bulk extends Base {
	delivery_id?: number;
	to: BulkUpdateTo[] = [];
	date?: Date;

	async register(): Promise<SuccessFormat> {
		const url = 'https://app.engn.jp/api/v1/deliveries/bulk/begin';
		const res = await this.req('post', url, this.saveParams());
		this.delivery_id = res.delivery_id;
		return res;
	}

	async update(): Promise<SuccessFormat> {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `https://app.engn.jp/api/v1/deliveries/bulk/update/${this.delivery_id!}`;
		const res = await this.req('put', url, this.updateParams());
		return res;
	}

	async send(date?: Date): Promise<SuccessFormat> {
		if (!date) {
			date = new Date;
			date.setMinutes(date.getMinutes() + 1);
		}
		this.date = date;
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `https://app.engn.jp/api/v1/deliveries/bulk/commit/${this.delivery_id!}`;
		const res = await this.req('patch', url, this.commitParams());
		return res;
	}

	async delete(): Promise<SuccessFormat> {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `https://app.engn.jp/api/v1/deliveries/${this.delivery_id!}`;
		const res = await this.req('delete', url);
		return res;
	}

	setTo(email: string, insertCode?: InsertCode[] | InsertCode): Bulk {
		const params: BulkUpdateTo = { email };
		if (insertCode) {
			if (Array.isArray(insertCode)) {
				params.insert_code = insertCode;
			} else {
				params.insert_code = [insertCode];
			}
		}
		this.to.push(params);
		return this;
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
		return {
			reservation_time: Utilities.formatDate(this.date!, 'JST', '%FT%T%z')
		}
	}
}