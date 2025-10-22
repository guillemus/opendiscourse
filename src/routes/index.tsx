import { createFileRoute } from '@tanstack/react-router'
import { api } from '@convex/_generated/api'
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from 'convex/react'
import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    let data = useQuery(api.queries.main)
    return (
        <main>
            <div>Hello "/"! {data?.message}</div>
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>
            <Authenticated>
                <UserButton />
                <div>Hello "/"! {data?.message}</div>
            </Authenticated>
            <AuthLoading>
                <p>Still loading</p>
            </AuthLoading>
        </main>
    )
}
