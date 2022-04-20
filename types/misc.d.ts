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

type Attachment = GoogleAppsScript.Base.Blob;

type BEReturnType = Transaction | Bulk;

type RequestParams = RequestParamsTransaction | RequestParamsBulkBegin | RequestParamsBulkUpdate | RequestParamsBulkCommit;

type SuccessFormat = {
	delivery_id: number
};

type GasRequestParams = {
	headers: {[key: string]: string},
	payload?: string,
	method: string,
}