import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KesherWaApi implements ICredentialType {
	name = 'kesherWaApi';
	documentationUrl = 'https://app.kesherwa.dev/dashboard/docs';
	displayName = 'KesherWA Bot API';
	properties: INodeProperties[] = [
		{
			displayName: 'Bot Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib3RJZCI6IjlhMDNiM2M1LWY3MGItNDEyNi1hMTM2LTExYmI2MjgwYmRlMyIsImlhdCI6MTc1OTM2ODk4OSwiZXhwIjoxNzkwOTA0OTg5fQ.de8dRvO7MgrOmevdlW9lmnGTeADgigbaGiKkSlYbOPQ',
		},
		{
			displayName: 'Bot ID',
			name: 'botId',
			type: 'string',
			typeOptions: { password: false },
			default: '',
			placeholder: '9a03b3c5-f70b-4126-a136-11bb6280bde3',
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'skipSslCertificateValidation',
			type: 'boolean',
			default: false,
			description: 'Whether to connect even if SSL certificate validation is not possible',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.token}}',
			}
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.botId}}.kesherwa.dev',
			url: '/api/whatsapp/credentials/check',
			method: 'GET',
            skipSslCertificateValidation: '={{$credentials.skipSslCertificateValidation}}'
		}
	};
}