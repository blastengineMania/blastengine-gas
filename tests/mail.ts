import {BlastEngine, Mail, Transaction, Bulk}  from '../src/index';
import { SearchCondition } from '../types/misc';
const up = PropertiesService.getUserProperties();
const b = new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);

function _test_find() {
	const params: SearchCondition = {
		delivery_type: ['BULK'],
		status: ['EDIT'],
	};
	try {
		const ary = Mail.find(params);
		ary.forEach((m) => m.delete());
	} catch (e) {
		console.log(e);	
	}
}

function _test_send() {
	const mail = new Mail;
	mail
		.setSubject('テストメール')
		.setText('本文 __name1__')
		.setFrom('info@opendata.jp')
		.addAttachment(Utilities.newBlob('Hire me!', 'text/plain', 'resume.txt'))
		.addTo('atsushi@moongift.co.jp', {name1: 'Atsushi'});
	mail.send();
	console.log(mail.delivery_id);
}

function _testSendWithUnsubscribeUrl() {
	try {
		const mail = new Mail;
		mail
			.setSubject('テストメール')
			.setText('本文 __name1__')
			.setFrom('info@opendata.jp')
			.addAttachment(Utilities.newBlob('Hire me!', 'text/plain', 'resume.txt'))
			.setUnsubscribe({url: 'https://example.com/unsubscribe/__hash__'})
			.addTo('atsushi@moongift.co.jp', {name1: 'Atsushi', hash: '123456'});
		const res = mail.send();
		console.log({ res });
		console.log(mail.delivery_id);
	} catch (e) {
		console.log(e);
	}
}

function _testSendWithUnsubscribeEmail() {
	const mail = new Mail;
	mail
		.setSubject('テストメール')
		.setText('本文 __name1__')
		.setFrom('info@opendata.jp')
		.addAttachment(Utilities.newBlob('Hire me!', 'text/plain', 'resume.txt'))
		.setUnsubscribe({email: 'unsubscribe+__hash__@moongift.co.jp'})
		.addTo('atsushi@moongift.co.jp', {name1: 'Atsushi', hash: '123456'});
	mail.send();
	console.log(mail.delivery_id);
}

function _testSendWithUnsubscribeEmailAndUrl() {
	try {
		const mail = new Mail;
		mail
			.setSubject('テストメール')
			.setText('本文 __name1__')
			.setFrom('info@opendata.jp')
			.addAttachment(Utilities.newBlob('Hire me!', 'text/plain', 'resume.txt'))
			.setUnsubscribe({email: 'unsubscribe+__hash__@moongift.co.jp', url: 'https://example.com/unsubscribe/__hash__'})
			.addTo('atsushi@moongift.co.jp', {name1: 'Atsushi', hash: '123456'});
		const res = mail.send();
		console.log(res);
		console.log(mail.delivery_id);
	} catch (e) {
		console.log(e);
	}
}

function _test_send_bulk() {
	const mail = new Mail;
	mail
		.setSubject('テストメール')
		.setText('本文 __name1__')
		.setFrom('info@opendata.jp')
		.setUnsubscribe({url: 'https://example.com/unsubscribe/__hash__'})
		.addAttachment(Utilities.newBlob('Hire me!', 'text/plain', 'resume.txt'));
	for (let i = 0; i < 60; i++) {
		mail.addTo(`atsushi+${i}@moongift.co.jp`, {name1: `User ${i}`, hash: i.toString()});
	}
	try {
		mail.send();
	} catch (e) {
		console.log(e);
	}
	console.log(mail.delivery_id);
}
