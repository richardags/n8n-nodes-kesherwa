export interface SendTextMessageResponse {
	id: string,
	remoteJid: string,
	text: string,
}

export interface SendImageMessageResponse {
	id: string,
	remoteJid: string
}

export interface SendAudioMessageResponse {
	id: string,
	remoteJid: string
}


export interface SendVideoMessageResponse {
	id: string,
	remoteJid: string
}

export interface SendDocumentMessageResponse {
	id: string,
	remoteJid: string,
	extension: string,
}

export interface SendReactionMessageResponse {
	id: string,
	remoteJid: string,
	messageId: string,
	emoji: string
}

export interface DeleteReactionMessageResponse {
	id: string,
	remoteJid: string,
	messageId: string
}

export interface SendLocationMessageResponse {
	id: string,
	remoteJid: string,
	degreesLatitude: number ,
	degreesLongitude: number
}