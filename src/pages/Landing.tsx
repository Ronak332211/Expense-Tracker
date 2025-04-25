import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Lock, LineChart, CreditCard, Wallet, ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">ExpenseEdge</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Take control of your <span className="text-purple-600">financial future</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            ExpenseEdge helps you track income and expenses, visualize your spending habits, and make smarter financial decisions - all in one secure place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why choose ExpenseEdge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="inline-block p-3 bg-purple-100 rounded-lg mb-4">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Track All Transactions</h3>
              <p className="text-gray-600">
                Easily record and categorize both income and expenses with a simple, intuitive interface.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="inline-block p-3 bg-purple-100 rounded-lg mb-4">
                <LineChart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time Balance</h3>
              <p className="text-gray-600">
                See your current financial position with automatic calculations and instant updates.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="inline-block p-3 bg-purple-100 rounded-lg mb-4">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">
                Your financial data is protected with enterprise-grade security and user-specific access.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What our users say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 italic mb-4">
                "ExpenseEdge has completely changed how I manage my finances. I can finally see where my money is going and make better decisions."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-500">Freelancer</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 italic mb-4">
                "The simplicity of adding transactions and seeing my balance update in real-time is exactly what I needed. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">James D.</p>
                  <p className="text-sm text-gray-500">Small Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to take control of your finances?</h2>
          <p className="text-purple-100 max-w-2xl mx-auto mb-8">
            Join thousands of users who've transformed their financial management with ExpenseEdge.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <BarChart3 className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">ExpenseEdge</span>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <Link to="/login" className="hover:text-white">Log In</Link>
              <Link to="/register" className="hover:text-white">Register</Link>
              <a href="#features" className="hover:text-white">Features</a>
              <a href="#" className="hover:text-white">About</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>© {new Date().getFullYear()} ExpenseEdge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 