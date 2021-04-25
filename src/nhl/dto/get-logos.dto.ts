import { RemoveSourceIdentifierFromSubscriptionMessage } from "aws-sdk/clients/neptune"

export class GetLogosDto {
    onlyActive?: boolean;
    season?: string;
}