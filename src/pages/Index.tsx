import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { TechStackCarousel } from "@/components/shared/TechStackCarousel";
import { Shield, Scan, UserCheck, Building2, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import confirmitLogo from "@/assets/confirmit-logo.png";

const Index = () => {
  // Animated counter for trust indicators
  const trustStats = {
    receiptsVerified: "142,000+",
    businessesProtected: "3,400+",
    fraudPrevented: "₦2.1B+"
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-primary py-20 text-primary-foreground relative overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/20"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight 
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>

          <Container className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="mb-6 flex justify-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-glow backdrop-blur-sm">
                  <img src={confirmitLogo} alt="ConfirmIT" className="h-12 w-12" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-4xl font-bold md:text-6xl leading-tight"
              >
                Verify Receipts and Accounts in Seconds
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-lg md:text-xl opacity-90"
              >
                AI-powered trust verification for African commerce. 
                Stop fraud before you lose money.
              </motion.p>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 flex flex-wrap justify-center gap-6 text-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{trustStats.receiptsVerified} receipts verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{trustStats.businessesProtected} businesses protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{trustStats.fraudPrevented} fraud prevented</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 sm:flex-row sm:justify-center"
              >
                <Button size="lg" variant="secondary" asChild className="shadow-elegant text-lg px-8 py-6">
                  <Link to="/quick-scan">
                    <Scan className="mr-2 h-5 w-5" />
                    Scan Receipt <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/20 bg-white/10 text-white hover:bg-white/20 text-lg px-8 py-6">
                  <Link to="/account-check">
                    <UserCheck className="mr-2 h-5 w-5" />
                    Check Account
                  </Link>
                </Button>
              </motion.div>

              {/* Quick Demo Preview */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-12"
              >
                <Badge variant="secondary" className="mb-4">
                  See it in action
                </Badge>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <div className="aspect-video rounded-lg bg-white/10 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Shield className="h-16 w-16 mx-auto opacity-50" />
                        <p className="text-sm opacity-75">Upload → AI Analysis → Results in 8 seconds</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Confirmit Protects You</h2>
              <p className="text-xl text-muted-foreground">
                Three powerful tools to verify trust before you pay
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="shadow-elegant transition-smooth hover:shadow-glow">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Scan className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>QuickScan</CardTitle>
                  <CardDescription>
                    Upload any receipt for instant AI forensic analysis. 
                    Detect tampered documents, fake receipts, and fraudulent merchants in under 8 seconds.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" asChild className="group">
                    <Link to="/quick-scan">
                      Try QuickScan <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-elegant transition-smooth hover:shadow-glow">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <UserCheck className="h-6 w-6 text-success" />
                  </div>
                  <CardTitle>Account Check</CardTitle>
                  <CardDescription>
                    Verify any bank account before sending money. 
                    Check trust scores, fraud reports, and scam patterns instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" asChild className="group">
                    <Link to="/account-check">
                      Check Account <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-elegant transition-smooth hover:shadow-glow">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                    <Building2 className="h-6 w-6 text-warning" />
                  </div>
                  <CardTitle>Business Directory</CardTitle>
                  <CardDescription>
                    Discover verified businesses with proven track records. 
                    Register your business to earn customer trust.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" asChild className="group">
                    <Link to="/business">
                      Explore Directory <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* Trust Features */}
        <section className="bg-muted/30 py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Built on Trust & Technology</h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">AI-Powered Forensics</h3>
                      <p className="text-muted-foreground">
                        Multi-agent AI system with computer vision and forensic analysis
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Blockchain Verified</h3>
                      <p className="text-muted-foreground">
                        Immutable proof anchored to Hedera Hashgraph
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Privacy-First</h3>
                      <p className="text-muted-foreground">
                        Encrypted storage and hashed account numbers for security
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Lightning Fast</h3>
                      <p className="text-muted-foreground">
                        Results in seconds, not hours or days
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-success/20 shadow-elegant flex items-center justify-center">
                  <Shield className="h-32 w-32 text-primary opacity-20" />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Built With Section */}
        <section className="bg-muted/30 py-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Built with World-Class Technology</h2>
              <p className="text-lg text-muted-foreground">
                Enterprise-grade infrastructure powering trust verification
              </p>
            </div>
            <TechStackCarousel />
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Protect Yourself?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of Africans using Confirmit to verify trust before they pay
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link to="/quick-scan">
                    Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/business/register">
                    Register Your Business
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
