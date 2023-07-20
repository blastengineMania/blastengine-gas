import Base from './libs/base';
import Transaction from './libs/transaction';
import Bulk from './libs/bulk';
import Mail from './libs/mail';
import Log from './libs/log';

class BlastEngine {
	userId?: string;
	apiKey?: string;
	token?: string;

	constructor(userId: string, apiKey: string) {
		this.userId = userId;
		this.apiKey = apiKey;
		this.generateToken();
		Base.client = this;
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

export { BlastEngine, Bulk, Transaction, Mail, Log };
