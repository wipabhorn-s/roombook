// src/lib/schemas.ts

import z from "zod";

export const createRoomSchema = z.object({
  name: z.string().trim().min(1, "Room name is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
