import Base from './base';
import { BEReturnType, RequestParams, RequestParamsTransaction } from '../../types/misc';

export default class Transaction extends Base {
	public to = '';
	public cc: string[] = [];
	public bcc: string[] = [];
	public insertCode: {
		key: string,
		value: string,
	}[] = [];
	
	setTo(email: string, insertCode?: {[key: string]: string}): BEReturnType {
		this.to = email;
		if (insertCode) {
			for (const key in insertCode){
				this.insertCode?.push({
					key: `__${key}__`,
					value: insertCode[key],
				})
			}
		}
		return this;
	}

	addCc(email: string): BEReturnType {
		this.cc.push(email);
		return this;
	}

	addBcc(email: string): BEReturnType {
		this.bcc.push(email);
		return this;
	}

	params(): RequestParamsTransaction {
		const params: RequestParamsTransaction =  {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			to: this.to,
			insert_code: this.insertCode,
			subject: this.subject,
			encode: this.encode,
			text_part: this.text_part,
			html_part: this.html_part,
		};
		if (this.unsubscribe_email || this.unsubscribe_url) {
			params.list_unsubscribe = {};
			if (this.unsubscribe_email) params.list_unsubscribe.mailto = `mailto:${this.unsubscribe_email}`;
			if (this.unsubscribe_url) params.list_unsubscribe.url = this.unsubscribe_url;
		}
		return params;
	}

	send(url?: string, requestParams?: RequestParams): boolean {
		const path = '/deliveries/transaction';
		const res = super.req('post', path, this.params());
		this.delivery_id = res.delivery_id;
		return true;
	}
}