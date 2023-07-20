declare module '*/config.json' {
  interface ConfigData {
    userId: string;
    apiKey: string;
		from: {
			email: string;
			name: string;
		},
		to: string;
  }

  const value: ConfigData;
  export = value;
}

type RequestParamsBulkBegin = {
	from: {
		email: string,
		name: string,
	},
	subject: string,
	encode: string,
	text_part: string,
	html_part: string,
};

type InsertCode = {
  key: string,
  value: string,
};

type BulkUpdateTo = {
  email: string,
  insert_code?: InsertCode[],
}

type RequestParamsBulkUpdate = {
	from: {
		email: string,
		name: string,
	},
  to: BulkUpdateTo[],
	subject: string,
	text_part: string,
	html_part: string,
};

type RequestParamsBulkCommit = {
  reservation_time: string,
}

type RequestParamsTransaction = {
	from: {
		email: string,
		name: string,
	},
	to: string,
	subject: string,
	encode: string,
	text_part: string,
	html_part: string,
};

type RequestParamsBulkImport = {
	file?: GoogleAppsScript.Base.Blob,
	ignore_errors: boolean,
};

type Attachment = GoogleAppsScript.Base.Blob;

type BEReturnType = Transaction | Bulk;

type RequestParams = RequestParamsTransaction | 
	RequestParamsBulkBegin | 
	RequestParamsBulkUpdate | 
	RequestParamsBulkCommit |
	RequestParamsBulkImport;

type SuccessFormat = {
	delivery_id?: number,
	job_id?: number,
	data?: GoogleAppsScript.Base.Blob | FindResponse[] | SearchLogResult[],
};

type FindResponse = {
	delivery_id: number,
	from: {
		email: string,
		name: string,
	},
	status: string,
	delivery_time: string,
	updated_time: string,
	created_time: string,
	reservation_time: string,
	delivery_type: string,
	subject: string,
}

type JobResponseFormat = {
	percentage: number,
	status: string,
	success_count: number,
	failed_count: number,
	total_count: number,
	error_file_url: string,
};

type GasRequestParams = {
	headers: {[key: string]: string},
	payload?: string,
	method: string,
}

type SuccessEmailFormat = {
	delivery_id: number,
	from: {
		email: string,
		name: string,
	},
	status: string,
	delivery_time: string,
	updated_time: string,
	created_time: string,
	reservation_time: string,
	text_part: string,
	html_part: string,
	delivery_type: string,
	subject: string
	attaches: dynamic[],
	open_count: number,
	total_count: number,
	sent_count: number,
	drop_count: number,
	soft_error_count: number,
	hard_error_count: number,
}

export type SendStatus = 'EDIT' | 'IMPORTING' | 'RESERVE' | 'WAIT'	| 'SENDING' | 'SENT' | 'FAILED';
export type DeliveryType = 'TRANSACTION' | 'BULK' | 'SMTP' | 'ALL';
export type SortType = 'delivery_time:desc' | 'delivery_time:asc' | 'updated_time:desc' | 'updated_time:asc';
export type ResponseCode = 250 | 421 | 450 | 451 | 452 | 453 | 454 | 500 | 521 | 530 | 550 | 551 | 552 | 553 | 554;

export type SearchCondition = {
	text_part?: string,
	html_part?: string,
	subject?: string,
	from?: string,
	status?: SendStatus[],
	delivery_type?: DeliveryType[],
	delivery_start?: Date | string,
	delivery_end?: Date | string,
	size?: number,
	page?: number,
	sort?: SortType,
}

export type SearchResponse = {
	data: SearchResult[],
};

export type SearchResult = {
	updated_time: string,
  created_time: string,
  delivery_type: string,
  subject: string,
  delivery_id: number,
  from: {
		email: string,
		name: string,
	}
  reservation_time?: string,
  delivery_time: string,
  status: string,
}

export type SearchLogCondition = {
	anchor?: number,
	count?: number,
	email?: string,
	delivery_type?: DeliveryType[],
	delivery_id?: number,
	status?: SendStatus[],
	response_code?: ResponseCode[],
	delivery_start?: Date | string,
	delivery_end?: Date | string,
};

export type SearchLogResult = {
	delivery_time: string,
	delivery_id: number,
	maillog_id: number,
	delivery_type: string,
	email: string,
	status: string,
	last_response_code: string,
	last_response_message: string,
	open_time: string,
	created_time: string,
	updated_time: string,
};

export type MailConfig = {
	to: {
		email: string,
		insert_code?: {[key: string]: string},
	}[],
	cc?: string[],
	bcc?: string[],
	subject?: string,
	text_part?: string,
	html_part?: string,
	attachments?: Attachment[] = [],
	encode?: string,
	from?: {
		email: string,
		name: string,
	}
};
