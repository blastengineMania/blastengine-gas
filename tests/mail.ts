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

function _test_send_bulk() {
	const mail = new Mail;
	mail
		.setSubject('テストメール')
		.setText('本文 __name1__')
		.setFrom('info@opendata.jp')
		.addAttachment(Utilities.newBlob('Hire me!', 'text/plain', 'resume.txt'));
	for (let i = 0; i < 60; i++) {
		mail.addTo(`atsushi${i}@moongift.co.jp`, {name1: `User ${i}`});
	}
	try {
		mail.send();
	} catch (e) {
		console.log(e);
	}
	console.log(mail.delivery_id);
}
