import Base from './base';
import { BEReturnType, RequestParams, RequestParamsTransaction } from '../../types/misc';

export default class Transaction extends Base {
	public to = '';
	public cc: string[] = [];
	public bcc: string[] = [];
	
	setTo(email: string | string[]): BEReturnType {
		if (Array.isArray(email)) {
			email = email.join(',');
		}
		this.to = email;
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
		return {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			to: this.to,
			subject: this.subject,
			encode: this.encode,
			text_part: this.text_part,
			html_part: this.html_part,
		};
	}

	send(url?: string, requestParams?: RequestParams): boolean {
		const path = '/deliveries/transaction';
		const res = super.req('post', path, this.params());
		this.delivery_id = res.delivery_id;
		return true;
	}
}