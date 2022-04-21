import {BlastEngine, Transaction}  from '../src/index';
function _transaction_test_() {
	const up = PropertiesService.getUserProperties();
	const b = new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);
	const transaction = new Transaction;
	transaction.fromEmail = 'info@opendata.jp';
	transaction.setTo('atsushi@moongift.jp');
	transaction.subject = 'テストメール';
	transaction.setText('テキスト本文');
	const res = transaction.send();
	console.log(res);
}

function _transaction_attachment_test() {
	const up = PropertiesService.getUserProperties();
	const b = new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);
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
function test() {
	const up = PropertiesService.getUserProperties();
	const b = new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);
  const metadata = {
  "from": {
    "email": "info@opendata.jp",
    "name": "送信者サンプル"
  },
  "to": "atsushi@moongift.jp",
  "subject": "テスト件名",
  "text_part": "テスト配信",
  };
  const response = UrlFetchApp.fetch('https://www.moongift.jp/logo.jpg');
  var form = FetchApp.createFormData(); // Create form data
  form.append(
    "data",
    Utilities.newBlob(JSON.stringify(metadata), "application/json")
  );
  form.append("file", response.getBlob());
  var url = "https://app.engn.jp/api/v1/deliveries/transaction";
  b.generateToken();
  var params = {
    method: "POST",
    headers: { Authorization: "Bearer " + b.token },
    body: form,
  };
  var res = FetchApp.fetch(url, params);
  Logger.log(res);
}
