import { LinkDto } from './dto/link.dto';
import { subscriptionConfigService } from '../../../../../../common/config';
import { Injectable } from '@nestjs/common';

export interface LinkServiceInterface {
  getLinks(token: string): LinkDto;
}

@Injectable()
export class LinkService implements LinkServiceInterface {
  private baseUrl = subscriptionConfigService.getReactAppApiUrl();

  getLinks(token: string): LinkDto {
    return {
      confirmLink: this.getConfirmLink(token),
      unsubscribeLink: this.getUnsubscribeLink(token),
    };
  }

  private getConfirmLink(token: string): string {
    return `${this.baseUrl}/confirm/${token}`;
  }

  private getUnsubscribeLink(token: string): string {
    return `${this.baseUrl}/unsubscribe/${token}`;
  }
}
