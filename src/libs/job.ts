import Base from './base';
import { JobResponseFormat } from '../../types/misc';

export default class Job extends Base {
	id?: number;
	public total_count?: number;
  public percentage?: number;
  public success_count?: number;
  public failed_count?: number;
  public status?: string;
	public report?: string;

	constructor(job_id?: number) {
		super();
		this.id = job_id;
	}

	_get(): JobResponseFormat {
		if (!this.id) throw 'Job id is not found.';
		const url = `/deliveries/-/emails/import/${this.id}`;
		const res = this.req('get', url) as JobResponseFormat;
		this.total_count = res.total_count;
		this.percentage = res.percentage;
		this.success_count = res.success_count;
		this.failed_count = res.failed_count;
		this.status = res.status;
		return res;
	}

	isError(): boolean {
		const report = this.download();
		return report !== '';
	}
	
	download(): string {
		if (!this.id) throw 'Job id is not found.';
		if (this.report) return this.report;
		const url = `/deliveries/-/emails/import/${this.id}/errorinfo/download`;
		try {
			const buffer = this.req('get', url, undefined, true);
			const data = buffer.data! as unknown;
			const unzipFiles = Utilities.unzip(data as GoogleAppsScript.Base.Blob);
			return unzipFiles[0].getDataAsString();
		} catch (e) {
			const error = JSON.parse(e as string);
			if (error &&
					error.error_messages &&
					error.error_messages.main &&
					error.error_messages.main[0] === 'no data found.'
				) {
				return '';
			}
			throw e;
		}
	}

	finished(): boolean {
		this._get();
		return this.percentage === 100;
	}
};
