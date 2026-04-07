import { Module } from "@nestjs/common";

import { BookingsModule } from "./bookings/bookings.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [DatabaseModule, BookingsModule],
})
export class AppModule {}
