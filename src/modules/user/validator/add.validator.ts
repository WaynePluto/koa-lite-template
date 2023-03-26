import { z } from 'zod';

export const addUserValidator = z.object({
  name: z.string(),
  year: z.number()
});

export type AddUserQuery = z.infer<typeof addUserValidator>;
