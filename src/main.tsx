import { convex, defaultQc } from '@/lib/queryClient'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

function setToken(token: string) {
    console.log('setting token', token)
    localStorage.setItem(
        'tokenData',
        JSON.stringify({
            token,
            expiration: Date.now() + 1000 * 60 * 60,
            // expiration: Date.now(),
        }),
    )
}

type TokenData = {
    token: string
    expiration: number
}

function getToken() {
    const data = localStorage.getItem('tokenData')

    if (!data) return null

    const { token, expiration } = JSON.parse(data) as TokenData

    // Token has expired, clear it and return null
    if (Date.now() > expiration) {
        localStorage.removeItem('tokenData')
        return null
    }

    return token
}

function useClerkAuth() {
    let auth = useAuth()

    let token = getToken()
    let hasToken = !!token

    return {
        ...auth,
        isLoaded: hasToken ? true : auth.isLoaded,
        isSignedIn: hasToken ? true : auth.isSignedIn,

        async getToken(opts: any) {
            let cached = getToken()
            if (cached) return cached

            let token = await auth.getToken({
                ...opts,
                skipCache: true,
            })
            if (!token) return null

            setToken(token)

            return token
        },
    }
}

export function Main() {
    return (
        <ClerkProvider
            // touchSession={false}
            publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
                <QueryClientProvider client={defaultQc}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}
