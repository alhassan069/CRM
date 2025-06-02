import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="text-9xl font-bold text-primary">404</div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="w-full sm:w-auto">
              <Button className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Need help? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound