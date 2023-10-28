import { Request } from "express";

export function checkCondition(req: Request) {
  if (
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0]
  ) {
    if (req.body.entry[0].changes[0].value.messages[0].type) {
      const type = req.body.entry[0].changes[0].value.messages[0].type;
      return type;
    }
  }
  return null;
}

export function checkForReply(replyDetails: replyDetails) {
  if (
    replyDetails.reply &&
    replyDetails.reply !== "None" &&
    replyDetails.replyType === "description"
  ) {
    return "description";
  }
  else if(
    replyDetails.reply &&
    replyDetails.reply === "None" &&
    replyDetails.replyType === "description"
  ) {
    return "None";
  }
  else if (
    replyDetails.reply &&
    replyDetails.reply === "Confirm" &&
    replyDetails.replyType === "button-reply"
  ) {
    return "Confirm";
  }

  else if (
    replyDetails.reply &&
    replyDetails.reply === "Reset" &&
    replyDetails.replyType === "button-reply"
  ) {
    return "Reset";
  }else if (
    replyDetails.reply &&
    replyDetails.reply === "Show interest" &&
    replyDetails.replyType === "button-reply"
  ) {
    return "Show interest";
  }

  return "";
}
