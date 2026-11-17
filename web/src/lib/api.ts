// src/lib/api.ts

import { env } from "@/lib/env";
import { roomSchema, type Room } from "@/lib/types";
import z from "zod";

export async function getRooms(): Promise<Room[]> {
  const res = await fetch(`${env.API_URL}/rooms`);
  if (!res.ok) {
    throw new Error("Failed to load rooms");
  }
  const body = await res.json();
  return z.array(roomSchema).parse(body);
}
