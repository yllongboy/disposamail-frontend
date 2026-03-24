export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  date: string;
  receivedAt: number;
  hasAttachments: boolean;
  attachments: AttachmentMeta[];
}

export interface AttachmentMeta {
  filename: string;
  size: number;
  contentType: string;
}

export interface InboxEmail {
  id: string;
  from: string;
  subject: string;
  date: string;
  hasAttachments: boolean;
}

export interface Inbox {
  email: string;
  domain: string;
  createdAt: number;
}

export interface SavedInbox extends Inbox {
  label?: string;
}
