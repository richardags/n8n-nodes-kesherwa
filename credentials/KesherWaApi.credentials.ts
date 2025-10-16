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
			placeholder: 'eyJhbGc...your-token-here',
		},
		{
			displayName: 'Bot ID',
			name: 'botId',
			type: 'string',
			typeOptions: { password: false },
			default: '',
			placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
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