import { query } from './_generated/server'

export const main = query({
    args: {},
    async handler(ctx) {
        let id = await ctx.auth.getUserIdentity()

        return {
            message: 'Helloo, world!',
        }
    },
})
