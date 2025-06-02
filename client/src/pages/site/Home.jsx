import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">Your Platform</span>
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            A modern solution for your needs. Simple, fast, and reliable.
          </p>
          <div className="flex gap-4">
            <Link to="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Experience blazing fast performance with our optimized platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>Optimized Performance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>Quick Response Time</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Your data is protected with enterprise-grade security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>End-to-End Encryption</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>Regular Backups</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary" />
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>
                Intuitive interface designed for the best user experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>User-Friendly Design</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>24/7 Support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t fixed bottom-0 w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Lovelace Technologies Private Limited. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/terms">
                <Button variant="ghost" size="sm">Terms</Button>
              </Link>
              <Link to="/privacy">
                <Button variant="ghost" size="sm">Privacy</Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" size="sm">Contact</Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home