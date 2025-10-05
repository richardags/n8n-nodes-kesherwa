import {
    IWebhookFunctions,
    IWebhookResponseData,
    INodeType,
    INodeTypeDescription,
    INodeExecutionData,
    NodeConnectionTypes,
    IHookFunctions
} from 'n8n-workflow';

import {
    WebhookResponse,
    EventType,
    ReceivedTextMessageResponse,
    ReceivedImageMessageResponse,
    ReceivedVideoMessageResponse,
    ReceivedAudioMessageResponse,
    ReceivedDocumentMessageResponse,
    ReceivedLocationMessageResponse,
    ReceivedReactionMessageResponse,
} from './schemas/webhook.schema';
import { MediaDecoder } from './utils/MediaDecoder ';

export class KesherWaTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'KesherWA Trigger',
        name: 'kesherWaTrigger',
        icon: 'file:kesherWa.svg',
        group: ['trigger'],
        version: 1,
        description: 'Triggers when receiving messages from KesherWA services',
        defaults: {
            name: 'KesherWA Trigger',
        },
        inputs: [],
        outputs: [NodeConnectionTypes.Main, NodeConnectionTypes.Main, NodeConnectionTypes.Main, NodeConnectionTypes.Main, NodeConnectionTypes.Main, NodeConnectionTypes.Main, NodeConnectionTypes.Main, NodeConnectionTypes.Main],
        outputNames: ['📨 All Events', '💬 Text Messages', '🖼️ Images', '🎥 Videos', '🎵 Audio', '📄 Documents', '📍 Locations', '😀 Reactions'],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'kesherwa-webhook',
            },
        ],
        properties: [
            {
                displayName: 'Copy this URL to your KesherWA dashboard webhook settings',
                name: 'kesherWaNotice',
                type: 'notice',
                default: ''
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                options: [
                    {
                        name: 'None',
                        value: 'none',
                    },
                    {
                        name: 'Header Auth',
                        value: 'header',
                    },
                    {
                        name: 'Query Parameter',
                        value: 'query',
                    },
                ],
                default: 'header',
                description: 'The authentication method to secure your webhook'
            },
            {
                displayName: 'Header Name',
                name: 'headerName',
                type: 'string',
                default: 'X-BOT-ID',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['header'],
                    },
                },
                description: 'Header name for authentication',
            },
            {
                displayName: 'Header Value',
                name: 'headerValue',
                type: 'string',
                default: 'Bot ID (Recommended)',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['header'],
                    },
                },
                description: 'Header value for authentication',
            },
            {
                displayName: 'Query Parameter Name',
                name: 'queryName',
                type: 'string',
                default: 'token',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['query'],
                    },
                },
                description: 'Name of the query parameter that contains the authentication token',
            },
            {
                displayName: 'Query Parameter Value',
                name: 'queryValue',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['query'],
                    },
                },
                description: 'Value that should be sent in the query parameter',
            },
        ],
    };

    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                return true;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                return true;
            },
            async delete(this: IHookFunctions): Promise<boolean> {
                return true;
            },
        },
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        //const req = this.getRequestObject();
        const res = this.getResponseObject();
        const body = this.getBodyData();
        const query = this.getQueryData() as { [key: string]: string };
        const headers = this.getHeaderData();

        // Get node parameters
        const authentication = this.getNodeParameter('authentication') as string;

        // Authentication check
        if (authentication === 'header') {
            const headerName = this.getNodeParameter('headerName') as string;
            const expectedValue = (this.getNodeParameter('headerValue') as string).toLowerCase();
            const receivedValue = headers[headerName.toLowerCase()];

            if (receivedValue !== expectedValue) {
                res.statusCode = 401;
                return {
                    noWebhookResponse: true,
                };
            }
        }

        if (authentication === 'query') {
            const queryName = this.getNodeParameter('queryName') as string;
            const expectedValue = this.getNodeParameter('queryValue') as string;
            const receivedValue = query[queryName.toLowerCase()] as string;

            if (receivedValue !== expectedValue) {
                res.statusCode = 401;
                return {
                    noWebhookResponse: true,
                };
            }
        }

        // Extract event data from webhook payload
        const webhookPayload = body as unknown as WebhookResponse;

        // Determine which output to use based on event type
        let outputIndex = 0; // Default to 'All Events'
        let jsonData: any;
        let binaryData: any = {};
        
        switch (webhookPayload.event) {
            case EventType.TEXT:
                outputIndex = 1;
                jsonData = webhookPayload.data as ReceivedTextMessageResponse;
                break;
            case EventType.IMAGE:
                outputIndex = 2;
                const imageResult = await MediaDecoder.processMediaMessage(this, webhookPayload.data as ReceivedImageMessageResponse);
                binaryData = { data: imageResult.binaryData };
                break;
            case EventType.VIDEO:
                outputIndex = 3;
                const videoResult = await MediaDecoder.processMediaMessage(this, webhookPayload.data as ReceivedVideoMessageResponse);
                binaryData = { data: videoResult.binaryData };
                break;
            case EventType.AUDIO:
                outputIndex = 4;
                const audioResult = await MediaDecoder.processMediaMessage(this, webhookPayload.data as ReceivedAudioMessageResponse);
                binaryData = { data: audioResult.binaryData };
                break;
            case EventType.DOCUMENT:
                outputIndex = 5;
                const documentResult = await MediaDecoder.processMediaMessage(this, webhookPayload.data as ReceivedDocumentMessageResponse);
                binaryData = { data: documentResult.binaryData };
                break;
            case EventType.LOCATION:
                outputIndex = 6;
                jsonData = webhookPayload.data as ReceivedLocationMessageResponse;
                break;
            case EventType.REACTION:
                outputIndex = 7;
                jsonData = webhookPayload.data as ReceivedReactionMessageResponse;
                break;
            default:
                res.statusCode = 400;
                return {
                    noWebhookResponse: true,
                };
        }

        // Create output arrays for each trigger
        const workflowData: INodeExecutionData[][] = [];
        for (let i = 0; i < 8; i++) {
            workflowData[i] = [];
        }

        // Prepare the response data using the structured webhook format
        let nodeExecutionData: INodeExecutionData  = {
            json: {
                event: webhookPayload.event,
                from: webhookPayload.from,
                timestamp: webhookPayload.timestamp,
            }
        };

        // Add json data if available
        if (jsonData !== undefined) {
            const responseData = { ...nodeExecutionData.json, ...jsonData };
            nodeExecutionData.json = responseData;
        }

        // Add binary data if media was decrypted
        if (Object.keys(binaryData).length > 0) {
            nodeExecutionData.binary = binaryData;
        }

        // Send data to appropriate output AND to 'All Events' output
        workflowData[0].push(nodeExecutionData); // All Events
        workflowData[outputIndex].push(nodeExecutionData); // Specific event type

        // Return success response to KesherWA
        res.statusCode = 200;
        
        return {
            webhookResponse: {
                status: 'success',
                received: true,
            },
            workflowData
        };
    }
}