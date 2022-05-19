import {BlastEngine, Bulk}  from '../src/index';
function _bulk_test() {
	const up = PropertiesService.getUserProperties();
	const b = new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);
	const bulk = new Bulk;
	bulk.fromEmail = 'info@opendata.jp';
	// bulk.setTo('atsushi@moongift.jp');
	bulk.subject = 'テストメール';
	bulk.setText('テキスト本文  __name__');
	const { delivery_id } =  bulk.register();
	bulk.setTo('atsushi@moongift.jp', {
		'name': 'Atsushi1',
	});
	bulk.setTo('atsushi2@moongift.jp', {
		'name': 'Atsushi2',
	});

	bulk.update();
	bulk.delete();
	// const res2 = bulk.send();
	console.log(delivery_id);
}
