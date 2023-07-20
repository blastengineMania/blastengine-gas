import {BlastEngine, Log }  from '../src/index';
import { SearchLogCondition } from '../types/misc';
function _test_find() {
	const up = PropertiesService.getUserProperties();
	const b = new BlastEngine(up.getProperty('API_USER')!, up.getProperty('API_KEY')!);

	const params: SearchLogCondition = {
		delivery_start: new Date('2023-06-01'),
		delivery_end: new Date,
		delivery_type: ['BULK'],
		status: ['EDIT', 'SENT'],
	};
	try {
		const ary = Log.find(params);
		console.log(ary[0]);
		console.log(ary[0] instanceof Log);
	} catch (e) {
		console.log(e);
	}
}