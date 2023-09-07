import INotifier from '../interfaces/INotifier';

class ConsoleNotifier implements INotifier {
  private readonly send: (messageInfo: unknown) => void;

  constructor() {
    // eslint-disable-next-line no-console
    this.send = console.log;
  }

  async sendMessage(
    messageInfo: { recipient: string; subject: string; message: string },
  ): Promise<string> {
    const { recipient } = messageInfo;
    const { subject } = messageInfo;
    const { message } = messageInfo;
    const notification = `Recipient: ${recipient}, Subject: ${subject}, Message: ${message}`;
    this.send(`Notification: {${notification}}`);
    return Promise.resolve(notification);
  }
}

export default ConsoleNotifier;
