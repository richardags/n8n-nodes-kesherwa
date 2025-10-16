import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from "n8n-workflow";
import { DeleteReactionMessageResponse, SendAudioMessageResponse, SendDocumentMessageResponse, SendImageMessageResponse, SendLocationMessageResponse, SendReactionMessageResponse, SendTextMessageResponse, SendVideoMessageResponse } from "../schemas/whatsapp.schema";

export class SendMessage {

    private static async downloadFile(executeFunctions: IExecuteFunctions, url: string, skipSslCertificateValidation: boolean): Promise<ArrayBuffer> {
        const imageOptions: IHttpRequestOptions = {
            method: 'GET',
            url: url,
            encoding: "arraybuffer",
            json: false,
            returnFullResponse: false,
            skipSslCertificateValidation: skipSslCertificateValidation
        };

        return await executeFunctions.helpers.httpRequest.call(executeFunctions, imageOptions);
	}

    static async sendTextMessage(executeFunctions: IExecuteFunctions, itemIndex: number, botId: string, remoteJid: string): Promise<INodeExecutionData> {
        const skipSslCertificateValidation = executeFunctions.getNodeParameter('skipSslCertificateValidation', itemIndex) as boolean;
        const text = executeFunctions.getNodeParameter('textText', itemIndex) as string;

        const options: IHttpRequestOptions = {
            method: 'POST',
            body: { remoteJid, text },
            baseURL: `https://${botId}.kesherwa.dev`,
            url: '/api/whatsapp/message',
            json: true,
            skipSslCertificateValidation: skipSslCertificateValidation
        };
        
        const responseData = await executeFunctions.helpers.httpRequestWithAuthentication.call(executeFunctions, 'kesherWaApi', options);

        const dataTextResponse: SendTextMessageResponse = {
            id: responseData.data.id,
            remoteJid: responseData.data.remoteJid,
            text: responseData.data.text
        }
        
        return {
            json: {
                success: responseData.status,
                data: dataTextResponse,
                message: responseData.msg
            },
            pairedItem: itemIndex
        };
    }

    static async sendImageMessage(executeFunctions: IExecuteFunctions, itemIndex: number, botId: string, remoteJid: string): Promise<INodeExecutionData> {
        const skipSslCertificateValidation = executeFunctions.getNodeParameter('skipSslCertificateValidation', itemIndex) as boolean;
        const inputDataType = executeFunctions.getNodeParameter('inputDataType', itemIndex) as string;
        let buffer: Buffer;

        if(inputDataType == 'url'){
            const url = executeFunctions.getNodeParameter('inputDataUrl', itemIndex) as string;
            const arrayBuffer = await this.downloadFile(executeFunctions, url, skipSslCertificateValidation);
            buffer = Buffer.from(arrayBuffer as ArrayBuffer);
        }else /*if (inputDataType == 'binary')*/{
            const binaryPropertyName = executeFunctions.getNodeParameter('inputDataBuffer', itemIndex) as string;
            buffer = await executeFunctions.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
        }

        const options: IHttpRequestOptions = {
            method: 'POST',
            headers: { 'remote-jid': remoteJid },
            body: buffer,
            baseURL: `https://${botId}.kesherwa.dev`,
            url: '/api/whatsapp/image',
            json: false,
            skipSslCertificateValidation: skipSslCertificateValidation
        };
        
        const responseData = await executeFunctions.helpers.httpRequestWithAuthentication.call(executeFunctions, 'kesherWaApi', options);

        const dataResponse: SendImageMessageResponse = {
            id: responseData.data.id,
            remoteJid: responseData.data.remoteJid
        }
        
        return {
            json: {
                success: responseData.status,
                data: dataResponse,
                message: responseData.msg
            },
            pairedItem: itemIndex
        };
    }

