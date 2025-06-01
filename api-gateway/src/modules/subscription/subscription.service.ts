import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {SubscriptionDto} from "./dto/subscription.dto";
import {patterns} from "../patterns";
import {MicroserviceClient} from "../../common/microservice-client";

@Injectable()
export class SubscriptionService extends MicroserviceClient{
    constructor(
        @Inject('SUBSCRIPTION_SERVICE')
        protected client: ClientProxy
    ) {
        super(client);
    }

    async createSubscription(dto: SubscriptionDto) {
        return this.send(patterns.SUBSCRIPTION.CREATE_SUBSCRIPTION, dto);
    }
}
