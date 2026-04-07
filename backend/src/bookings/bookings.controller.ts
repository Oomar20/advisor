import { Body, Controller, Get, Post, Query, UsePipes } from "@nestjs/common";

import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { BookingsService } from "./bookings.service";
import {
  availableSessionsQuerySchema,
  createBookingSchema,
  type AvailableSessionsQuery,
  type CreateBookingInput,
} from "./bookings.schemas";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get("available")
  @UsePipes(new ZodValidationPipe(availableSessionsQuerySchema))
  getAvailableSessions(@Query() query: AvailableSessionsQuery) {
    return this.bookingsService.getAvailableSessions(query);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createBookingSchema))
  bookSession(@Body() body: CreateBookingInput) {
    return this.bookingsService.bookSession(body);
  }
}
