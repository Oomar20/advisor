import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../config/env";
import * as schema from "./schema/bookings";

type DatabaseInstance = ReturnType<typeof drizzle<typeof schema>>;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly client = env.DATABASE_URL
    ? postgres(env.DATABASE_URL, {
        prepare: false,
      })
    : null;

  readonly db: DatabaseInstance | null = this.client
    ? drizzle(this.client, {
        schema,
      })
    : null;

  get isConfigured() {
    return this.db !== null;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
    }
  }
}
