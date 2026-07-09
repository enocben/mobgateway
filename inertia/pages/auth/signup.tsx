import { Form } from '@adonisjs/inertia/react'
import { Link } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { UserPlus } from 'lucide-react'

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form route="new_account.store" className="flex flex-col gap-4">
            {({ errors }) => (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    type="text"
                    name="fullName"
                    id="fullName"
                    data-invalid={errors.fullName ? 'true' : undefined}
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    data-invalid={errors.email ? 'true' : undefined}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    data-invalid={errors.password ? 'true' : undefined}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="passwordConfirmation">Confirm password</Label>
                  <Input
                    type="password"
                    name="passwordConfirmation"
                    id="passwordConfirmation"
                    autoComplete="new-password"
                    data-invalid={errors.passwordConfirmation ? 'true' : undefined}
                  />
                  {errors.passwordConfirmation && (
                    <p className="text-sm text-destructive">{errors.passwordConfirmation}</p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </>
            )}
          </Form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
