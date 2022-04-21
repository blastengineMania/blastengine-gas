import { BlastEngine } from '../../';
import Transaction from './transaction';
import Base from './transaction/base';
import Bulk from './transaction/bulk';

export default class Delivery {
	static client?: BlastEngine;

	constructor() {
		Base.client = Delivery.client;
	}

	transaction(): Transaction {
		return new Transaction;
	}

	bulk(): Bulk {
		return new Bulk;
	}
}