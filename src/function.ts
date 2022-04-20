import { BlastEngine, Transaction, Bulk } from './index';

function init(userId: string, apiKey: string) {
	new BlastEngine(userId, apiKey);
}

function transaction(): Transaction {
	return new Transaction;
}

function bulk(): Bulk {
	return new Bulk;
}
