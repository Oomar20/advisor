import { Body, Controller, Get, Post, Query, Req, UseGuards, UsePipes } from "@nestjs/common";

import { SessionAuthGuard } from "../auth/session-auth.guard";
import type { AuthenticatedRequest } from "../auth/auth.types";
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
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ZodValidationPipe(createBookingSchema))
  bookSession(
    @Body() body: CreateBookingInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.bookingsService.bookSession(body, request.authUser!);
  }
}
