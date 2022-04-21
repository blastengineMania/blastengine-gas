import {BlastEngine, Transaction}  from '../src/index';
const up = PropertiesService.getUserProperties();
new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);

function _transaction_test_() {
	const transaction = new Transaction;
	transaction.fromEmail = 'info@opendata.jp';
	transaction.setTo('atsushi@moongift.jp');
	transaction.subject = 'テストメール';
	transaction.setText('テキスト本文');
	const res = transaction.send();
	console.log(res);
}

function _transaction_attachment_test() {
	const response = UrlFetchApp.fetch('https://www.moongift.jp/logo.jpg');
	const transaction = new Transaction;
	transaction.fromEmail = 'info@opendata.jp';
	transaction.setTo('atsushi@moongift.jp');
	transaction.subject = 'テストメール';
	transaction.setText('テキスト本文');
	transaction.addAttachment(response.getBlob());
	transaction.addAttachment(Utilities.newBlob('Hire me, again!', 'text/plain', 'resume2.txt'));
	const res = transaction.send();
	console.log(res);
}