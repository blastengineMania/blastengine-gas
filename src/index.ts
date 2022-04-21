import Delivery from './libs/delivery/';
import Transaction from './libs/delivery/transaction';
import Bulk from './libs/delivery/transaction/bulk';
import Base from './libs/delivery/transaction/base';

class BlastEngine {
	userId?: string;
	apiKey?: string;
	token?: string;

	constructor(userId: string, apiKey: string) {
		this.userId = userId;
		this.apiKey = apiKey;
		this.generateToken();
		Delivery.client = this;
		Base.client = this;
		Transaction.client = this;
		Bulk.client = this;
	}

	generateToken(): string {
		if (!this.userId) throw 'There is no userId';
		if (!this.apiKey) throw 'There is no apiKey';
		const str = `${this.userId}${this.apiKey}`;
		const signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
		const hashHex = signature
			.map(byte => {
					const v = (byte < 0) ? 256 + byte : byte;
					return ("0" + v.toString(16)).slice(-2);
			})
			.join("");
		this.token = Utilities.base64Encode(hashHex);
		return this.token;
	}
}

export { BlastEngine, Bulk, Transaction };