    static async sendAudioMessage(executeFunctions: IExecuteFunctions, itemIndex: number, botId: string, remoteJid: string): Promise<INodeExecutionData> {
        const skipSslCertificateValidation = executeFunctions.getNodeParameter('skipSslCertificateValidation', itemIndex) as boolean;
        const inputDataType = executeFunctions.getNodeParameter('inputDataType', itemIndex) as string;
        let buffer: Buffer;

        if(inputDataType == 'url'){
            const url = executeFunctions.getNodeParameter('inputDataUrl', itemIndex) as string;
            const arrayBuffer = await this.downloadFile(executeFunctions, url, skipSslCertificateValidation);
            buffer = Buffer.from(arrayBuffer as ArrayBuffer);
        }else /*if (inputDataType == 'binary')*/{
            const binaryPropertyName = executeFunctions.getNodeParameter('inputDataBuffer', itemIndex) as string;
            buffer = await executeFunctions.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
        }

        const options: IHttpRequestOptions = {
            method: 'POST',
            headers: { 'remote-jid': remoteJid },
            body: buffer,
            baseURL: `https://${botId}.kesherwa.dev`,
            url: '/api/whatsapp/audio',
            json: false,
            skipSslCertificateValidation: skipSslCertificateValidation
        };
        
        const responseData = await executeFunctions.helpers.httpRequestWithAuthentication.call(executeFunctions, 'kesherWaApi', options);

        const dataResponse: SendAudioMessageResponse = {
            id: responseData.data.id,
            remoteJid: responseData.data.remoteJid
        }
        
        return {
            json: {
                success: responseData.status,
                data: dataResponse,
                message: responseData.msg
            },
            pairedItem: itemIndex
        };
    }

    static async sendVideoMessage(executeFunctions: IExecuteFunctions, itemIndex: number, botId: string, remoteJid: string): Promise<INodeExecutionData> {
        const skipSslCertificateValidation = executeFunctions.getNodeParameter('skipSslCertificateValidation', itemIndex) as boolean;
        const inputDataType = executeFunctions.getNodeParameter('inputDataType', itemIndex) as string;
        let buffer: Buffer;

        if(inputDataType == 'url'){
            const url = executeFunctions.getNodeParameter('inputDataUrl', itemIndex) as string;
            const arrayBuffer = await this.downloadFile(executeFunctions, url, skipSslCertificateValidation);
            buffer = Buffer.from(arrayBuffer as ArrayBuffer);
        }else /*if (inputDataType == 'binary')*/{
            const binaryPropertyName = executeFunctions.getNodeParameter('inputDataBuffer', itemIndex) as string;
            buffer = await executeFunctions.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
        }

        const options: IHttpRequestOptions = {
            method: 'POST',
            headers: { 'remote-jid': remoteJid },
            body: buffer,
            baseURL: `https://${botId}.kesherwa.dev`,
            url: '/api/whatsapp/video',
            json: false,
            skipSslCertificateValidation: skipSslCertificateValidation
        };
        
        const responseData = await executeFunctions.helpers.httpRequestWithAuthentication.call(executeFunctions, 'kesherWaApi', options);

        const dataResponse: SendVideoMessageResponse = {
            id: responseData.data.id,
            remoteJid: responseData.data.remoteJid
        }
        
        return {
            json: {
                success: responseData.status,
                data: dataResponse,
                message: responseData.msg
            },
            pairedItem: itemIndex
        };
    }

    static async sendDocumentMessage(executeFunctions: IExecuteFunctions, itemIndex: number, botId: string, remoteJid: string): Promise<INodeExecutionData> {
        const skipSslCertificateValidation = executeFunctions.getNodeParameter('skipSslCertificateValidation', itemIndex) as boolean;
        const inputDataType = executeFunctions.getNodeParameter('inputDataType', itemIndex) as string;
        let buffer: Buffer;

        if(inputDataType == 'url'){
            const url = executeFunctions.getNodeParameter('inputDataUrl', itemIndex) as string;
            const arrayBuffer = await this.downloadFile(executeFunctions, url, skipSslCertificateValidation);
            buffer = Buffer.from(arrayBuffer as ArrayBuffer);
        }else /*if (inputDataType == 'binary')*/{
            const binaryPropertyName = executeFunctions.getNodeParameter('inputDataBuffer', itemIndex) as string;
            buffer = await executeFunctions.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
        }

        const extension = executeFunctions.getNodeParameter('documentExtension', itemIndex) as string;

        const options: IHttpRequestOptions = {
            method: 'POST',
            headers: { 'remote-jid': remoteJid, 'extension': extension },
            body: buffer,
            baseURL: `https://${botId}.kesherwa.dev`,
            url: '/api/whatsapp/document',
            json: false,
            skipSslCertificateValidation: skipSslCertificateValidation
        };
        
        const responseData = await executeFunctions.helpers.httpRequestWithAuthentication.call(executeFunctions, 'kesherWaApi', options);

        const dataResponse: SendDocumentMessageResponse = {
            id: responseData.data.id,
            remoteJid: responseData.data.remoteJid,
            extension: responseData.data.extension
        }
        
        return {
            json: {
                success: responseData.status,
                data: dataResponse,
                message: responseData.msg
            },
            pairedItem: itemIndex
        };
    }

