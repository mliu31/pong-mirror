const INVITE = Object.freeze({
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED'
});

export type InviteValue = keyof typeof INVITE;

export default INVITE;
