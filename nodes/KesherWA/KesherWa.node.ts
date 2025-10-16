import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
    IExecuteFunctions,
    NodeOperationError,
    NodeConnectionTypes
} from 'n8n-workflow';

import { SendMessage } from './utils/SendMessage';

export class KesherWa implements INodeType {
	description: INodeTypeDescription = {
        displayName: 'KesherWA',
        name: 'kesherWa',
        icon: 'file:kesherWa.svg',
        group: ['output'],
        version: 1,
        description: 'Send WhatsApp messages and media via KesherWA API',
        defaults: {
            name: 'KesherWa',
        },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'kesherWaApi',
                required: true,
            },
        ],
		properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                options: [
                    {
                        name: 'Message',
                        value: 'message',
                    },
                    {
                        name: 'Media',
                        value: 'media',
                    },
                    {
                        name: 'Location',
                        value: 'location',
                    },
                    {
                        name: 'Reaction',
                        value: 'reaction',
                    }
                ],
                default: 'message',
                noDataExpression: true,
                required: true,
            },
            {
                displayName: 'Operation',
                name: 'operationMessage',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['message'],
                    },
                },
                options: [
                    {
                        name: 'Send Text',
                        value: 'sendWhatsAppText',
                        description: 'Send a text message to a WhatsApp recipient',
                        action: 'Send text message',
                    }
                ],
                default: 'sendWhatsAppText',
                noDataExpression: true,
            },
            {
                displayName: 'Operation',
                name: 'operationMedia',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['media'],
                    },
                },
                options: [
                    {
                        name: 'Send Audio',
                        value: 'sendWhatsAppAudio',
                        description: 'Send an audio file to a WhatsApp recipient',
                        action: 'Send audio file',
                    },
                    {
                        name: 'Send Document',
                        value: 'sendWhatsAppDocument',
                        description: 'Send a document file to a WhatsApp recipient',
                        action: 'Send document file',
                    },
                    {
                        name: 'Send Image',
                        value: 'sendWhatsAppImage',
                        description: 'Send an image file to a WhatsApp recipient',
                        action: 'Send image file',
                    },
                    {
                        name: 'Send Video',
                        value: 'sendWhatsAppVideo',
                        description: 'Send a video file to a WhatsApp recipient',
                        action: 'Send video file',
                    }
                ],
                default: 'sendWhatsAppImage',
                noDataExpression: true,
            },
            {
                displayName: 'Operation',
                name: 'operationLocation',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['location'],
                    },
                },
                options: [
                    {
                        name: 'Send Location',
                        value: 'sendWhatsAppLocation',
                        description: 'Share a geographic location pin with a WhatsApp recipient',
                        action: 'Send location pin',
                    },
                ],
                default: 'sendWhatsAppLocation',
                noDataExpression: true,
            },
            {
                displayName: 'Operation',
                name: 'operationReaction',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['reaction'],
                    },
                },
                options: [
                    {
                        name: 'Delete Reaction',
                        value: 'deleteWhatsAppReaction',
                        description: 'Remove an emoji reaction from a message',
                        action: 'Delete reaction from message',
                    },
                    {
                        name: 'Send Reaction',
                        value: 'sendWhatsAppReaction',
                        description: 'React to a message with an emoji',
                        action: 'Send emoji reaction',
                    }
                ],
                default: 'sendWhatsAppReaction',
                noDataExpression: true,
            },
            {
                displayName: 'Recipient',
                name: 'remoteJid',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['message', 'media', 'location', 'reaction']
                    },
                },
                default: '',
                placeholder: 'e.g. 5511999887766@s.whatsapp.net',
                description: 'WhatsApp ID of the recipient (phone number with country code followed by @s.whatsapp.net)',
            },
            // MESSAGE RESOURCE FIELDS
            {
                displayName: 'Text Message',
                name: 'textText',
                type: 'string',
                required: true,
                typeOptions: {
                    rows: 4,
                },
                displayOptions: {
                    show: {
                        resource: ['message'],
                        operationMessage: ['sendWhatsAppText']
                    },
                },
                default: '',
                placeholder: 'e.g. Hello from n8n!',
                description: 'The message text to send to the recipient',
            },
            // MEDIA RESOURCE FIELDS
            {
                displayName: 'Media Source',
                name: 'inputDataType',
                type: 'options',
                options: [
                    {
                        name: 'URL',
                        value: 'url',
                    },
                    {
                        name: 'Binary Data',
                        value: 'binary',
                    }
                ],
                displayOptions: {
                    show: {
                        resource: ['media'],
                        operationMedia: ['sendWhatsAppImage', 'sendWhatsAppAudio', 'sendWhatsAppVideo', 'sendWhatsAppDocument']
                    },
                },
                default: 'url',
                description: 'Whether to provide media as a URL or binary data from a previous node',
            },
            {
                displayName: 'Media URL',
                name: 'inputDataUrl',
                type: 'string',
                default: '',
                placeholder: 'e.g. https://example.com/image.jpg',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['media'],
                         operationMedia: ['sendWhatsAppImage', 'sendWhatsAppAudio', 'sendWhatsAppVideo', 'sendWhatsAppDocument'],
                        inputDataType: ['url']
                    },
                },
                description: 'Publicly accessible URL of the media file to send'
            },
            {
                displayName: 'Binary Property',
                name: 'inputDataBuffer',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['media'],
                        operationMedia: ['sendWhatsAppImage', 'sendWhatsAppAudio', 'sendWhatsAppVideo', 'sendWhatsAppDocument'],
                        inputDataType: ['binary']
                    },
                },
                description: 'Name of the binary property containing the file data from the previous node',
                hint: 'The binary property name from the previous node, usually "data"',
            },
            {
                displayName: 'File Extension',
                name: 'documentExtension',
                type: 'string',
                default: 'pdf',
                placeholder: 'e.g. pdf',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['media'],
                        operationMedia: ['sendWhatsAppDocument']
                    },
                },
                description: 'File extension without the dot (e.g., pdf, txt, docx, xlsx)',
            },
            // LOCATION RESOURCE FIELDS
            {
                displayName: 'Latitude',
                name: 'locationDegreesLatitude',
                type: 'number',
                default: 0,
                placeholder: 'e.g. 31.4018434',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['location'],
                        operationLocation: ['sendWhatsAppLocation']
                    },
                },
                description: 'Latitude coordinate of the location in decimal degrees',
            },
            {
                displayName: 'Longitude',
                name: 'locationDegreesLongitude',
                type: 'number',
                default: 0,
                placeholder: 'e.g. 33.7625671',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['location'],
                        operationLocation: ['sendWhatsAppLocation']
                    },
                },
                description: 'Longitude coordinate of the location in decimal degrees',
            },
            // REACTION RESOURCE FIELDS
            {
                displayName: 'Emoji',
                name: 'reactionEmoji',
                type: 'string',
                default: '❤️',
                placeholder: 'e.g. 👍',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['reaction'],
                        operationReaction: ['sendWhatsAppReaction']
                    },
                },
                description: 'The emoji character to react with',
            },
            {
                displayName: 'Message ID',
                name: 'reactionMessageId',
                type: 'string',
                default: '',
                placeholder: 'e.g. BAE5F4D6E1A4C6B8',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['reaction'],
                        operationReaction: ['sendWhatsAppReaction', 'deleteWhatsAppReaction']
                    },
                },
                description: 'The unique identifier of the message to react to or remove reaction from',
            },
            // IGNORE SSL
            {
                displayName: 'Ignore SSL Issues',
                name: 'skipSslCertificateValidation',
                type: 'boolean',
                required: true,
                displayOptions: {
                    show: {
                        '@version': [1],
                    },
                },
                default: false,
                description: 'Whether to connect even if SSL certificate validation is not possible',
            },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        
        // Get the correct operation parameter based on resource
        let operation = '';

        if (resource === 'message') {
            operation = this.getNodeParameter('operationMessage', 0) as string;
        } else if (resource === 'media') {
            operation = this.getNodeParameter('operationMedia', 0) as string;
        } else if (resource === 'location') {
            operation = this.getNodeParameter('operationLocation', 0) as string;
        } else if (resource === 'reaction') {
            operation = this.getNodeParameter('operationReaction', 0) as string;
        }

        for (let i = 0; i < items.length; i++) {
            const credentials = await this.getCredentials('kesherWaApi');
            if (!credentials) {
                throw new NodeOperationError(this.getNode(), 'KesherWA API credentials not found');
            }
            const botId = credentials.botId as string;

            if (!botId || typeof botId !== 'string') {
                throw new NodeOperationError(this.getNode(), `Invalid Bot ID: ${botId}. Please check your credentials.`);
            }

            const remoteJid = this.getNodeParameter('remoteJid', i) as string;

            if (resource === 'message') {
                if (operation === 'sendWhatsAppText') {
                    try {
                        const data = await SendMessage.sendTextMessage(this, i, botId, remoteJid);
                        returnData.push(data);
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                            continue;
                        }
                        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                    }
                }
            }

            if (resource === 'media') {
                if (operation === 'sendWhatsAppImage') {
                    try {
                        const data = await SendMessage.sendImageMessage(this, i, botId, remoteJid);
                        returnData.push(data);
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                            continue;
                        }
                        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                    }
                }

                if (operation === 'sendWhatsAppAudio') {
                    try {
                        const data = await SendMessage.sendAudioMessage(this, i, botId, remoteJid);
                        returnData.push(data);
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                            continue;
                        }
                        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                    }
                }

                if (operation === 'sendWhatsAppVideo') {
                    try {
                        const data = await SendMessage.sendVideoMessage(this, i, botId, remoteJid);
                        returnData.push(data);
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                            continue;
                        }
                        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                    }
                }

                if (operation === 'sendWhatsAppDocument') {
                    try {
                        const data = await SendMessage.sendDocumentMessage(this, i, botId, remoteJid);
                        returnData.push(data);
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                            continue;
                        }
                        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                    }
                }
            }

            if (resource === 'location') {
                if (operation === 'sendWhatsAppLocation') {
                    try {
                        const data = await SendMessage.sendLocationMessage(this, i, botId, remoteJid);
                        returnData.push(data);
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                            continue;
                        }
                        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                    }
                }
            }

            if (resource === 'reaction') {
                if (operation === 'sendWhatsAppReaction') {
                    try {
                        const data = await SendMessage.sendReactionMessage(this, i, botId, remoteJid);
                        returnData.push(data);
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                            continue;
                        }
                        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                    }
                }

                if (operation === 'deleteWhatsAppReaction') {
                    try {
                        const data = await SendMessage.deleteReactionMessage(this, i, botId, remoteJid);
                        returnData.push(data);
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                            continue;
                        }
                        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                    }
                }
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
	}
}