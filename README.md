![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)

# n8n-nodes-kesherwa

<p align="center">
  <img src="https://kesherwa.dev/kesherwa-logo-without-text.svg" alt="KesherWA Logo" width="160"/>
</p>

This is an n8n community node. It lets you use KesherWA in your n8n workflows.

KesherWA is a WhatsApp REST API platform that enables businesses to automate WhatsApp messaging. Connect and automate your business communications with our powerful, easy-to-use WhatsApp API. Send and receive messages seamlessly with enterprise-grade reliability.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### KesherWA Node (Action Node)

The KesherWA node allows you to send various types of messages:

- **Send Text Message** - Send plain text messages to WhatsApp numbers
- **Send Image Message** - Send images files
- **Send Video Message** - Send video files
- **Send Audio Message** - Send audio files
- **Send Document** - Send document files (PDF, TXT, CSV, DOCX, etc.)
- **Send Location** - Send location coordinates
- **Send Reaction** - React to messages with emojis

### KesherWA Trigger Node (Webhook Node)

The KesherWA Trigger node receives incoming WhatsApp messages through webhooks:

- **Multiple Output Ports** - Route different message types to specific workflows:
  - All Events (combined output)
  - Text Messages
  - Images (automatically decrypted)
  - Videos (automatically decrypted)
  - Audio (automatically decrypted)
  - Documents (automatically decrypted)
  - Locations
  - Reactions

- **Automatic Media Decryption** - Media files received via webhooks are automatically decrypted using WhatsApp's encryption protocol, so you can work with them directly in your workflows

- **Flexible Authentication** - Configure webhook security with:
  - No authentication
  - Header authentication (recommended: use `X-BOT-ID`)
  - Query parameter authentication

## Credentials

To use this node, you need to set up a KesherWA account and obtain your API credentials:

### Prerequisites

