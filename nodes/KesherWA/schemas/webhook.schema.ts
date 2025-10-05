export interface ReceivedTextMessageResponse {
	id: string,
	text: string,
}

export interface ReceivedImageMessageResponse {
	id: string,
	caption: string,
	format: string,
	url: string,
	decodeKeys: {
		iv: string,
		cipherKey: string,
		macKey: string,
	},
	fileSha256: string,
}

export interface ReceivedVideoMessageResponse {
	id: string,
	caption: string,
	format: string,
	url: string,
	decodeKeys: {
		iv: string,
		cipherKey: string,
		macKey: string,
	},
	fileSha256: string,
}

export interface ReceivedAudioMessageResponse {
	id: string,
	caption: string,
	format: string,
	url: string,
	decodeKeys: {
		iv: string,
		cipherKey: string,
		macKey: string,
	},
	fileSha256: string,
}

export interface ReceivedDocumentMessageResponse {
	id: string,
	caption: string,
	format: string,
	url: string,
	decodeKeys: {
		iv: string,
		cipherKey: string,
		macKey: string,
	},
	fileSha256: string,
}

export interface ReceivedReactionMessageResponse {
	id: string,
	messageId: string,
	emoji: string,
}

export interface ReceivedLocationMessageResponse {
	id: string,
	degreesLatitude: string,
	degreesLongitude: string,
}

export enum EventType {
	 TEXT = 'text',
	 IMAGE = 'image',
	 DOCUMENT = 'document',
	 VIDEO = 'video',
	 AUDIO = 'audio',
	 REACTION = 'reaction',
	 LOCATION = 'location'
}

export interface WebhookResponse {
	event: EventType,
	from: {
		remoteJid: string,
		name: string,
	},
	data: ReceivedTextMessageResponse | ReceivedImageMessageResponse | ReceivedAudioMessageResponse| ReceivedVideoMessageResponse | ReceivedDocumentMessageResponse | ReceivedReactionMessageResponse | ReceivedLocationMessageResponse,
	timestamp: string,
}