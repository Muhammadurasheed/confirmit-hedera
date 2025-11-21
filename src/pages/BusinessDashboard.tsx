import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TrustScoreGauge from "@/components/shared/TrustScoreGauge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import TrustIdNftCard from "@/components/shared/TrustIdNftCard";
import { ApiKeysManagement } from "@/components/features/business/ApiKeysManagement";
import { UsageAnalytics } from "@/components/features/business/UsageAnalytics";
import { WebhookManagement } from "@/components/features/business/WebhookManagement";
import { getBusiness, getBusinessStats, generateApiKey } from "@/services/business";
import { Business, BusinessStats } from "@/types";
import {
  Eye,
  Shield,
  TrendingUp,
  Key,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
  Users,
  Share2,
  Code,
  ExternalLink,
  QrCode,
  Star,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BusinessDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Fetch business data first
        const businessData = await getBusiness(id);
        setBusiness(businessData.data);

        // Only fetch stats if business is approved
        if (businessData.data.verification?.status === 'approved') {
          try {
            const statsData = await getBusinessStats(id);
            setStats(statsData.stats);
          } catch (statsError) {
            // Stats might not be available yet, use defaults
            console.warn('Stats not available:', statsError);
            setStats({
              profileViews: 0,
              verifications: 0,
              successfulTransactions: 0,
            });
          }
        } else {
          // Business not approved yet, use default stats
          setStats({
            profileViews: 0,
            verifications: 0,
            successfulTransactions: 0,
          });
        }
      } catch (error: any) {
        toast.error("Failed to load business data", {
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleGenerateApiKey = async () => {
    if (!id) return;

    setGeneratingKey(true);
    try {
      const response = await generateApiKey(id);
      setNewApiKey(response.api_key);
      toast.success("API Key Generated", {
        description: "Store it securely - it won't be shown again.",
      });
    } catch (error: any) {
      toast.error("Failed to generate API key", {
        description: error.message,
      });
    } finally {
      setGeneratingKey(false);
    }
  };

  const copyApiKey = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey);
      toast.success("API key copied to clipboard");
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/business/profile/${id}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const handleCopyEmbedCode = () => {
    const embedCode = `<div data-legit-business="${id}" data-legit-widget="badge"></div>\n<script src="${window.location.origin}/widget.js"></script>`;
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied! Paste it in your website.");
  };

  const daysActive = business?.createdAt 
    ? Math.floor((Date.now() - new Date(business.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "under_review":
        return "bg-primary text-primary-foreground";
      case "rejected":
        return "bg-danger text-danger-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Mock analytics data - would come from backend in production
  const analyticsData = [
    { month: "Jan", views: 400, verifications: 240 },
    { month: "Feb", views: 600, verifications: 380 },
    { month: "Mar", views: 800, verifications: 520 },
    { month: "Apr", views: 1100, verifications: 680 },
    { month: "May", views: 1400, verifications: 890 },
    { month: "Jun", views: 1800, verifications: 1100 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Business Not Found</CardTitle>
              <CardDescription>
                The business you're looking for doesn't exist or you don't have access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/business">Back to Business Directory</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Show pending approval message if not approved yet
  if (business.verification?.status !== 'approved') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-warning/10 p-4 rounded-full">
                  <Clock className="h-12 w-12 text-warning" />
                </div>
              </div>
              <CardTitle className="text-2xl">Application Under Review</CardTitle>
              <CardDescription className="text-base mt-2">
                Your business registration is being reviewed by our team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm mb-2"><strong>Business Name:</strong> {business.name}</p>
                <p className="text-sm mb-2"><strong>Business ID:</strong> <code className="bg-background px-2 py-1 rounded text-xs">{id}</code></p>
                <p className="text-sm"><strong>Status:</strong> <Badge variant="outline" className="ml-2 bg-warning/10 text-warning border-warning capitalize">{business.verification?.status || 'Pending'}</Badge></p>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>✓ Payment confirmed</p>
                <p>⏳ Verification in progress (24-48 hours)</p>
                <p>📧 You'll receive an email once approved</p>
              </div>
              <div className="pt-4 flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/">Back to Home</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to={`/business/profile/${id}`}>View Public Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="text-sm">
                    {business.category}
                  </Badge>
                  <Badge
                    className={getVerificationStatusColor(business.verification.status)}
                  >
                    {getVerificationIcon(business.verification.status)}
                    <span className="ml-2 capitalize">{business.verification.status}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Tier {business.verification.tier}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TrustScoreGauge score={business.trustScore} size="md" />
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
              <TabsTrigger value="api">API Integration</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card className="shadow-elegant border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Promote your verified business
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={handleShareProfile}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Your Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={handleCopyEmbedCode}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Get Badge Code
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => window.open(`/business/${id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${window.location.origin}/business/profile/${id}`;
                      window.open(qrUrl, '_blank');
                    }}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 md:grid-cols-4"
              >
                <Card className="shadow-elegant">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                    <Star className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{business?.trustScore || 0}<span className="text-lg text-muted-foreground">/100</span></div>
                    <p className="text-xs text-success mt-1">
                      +15% this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats?.profileViews || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total views
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats?.verifications || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Successful checks
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Days Active</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{daysActive}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Since registration
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Latest interactions with your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Eye className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">15 people viewed your profile</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-success/10">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Account verified by customer</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-warning/10">
                        <Star className="h-4 w-4 text-warning" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Trust score increased to {business?.trustScore || 95}</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust ID NFT - Show prominently if business is verified */}
              {business.hedera?.trustIdNft && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <TrustIdNftCard
                    tokenId={business.hedera.trustIdNft.tokenId}
                    serialNumber={business.hedera.trustIdNft.serialNumber}
                    explorerUrl={business.hedera.trustIdNft.explorerUrl}
                    trustScore={business.trustScore}
                    verificationTier={business.verification?.tier || 1}
                    businessName={business.name}
                  />
                </motion.div>
              )}

              {/* Business Information */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                      <p className="text-sm">{business.contact.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                      <p className="text-sm">{business.contact.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                      <p className="text-sm">{business.contact.address}</p>
                    </div>
                  </div>
                  <Separator />
                  {business.bankAccount && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Bank Account
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{business.bankAccount.accountName || 'Not provided'}</p>
                        {business.bankAccount.verified && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {business.bankAccount.bankCode && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Bank Code: {business.bankAccount.bankCode}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <UsageAnalytics businessId={id!} stats={{
                totalRequests: stats?.verifications || 1247,
                successRate: 98.2,
                avgResponseTime: 4.2,
                requestsThisMonth: stats?.verifications || 892,
                requestsLastMonth: 654,
              }} />
            </TabsContent>

            {/* API Integration Tab */}
            <TabsContent value="api" className="space-y-6">
              <ApiKeysManagement 
                businessId={id!}
                existingKeys={business.apiKeys}
                onGenerateKey={async () => {
                  const response = await generateApiKey(id!);
                  return response.api_key;
                }}
              />
            </TabsContent>

            {/* Webhooks Tab */}
            <TabsContent value="webhooks" className="space-y-6">
              <WebhookManagement businessId={id!} />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                  <CardDescription>
                    Manage your business profile and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Settings panel coming soon. Contact support for any changes needed.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessDashboard;
