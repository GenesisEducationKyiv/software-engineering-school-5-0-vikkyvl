import { Module } from '@nestjs/common';
import {Subscription} from "../../entities/subscription.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfirmationService} from "./confirmation.service";
import {ConfirmationController} from "./confirmation.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Subscription])],
    controllers: [ConfirmationController],
    providers: [ConfirmationService],
})
export class ConfirmationModule {}
