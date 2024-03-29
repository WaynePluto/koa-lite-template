import { initTRPC } from '@trpc/server'
import z from 'zod'

export const t = initTRPC.context().create()

export const appRouter = t.router({
  getUser: t.procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(opts => {
      return { id: opts.input.id, name: 'Tom' }
    }),

  addUser: t.procedure
    .input(
      z.object({
        name: z.string()
      })
    )
    .mutation(opt => {
      return {}
    })
})

export type AppRouter = typeof appRouter
