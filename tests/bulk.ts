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

function _bulk_delete() {
	const ary = [1195,
		1196,
		1197,
		1198,
		1199,
		1200,
		1201,
		1202,
		1203,
	];
	const up = PropertiesService.getUserProperties();
	new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);
	for (const id of ary) {
		const bulk = new Bulk;
		bulk.delivery_id = id;
		bulk.delete();
	}
}
function _bulk_import() {
	const up = PropertiesService.getUserProperties();
	const b = new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);
	const bulk = new Bulk;
	bulk.fromEmail = 'info@opendata.jp';
	// bulk.setTo('atsushi@moongift.jp');
	bulk.subject = 'テストメール';
	bulk.setText('テキスト本文  __name__');
	const { delivery_id } =  bulk.register();
	const job = bulk.import([
		{email: 'atsushi@moongift.jp', name: 'Atsushi1'},
		{email: 'atsushi2@moongift.jp', name: 'Atsushi2'},
	]);

	while (job.finished() === false) {
		console.log(job);
		console.log('waiting...');
		Utilities.sleep(1 * 1000);
	}
	console.log(job);
	bulk.send();
}

function _bulk_import_file() {
	const fileId = '1Yi3FFei51WAG3vJZfXHHmXlFrl8WYjbv';
	const up = PropertiesService.getUserProperties();
	const b = new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);
	const bulk = new Bulk;
	console.log({fileId});
	console.log('test');
	bulk.fromEmail = 'info@opendata.jp';
	// bulk.setTo('atsushi@moongift.jp');
	bulk.subject = 'テストメール';
	bulk.setText('テキスト本文  __name__');
	const { delivery_id } =  bulk.register();
	const job = bulk.importFile(fileId);
	while (job.finished() === false) {
		console.log(job);
		console.log('waiting...');
		Utilities.sleep(1 * 1000);
	}
	console.log(job);
	bulk.send();
}
