import { IHttpRequestOptions, IWebhookFunctions } from "n8n-workflow";
import { ReceivedAudioMessageResponse, ReceivedDocumentMessageResponse, ReceivedImageMessageResponse, ReceivedVideoMessageResponse } from "../schemas/webhook.schema";

export interface ProcessMediaMessage {
	data: string,
	mimeType: string,
	fileName: string,
	fileSize: number
}

export class MediaDecoder {
	private static base64ToArrayBuffer(base64: string): ArrayBuffer {
		const binaryString = atob(base64);
		const bytes = new Uint8Array(binaryString.length);
        
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		return bytes.buffer;
	}

	private static async downloadFile(webhookFunctions: IWebhookFunctions, url: string): Promise<ArrayBuffer> {
		const imageOptions: IHttpRequestOptions = {
			method: 'GET',
			url: url,
			encoding: "arraybuffer",
			json: false,
			returnFullResponse: false,
			skipSslCertificateValidation: true
		};

		return await webhookFunctions.helpers.httpRequest(imageOptions);
	}

	private static async decryptAES256CBC(encryptedData: ArrayBuffer, iv: ArrayBuffer, cipherKey: ArrayBuffer): Promise<ArrayBuffer> {
		// Remove the last 10 bytes (MAC) from encrypted data
		const actualEncryptedData = encryptedData.slice(0, -10);

		// Import cipher key for decryption
		const cryptoKey = await crypto.subtle.importKey('raw', cipherKey, { name: 'AES-CBC' }, false, [
			'decrypt'
		]);
		
		// Decrypt using AES-256-CBC
		const decryptedData = await crypto.subtle.decrypt(
			{
				name: 'AES-CBC',
				iv: iv
			},
			cryptoKey,
			actualEncryptedData
		);
		
		return decryptedData;
	}

	private static async downloadAndDecryptMedia(webhookFunctions: IWebhookFunctions, url: string, ivBase64: string, cipherKeyBase64: string): Promise<ArrayBuffer> {
		// Download the encrypted file
		const encryptedData = await this.downloadFile(webhookFunctions, url);
		
		// Convert base64 keys to ArrayBuffer
		const iv = this.base64ToArrayBuffer(ivBase64);
		const cipherKey = this.base64ToArrayBuffer(cipherKeyBase64);
		
		// Decrypt the data
		const decryptedBuffer = await this.decryptAES256CBC(encryptedData, iv, cipherKey);
		
		return decryptedBuffer;
	}

	static async processMediaMessage(
		webhookFunctions: IWebhookFunctions,
		messageData: ReceivedImageMessageResponse | ReceivedAudioMessageResponse | ReceivedVideoMessageResponse | ReceivedDocumentMessageResponse
	): Promise<{ binaryData: ProcessMediaMessage }> {
		const decryptedBuffer = await MediaDecoder.downloadAndDecryptMedia(
			webhookFunctions,
			messageData.url.replace('https://file.kesherwa.dev', 'https://mmg.whatsapp.net'),
			messageData.decodeKeys.iv,
			messageData.decodeKeys.cipherKey
		);
		
		const fileExtension = messageData.format.split('/')[1] || 'bin';
		
		const binaryData: ProcessMediaMessage = {
			data: Buffer.from(decryptedBuffer).toString('base64'),
			mimeType: messageData.format,
			fileName: `${messageData.id}.${fileExtension}`,
			fileSize: decryptedBuffer.byteLength
		};

		return { binaryData };
	}
}