    static async sendLocationMessage(executeFunctions: IExecuteFunctions, itemIndex: number, botId: string, remoteJid: string): Promise<INodeExecutionData> {
        const skipSslCertificateValidation = executeFunctions.getNodeParameter('skipSslCertificateValidation', itemIndex) as boolean;
        const degreesLatitude = executeFunctions.getNodeParameter('locationDegreesLatitude', itemIndex) as number;
        const degreesLongitude = executeFunctions.getNodeParameter('locationDegreesLongitude', itemIndex) as number;

        const options: IHttpRequestOptions = {
            method: 'POST',
            body: { remoteJid, degreesLatitude, degreesLongitude },
            baseURL: `https://${botId}.kesherwa.dev`,
            url: '/api/whatsapp/location',
            json: true,
            skipSslCertificateValidation: skipSslCertificateValidation
        };
        
        const responseData = await executeFunctions.helpers.httpRequestWithAuthentication.call(executeFunctions, 'kesherWaApi', options);

        const dataTextResponse: SendLocationMessageResponse = {
            id: responseData.data.id,
            remoteJid: responseData.data.remoteJid,
            degreesLatitude: responseData.data.degreesLatitude,
            degreesLongitude: responseData.data.degreesLongitude
        }
        
        return {
            json: {
                success: responseData.status,
                data: dataTextResponse,
                message: responseData.msg
            },
            pairedItem: itemIndex
        };
    }

    static async sendReactionMessage(executeFunctions: IExecuteFunctions, itemIndex: number, botId: string, remoteJid: string): Promise<INodeExecutionData> {
        const skipSslCertificateValidation = executeFunctions.getNodeParameter('skipSslCertificateValidation', itemIndex) as boolean;
        const emoji = executeFunctions.getNodeParameter('reactionEmoji', itemIndex) as string;
        const messageId = executeFunctions.getNodeParameter('reactionMessageId', itemIndex) as string;

        const options: IHttpRequestOptions = {
            method: 'POST',
            body: { remoteJid, emoji, messageId },
            baseURL: `https://${botId}.kesherwa.dev`,
            url: '/api/whatsapp/reaction',
            json: true,
            skipSslCertificateValidation: skipSslCertificateValidation
        };
        
        const responseData = await executeFunctions.helpers.httpRequestWithAuthentication.call(executeFunctions, 'kesherWaApi', options);

        const dataTextResponse: SendReactionMessageResponse = {
            id: responseData.data.id,
            remoteJid: responseData.data.remoteJid,
            messageId: responseData.data.messageId,
            emoji: responseData.data.emoji
        }
        
        return {
            json: {
                success: responseData.status,
                data: dataTextResponse,
                message: responseData.msg
            },
            pairedItem: itemIndex
        };
    }

    static async deleteReactionMessage(executeFunctions: IExecuteFunctions, itemIndex: number, botId: string, remoteJid: string): Promise<INodeExecutionData> {
        const skipSslCertificateValidation = executeFunctions.getNodeParameter('skipSslCertificateValidation', itemIndex) as boolean;
        const messageId = executeFunctions.getNodeParameter('reactionMessageId', itemIndex) as string;

        const options: IHttpRequestOptions = {
            method: 'DELETE',
            body: { remoteJid, messageId },
            baseURL: `https://${botId}.kesherwa.dev`,
            url: '/api/whatsapp/reaction',
            json: true,
            skipSslCertificateValidation: skipSslCertificateValidation
        };
        
        const responseData = await executeFunctions.helpers.httpRequestWithAuthentication.call(executeFunctions, 'kesherWaApi', options);

        const dataTextResponse: DeleteReactionMessageResponse = {
            id: responseData.data.id,
            remoteJid: responseData.data.remoteJid,
            messageId: responseData.data.messageId
        }
        
        return {
            json: {
                success: responseData.status,
                data: dataTextResponse,
                message: responseData.msg
            },
            pairedItem: itemIndex
        };
    }
}