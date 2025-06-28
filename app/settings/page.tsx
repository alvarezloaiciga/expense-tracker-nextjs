import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Mail, BellRing, CreditCard, DollarSign, Lock } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="john.doe@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="america_new_york">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america_new_york">America/New_York (UTC-5)</SelectItem>
                    <SelectItem value="america_los_angeles">America/Los_Angeles (UTC-8)</SelectItem>
                    <SelectItem value="europe_london">Europe/London (UTC+0)</SelectItem>
                    <SelectItem value="asia_tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                </div>
                <Switch id="dark-mode" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch id="two-factor" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Integration</CardTitle>
              <CardDescription>Connect your email accounts to automatically import transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Gmail</p>
                    <p className="text-sm text-muted-foreground">john.doe@gmail.com</p>
                  </div>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Add Another Email Account</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select email provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="outlook">Outlook</SelectItem>
                      <SelectItem value="yahoo">Yahoo</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Connect</Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-import">Automatic Import</Label>
                    <p className="text-sm text-muted-foreground">Automatically import transactions from emails</p>
                  </div>
                  <Switch id="auto-import" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="import-frequency">Import Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="import-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Notification Types</Label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BellRing className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="new-transaction" className="font-normal">
                      New Transaction
                    </Label>
                  </div>
                  <Switch id="new-transaction" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="budget-alert" className="font-normal">
                      Budget Alerts
                    </Label>
                  </div>
                  <Switch id="budget-alert" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="large-transaction" className="font-normal">
                      Large Transactions
                    </Label>
                  </div>
                  <Switch id="large-transaction" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="security-alert" className="font-normal">
                      Security Alerts
                    </Label>
                  </div>
                  <Switch id="security-alert" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Settings</CardTitle>
              <CardDescription>Set monthly budgets for each category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Monthly Budget Limits</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="groceries-budget">Groceries</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                          $
                        </span>
                        <Input id="groceries-budget" type="number" defaultValue="600" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dining-budget">Dining</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                          $
                        </span>
                        <Input id="dining-budget" type="number" defaultValue="500" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entertainment-budget">Entertainment</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                          $
                        </span>
                        <Input id="entertainment-budget" type="number" defaultValue="300" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transportation-budget">Transportation</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                          $
                        </span>
                        <Input id="transportation-budget" type="number" defaultValue="400" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shopping-budget">Shopping</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                          $
                        </span>
                        <Input id="shopping-budget" type="number" defaultValue="300" className="rounded-l-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="budget-alerts">Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you reach budget thresholds</p>
                </div>
                <Switch id="budget-alerts" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-threshold">Alert Threshold</Label>
                <Select defaultValue="80">
                  <SelectTrigger id="alert-threshold">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50% of budget</SelectItem>
                    <SelectItem value="75">75% of budget</SelectItem>
                    <SelectItem value="80">80% of budget</SelectItem>
                    <SelectItem value="90">90% of budget</SelectItem>
                    <SelectItem value="100">100% of budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>Configure how AI categorizes your transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-categorization">AI Categorization</Label>
                  <p className="text-sm text-muted-foreground">Use AI to automatically categorize transactions</p>
                </div>
                <Switch id="ai-categorization" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                <Select defaultValue="80">
                  <SelectTrigger id="confidence-threshold">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60% (More AI suggestions)</SelectItem>
                    <SelectItem value="70">70%</SelectItem>
                    <SelectItem value="80">80% (Balanced)</SelectItem>
                    <SelectItem value="90">90% (Fewer AI suggestions)</SelectItem>
                    <SelectItem value="95">95% (Only high confidence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="learning-mode">Learning Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow AI to learn from your manual categorizations</p>
                </div>
                <Switch id="learning-mode" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="vendor-rules">Vendor-Based Rules</Label>
                  <p className="text-sm text-muted-foreground">Create automatic rules based on vendor names</p>
                </div>
                <Switch id="vendor-rules" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-model">AI Model</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="ai-model">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (Faster)</SelectItem>
                    <SelectItem value="standard">Standard (Recommended)</SelectItem>
                    <SelectItem value="advanced">Advanced (More accurate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
