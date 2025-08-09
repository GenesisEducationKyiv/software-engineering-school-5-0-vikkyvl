export interface MailhogMessage {
  Raw: {
    From: string;
    To: string[];
    Data: string;
  };
  Content: {
    Headers: {
      Subject: string[];
      To: string[];
      From: string[];
    };
    Body: string;
  };
}
