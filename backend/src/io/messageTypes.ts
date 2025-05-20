export interface IOMessageBase {
  event: string;
  data: unknown;
}

export interface IONotification extends IOMessageBase {
  event: 'notification';
  data: { title: string; destination?: string };
}

export type IOMessage = IONotification; // add more union types as needed
