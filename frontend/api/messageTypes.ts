export interface IOEventBase {
  title: string;
  data: unknown;
}

export interface IONotificationEvent extends IOEventBase {
  title: 'notification';
  data: {
    title: string;
    destination?: string;
  };
}

export interface IOInviteEvent extends IOEventBase {
  title: 'invite';
  data: { captainName: string };
}

export type IOEvent = IONotificationEvent | IOInviteEvent;
