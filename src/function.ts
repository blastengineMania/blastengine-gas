import { BlastEngine, Transaction, Bulk, Log, Mail } from './index';
function init(userId: string, apiKey: string): BlastEngine {
	return new BlastEngine(userId, apiKey);
}

function transaction(): Transaction {
	return new Transaction;
}

function bulk(): Bulk {
	return new Bulk;
}

function log(): typeof Log {
	return Log;
}

function mail(): typeof Mail {
	return Mail;
}
