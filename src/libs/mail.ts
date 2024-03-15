import Base from './base';
import Bulk from './bulk';
import Transaction from './transaction';

import { FindResponse, MailConfig, SearchCondition, SearchResponse } from '../../types/misc';

export default class Mail extends Base {
	private params: MailConfig = {
		to: [],
		cc: [],
		bcc: [],
		text_part: undefined,
		html_part: undefined,
		from: undefined,
		encode: 'UTF-8',
		attachments: [],
		unsubscribe_url: undefined,
		unsubscribe_email: undefined,
	};
	
	static fromJson(params: FindResponse): Transaction | Bulk {
		const mail = params.delivery_type === 'BULK' ? new Bulk : new Transaction;
		mail.sets(params);
		return mail;
	}

	static find(params?: SearchCondition): (Bulk | Transaction)[] {
		const queryString = super.searchParamsToQueryString(params);
		const path = `/deliveries?${queryString}`;
		const res = super.req('get', path);
		const ary = res.data as FindResponse[];
		return ary
			.map(params => Mail.fromJson(params));
	}

	addTo(email: string, insert_code?: {[key: string]: string}): Mail {
		Object.keys(insert_code || {}).forEach(key => {
			if (key.length > 16) throw new Error('Insert code key is limited to 16.');
			if (key.length < 1) throw new Error('Insert code key is required at least 1.');
		});
		this.params.to.push({ email, insert_code });
		return this;
	}

	setEncode(encode: string = 'utf-8'): Mail {
		if (encode.trim() === '') throw new Error('Encode is required.');
		this.params.encode = encode;
		return this;
	}
	
	setFrom(email: string, name = ''): Mail {
		if (!email || email.trim() === '') throw new Error('Email is required.');
		this.params.from = {
			email,
			name,
		};
		return this;
	}

	setSubject(subject: string): Mail {
		if (!subject || subject.trim() === '') throw new Error('Subject is required.');
		this.params.subject = subject;
		return this;
	}

	setText(text: string): Mail {
		if (!text || text.trim() === '') throw new Error('Text is required.');
		this.params.text_part = text;
		return this;
	}

	setHtml(html: string): Mail {
		if (!html || html.trim() === '') throw new Error('Html is required.');
		this.params.html_part = html;
		return this;
	}

	setUnsubscribe({ url, email }: { url?: string; email?: string; }) {
		if (url) this.params.unsubscribe_url = url;
		if (email) this.params.unsubscribe_email = email;
		return this;
	}

	addCc(email: string): Mail {
		if (!email || email.trim() === '') throw new Error('Email is required.');
		if (!this.params.cc) this.params.cc = [];
		this.params.cc.push(email);
		return this;
	}

	addBcc(email: string): Mail {
		if (!email || email.trim() === '') throw new Error('Email is required.');
		if (!this.params.bcc) this.params.bcc = [];
		this.params.bcc.push(email);
		return this;
	}

	addAttachment(file: GoogleAppsScript.Base.Blob): Mail {
		if (!file) throw new Error('File is required.');
		if (!this.params.attachments) this.params.attachments = [];
		this.params.attachments.push(file);
		return this;
	}

	async send(sendTime?: Date): Promise<boolean> {
		// CCまたはBCCがある場合はTransaction × Toの分
		// Toが複数の場合はBulk、Toが1つの場合はTransaction
		if ((this.params.cc && this.params.cc!.length > 0) || (this.params.bcc && this.params.bcc.length > 0)) {
			// CCまたはBCCがある場合は、指定時刻送信はできない
			if (sendTime) throw new Error('CC or BCC is not supported when sending at a specified time.');
			if (this.params.to.length > 1) throw new Error('CC or BCC is not supported when sending to multiple recipients.');
		}
		if (sendTime || this.params.to.length > 1) {
			return this.sendBulk(sendTime);
		}
		return this.sendTransaction();
	}

	private sendBulk(sendTime?: Date): boolean {
		const bulk = new Bulk();
		const { params } = this;
		bulk
			.setFrom(params.from!.email, params.from!.name)
			.setSubject(params.subject)
			.setText(params.text_part)
			.setHtml(params.html_part)
			.setUnsubscribe({url: params.unsubscribe_url, email: params.unsubscribe_email});
		if (params.attachments && params.attachments.length > 0) {
			params.attachments.forEach(attachment => bulk.addAttachment(attachment!));
		}
		bulk.register();
		params.to.map(to => bulk.setTo(to.email, to.insert_code));
		bulk.update();
		bulk.send(sendTime);
		this.delivery_id = bulk.delivery_id;
		return true;
	}

	private sendTransaction(): boolean {
		const transaction = new Transaction();
		const { params } = this;
		try {
			transaction
				.setFrom(params.from!.email, this.params.from!.name)
				.setTo(params.to[0].email, this.params.to[0].insert_code)
				.setSubject(params.subject!)
				.setEncode(params.encode)
				.setText(params.text_part!)
				.setHtml(params.html_part!)
				.setUnsubscribe({url: params.unsubscribe_url, email: params.unsubscribe_email});
			if (params.cc && params.cc.length > 0) {
				params.cc.forEach(cc => transaction.addCc(cc));
			}
			if (params.bcc && params.bcc.length > 0) {
				params.bcc.forEach(bcc => transaction.addBcc(bcc));
			}
			if (params.attachments && params.attachments.length > 0) {
				params.attachments.forEach(attachment => transaction.addAttachment(attachment!));
			}
			transaction.send();
			this.delivery_id = transaction.delivery_id;
		} catch (e) {
			console.log(e);
		}
		return true;
	}
}
