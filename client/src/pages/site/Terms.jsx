import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Company Information</h2>
            <p className="text-muted-foreground">
              Lovelace Technologies Private Limited<br />
              Howly, Barpeta, Assam<br />
              PIN: 781316<br />
              Email: lovelacetechnologiesofficial@gmail.com
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily use our services for personal, non-commercial purposes only.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">4. Disclaimer</h2>
            <p className="text-muted-foreground">
              The materials on our platform are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">5. Limitations</h2>
            <p className="text-muted-foreground">
              In no event shall Lovelace Technologies Private Limited be liable for any damages arising out of the use or inability to use our services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Terms 