1. Sign up at [https://app.kesherwa.dev](https://app.kesherwa.dev)
2. Subscribe to a plan (all plans include a 7-day free trial)
3. Complete the bot setup by selecting your server region
4. Scan the WhatsApp QR code in your dashboard to connect your device

### Getting Your Credentials

1. Navigate to your [KesherWA Dashboard](https://app.kesherwa.dev/dashboard/bots)
2. Click on your bot to view details
3. Copy your **Bot Token** and **Bot ID** from the API Configuration section

### Setting Up Credentials in n8n

1. In your n8n workflow, add a KesherWA node
2. Click on "Create New Credential"
3. Enter your **Bot Token** and **Bot ID**
4. Save the credential

### Webhook Configuration

For the KesherWA Trigger node:

1. Add the KesherWA Trigger node to your workflow
2. Save and activate your workflow to generate the webhook URL
3. Copy the Production Webhook URL from the node
4. Go to your [bot settings](https://app.kesherwa.dev/dashboard/bots) in the KesherWA dashboard
5. Paste the webhook URL in the "Webhook URL" field
6. Configure authentication (recommended: use Header Auth with `X-BOT-ID` header name and your Bot ID as the value)
7. Save your webhook configuration

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Tested with**: n8n v1.112.5
- **Node.js version**: >=22.20
- **n8n Nodes API Version**: 1

## Usage

### Example: Send a Text Message

1. Add a trigger node (e.g., Manual Trigger, Schedule Trigger)
2. Add the KesherWA node
3. Select "Send Message" as the resource
4. Select "Send Text Message" as the operation
5. Enter the recipient's WhatsApp ID (format: `0123456789@s.whatsapp.net`)
6. Enter your message text
7. Execute the workflow

### Example: Receive Messages and Auto-Reply

1. Add a KesherWA Trigger node
2. Configure webhook authentication (use `X-BOT-ID` header)
3. Connect the "Text Messages" output to a KesherWA action node
4. Configure the action node to send a reply using the `remoteJid` from the trigger
5. Activate your workflow

### Regional Server Selection

When setting up your bot, choose a server region closest to your physical location for optimal latency:

- **Americas**: Northern Virginia, Ohio, Northern California, Oregon, São Paulo, Central (Canada)
- **Europe**: Frankfurt, Ireland, London, Paris, Stockholm
- **Asia Pacific**: Mumbai, Osaka, Seoul, Singapore, Sydney, Tokyo

### Rate Limits

Each plan includes monthly API limits for sending and receiving messages:

- **Basic**: 5,000 send / 5,000 receive per month
- **Standard**: 25,000 send / 25,000 receive per month
- **Premium**: 100,000 send / Unlimited receive per month
- **Business**: 1,000,000 send / Unlimited receive per month
- **Enterprise**: Unlimited send / Unlimited receive per month

When you reach your limit, you'll receive an email notification. Webhook requests won't be processed until the next billing cycle or plan upgrade.

### Media Message Formats

When sending media messages, ensure your binary data is properly formatted:

- **Images**: JPG, PNG, GIF
- **Videos**: MP4, 3GP
- **Audio**: MP3, OGG, AAC
- **Documents**: PDF, TXT, CSV, DOCX, XLSX, and more

The binary property name defaults to `data`, which is the standard in n8n workflows.

### Privacy and Security

- **End-to-End Encryption**: Media files received via webhooks maintain WhatsApp's encryption standards
- **No Data Retention**: KesherWA does not store your messages or media files
- **Dedicated IP**: Most plans include dedicated IP addresses for your WhatsApp connection
- **Secure File Delivery**: Media URLs are proxied through `https://files.kesherwa.dev` for secure access

### Best Practices

1. **Avoid Spam**: Do not use KesherWA to send unsolicited marketing messages. Your WhatsApp number may be reported and banned by WhatsApp
2. **Respect Limits**: Monitor your usage to stay within plan limits
3. **Use Authentication**: Always configure webhook authentication for security
4. **Test First**: Use the test mode in n8n to verify your workflows before activation
5. **Handle Errors**: Implement error handling in your workflows for failed message delivery

## Resources

- [KesherWA Website](https://kesherwa.dev)
- [KesherWA Dashboard](https://app.kesherwa.dev/dashboard/bots)
- [API Documentation](https://app.kesherwa.dev/dashboard/docs)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Repository](https://github.com/richardags/n8n-nodes-kesherwa)

## Support

For technical questions and support:

- **Technical Support**: [support@kesherwa.dev](mailto:support@kesherwa.dev)
- **General Inquiries**: [contact@kesherwa.dev](mailto:contact@kesherwa.dev)

## Common Use Cases

- **AI Chatbots**: Build intelligent WhatsApp chatbots with AI integration
- **Customer Support**: Automate customer service responses and ticket creation
- **Order Notifications**: Send order confirmations and shipping updates
- **Appointment Reminders**: Schedule automated appointment reminders
- **Lead Qualification**: Automatically qualify and route leads
- **Marketing Automation**: Send personalized marketing messages (with consent)
- **Two-Factor Authentication**: Implement 2FA via WhatsApp
- **Internal Notifications**: Alert teams about important events

## Pricing

KesherWA offers flexible pricing plans to match your needs:

- **Basic**: $29/month - 5K messages, text only
- **Standard**: $79/month - 25K messages, includes reactions and locations
- **Premium**: $199/month - 100K send, unlimited receive, includes documents and images
- **Business**: $250/month - 1M send, 2 phone numbers, full media support
- **Enterprise**: $500/month - Unlimited messages, up to 10 numbers, dedicated support

All plans include:
- 7-day free trial
- Dedicated IP address
- 99.9% uptime guarantee
- 24/7 support

For detailed pricing information, visit [KesherWA Pricing](https://kesherwa.dev#pricing)

## Known Limitations

- **Unsupported Message Types**: Stickers, Quick Reply Buttons, Poll Questions, and Contacts are not yet supported but may be added in future updates
- **Monthly Limits**: Webhooks stop processing when monthly limits are reached (you'll receive email notifications)
- **WhatsApp Policies**: Your WhatsApp number must comply with WhatsApp's terms of service to avoid being banned

## License

[MIT](LICENSE.md)

---

**Note**: This is a community node developed by KesherWA. It is not officially associated with WhatsApp or Meta.