/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class Timezone {
    @Prop()
    id: string;

    @Prop()
    offset: number;

    @Prop()
    tz: string
}
