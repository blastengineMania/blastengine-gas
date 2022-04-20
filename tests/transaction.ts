import {BlastEngine, Transaction}  from '../src/index';
new BlastEngine('YOUR_USER_NAME', 'YOUR_API_KEY');

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
	const transaction = new Transaction;
	transaction.fromEmail = 'info@opendata.jp';
	transaction.setTo('atsushi@moongift.jp');
	transaction.subject = 'テストメール';
	transaction.setText('テキスト本文');
	transaction.addAttachment(Utilities.newBlob('Hire me!', 'text/plain', 'resume1.txt'));
	transaction.addAttachment(Utilities.newBlob('Hire me, again!', 'text/plain', 'resume2.txt'));
	const res = transaction.send();
	console.log(res);
}