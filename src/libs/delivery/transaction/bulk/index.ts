import { BlastEngine } from '../../../../';
import Base from '../base';

export default class Bulk extends Base {
	delivery_id?: number;
	to: BulkUpdateTo[] = [];
	date?: Date;

	register(): SuccessFormat {
		const url = 'https://app.engn.jp/api/v1/deliveries/bulk/begin';
		const res = this.req('post', url, this.saveParams());
		this.delivery_id = res.delivery_id;
		return res;
	}

	update(): SuccessFormat {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `https://app.engn.jp/api/v1/deliveries/bulk/update/${this.delivery_id!}`;
		const res = this.req('put', url, this.updateParams());
		return res;
	}

	send(date?: Date): SuccessFormat {
		if (!date) {
			date = new Date;
			date.setMinutes(date.getMinutes() + 1);
		}
		this.date = date;
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `https://app.engn.jp/api/v1/deliveries/bulk/commit/${this.delivery_id!}`;
		const res = this.req('patch', url, this.commitParams());
		return res;
	}

	delete(): SuccessFormat {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `https://app.engn.jp/api/v1/deliveries/${this.delivery_id!}`;
		const res = this.req('delete', url);
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