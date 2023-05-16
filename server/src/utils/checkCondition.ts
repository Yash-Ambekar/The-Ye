import { Request } from 'express';

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

