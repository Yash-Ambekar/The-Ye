declare global {
  type changeDetailsReply = {
    replyType: string;
    reply: string;
    latitude: number;
    longitude: number;
    messageID: string;
    address: string;
  };  
}

export {};
