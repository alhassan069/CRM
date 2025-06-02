import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
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
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information that you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not share your personal information with third parties except as described in this privacy policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Privacy 