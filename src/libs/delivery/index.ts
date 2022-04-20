import { BlastEngine } from '../../';
import Transaction from './transaction';
import Base from './transaction/base';

export default class Delivery {
	static client?: BlastEngine;

	constructor() {
		Base.client = Delivery.client;
	}

	transaction(): Transaction {
		return new Transaction;
	}
}