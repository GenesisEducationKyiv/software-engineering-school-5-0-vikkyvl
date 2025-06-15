import { LinkDto } from './dto/link.dto';
import { configService } from '../../../../../common/config/subscription-config.service';
import { Injectable } from '@nestjs/common';

export interface LinkServiceInterface {
  getLinks(token: string): LinkDto;
  getConfirmLink(token: string): string;
  getUnsubscribeLink(token: string): string;
}

@Injectable()
export class LinkService {
  private readonly baseUrl = configService.getReactAppApiUrl();

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
