interface INotifier {
  sendMessage: (
    messageInfo: { recipient: string, subject: string, message: string },
  ) => Promise<unknown>;
}

export default INotifier;
