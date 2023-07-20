import Base from './base';
import Bulk from './bulk';
import Transaction from './transaction';

import { FindResponse, SearchCondition, SearchLogCondition, SearchLogResult, SearchResponse } from '../../types/misc';

export default class Log extends Base {
	email?: string;
	maillogId?: number;
	openTime?: Date;
	lastResponseMessage?: string;
	lastResponseCode?: string;
	deliveryId?: number;
	deliveryType?: string;
	status?: string;
	deliveryTime?: Date;
	createdTime?: Date;
	updatedTime?: Date;

	static fromJson(params: SearchLogResult): Log {
		const obj = new Log;
		obj.sets(params);
		return obj;
	}

	set(key: string, value: any): Log {
		switch (key) {
			case 'delivery_id':
				this.deliveryId = value;
				break;
			case 'delivery_type':
				this.deliveryType = value;
				break;
			case 'status':
				this.status = value;
				break;
			case 'delivery_time':
				if (value) this.deliveryTime = new Date(value);
				break;
			case 'last_response_code':
				this.lastResponseCode = value;
				break;
			case 'last_response_message':
				this.lastResponseMessage = value;
				break;
			case 'open_time':
				if (value) this.openTime = new Date(value);
				break;
			case 'created_time':
				if (value) this.createdTime = new Date(value);
				break;
			case 'updated_time':
				if (value) this.updatedTime = new Date(value);
				break;
			case 'maillog_id':
				this.maillogId = value;
				break;
			case 'email':
				this.email = value;
				break;
		}
		return this;
	}			

	static find(params?: SearchLogCondition): Log[] {
		const queryString = super.searchParamsToQueryString(params);
		const path = `/logs/mails/results?${queryString}`;
		const res = super.req('get', path);
		const ary = res.data as SearchLogResult[];
		return ary.map(params => Log.fromJson(params));
	}	
}
