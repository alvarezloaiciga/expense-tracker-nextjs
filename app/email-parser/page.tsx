import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Clock } from "lucide-react"

const emails = [
  {
    id: "1",
    source: "Chase",
    subject: "Your Chase card was charged $87.32 at Whole Foods",
    received: "2023-05-30T14:23:45",
    status: "processed",
    transaction: {
      vendor: "Whole Foods",
      amount: 87.32,
      date: "2023-05-30",
      category: "Groceries",
      card: "Chase Sapphire",
    },
  },
  {
    id: "2",
    source: "American Express",
    subject: "You just made a purchase of $34.56 at Amazon",
    received: "2023-05-29T09:12:34",
    status: "processed",
    transaction: {
      vendor: "Amazon",
      amount: 34.56,
      date: "2023-05-29",
      category: "Shopping",
      card: "Amex Gold",
    },
  },
  {
    id: "3",
    source: "Chase",
    subject: "Your Chase card was charged $5.67 at Starbucks",
    received: "2023-05-28T08:45:12",
    status: "processed",
    transaction: {
      vendor: "Starbucks",
      amount: 5.67,
      date: "2023-05-28",
      category: "Dining",
      card: "Chase Sapphire",
    },
  },
  {
    id: "4",
    source: "American Express",
    subject: "Receipt for your payment to Uber",
    received: "2023-05-27T19:34:56",
    status: "processed",
    transaction: {
      vendor: "Uber",
      amount: 23.45,
      date: "2023-05-27",
      category: "Transportation",
      card: "Amex Gold",
    },
  },
  {
    id: "5",
    source: "Netflix",
    subject: "Your Netflix subscription was charged",
    received: "2023-05-26T00:00:00",
    status: "processed",
    transaction: {
      vendor: "Netflix",
      amount: 14.99,
      date: "2023-05-26",
      category: "Entertainment",
      card: "Chase Sapphire",
    },
  },
  {
    id: "6",
    source: "Unknown Sender",
    subject: "Your receipt from recent purchase",
    received: "2023-05-25T15:23:45",
    status: "failed",
    error: "Could not identify vendor from email content",
  },
  {
    id: "7",
    source: "Bank of America",
    subject: "Transaction Alert: $45.67 at Gas Station",
    received: "2023-05-24T12:34:56",
    status: "pending",
  },
]

export default function EmailParserPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Parser</h1>
          <p className="text-muted-foreground">Monitor and debug email transaction parsing</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline">Refresh</Button>
          <Button>Connect Email</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <CardTitle>Recent Emails</CardTitle>
            <Tabs defaultValue="all" className="mt-2 sm:mt-0">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="processed">Processed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>{email.source}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{email.subject}</TableCell>
                    <TableCell>{new Date(email.received).toLocaleString()}</TableCell>
                    <TableCell>
                      {email.status === "processed" ? (
                        <Badge className="bg-green-500">
                          <Check className="mr-1 h-3 w-3" /> Processed
                        </Badge>
                      ) : email.status === "failed" ? (
                        <Badge variant="destructive">
                          <X className="mr-1 h-3 w-3" /> Failed
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="mr-1 h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Parser Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Raw Email</h3>
              <div className="rounded-md bg-muted p-4 font-mono text-sm h-[400px] overflow-auto">
                <p className="text-xs text-muted-foreground mb-2">From: Chase &lt;no-reply@chase.com&gt;</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Subject: Your Chase card was charged $87.32 at Whole Foods
                </p>
                <p>Dear Customer,</p>
                <p className="mt-2">
                  This is to notify you that a charge of $87.32 was made to your Chase Sapphire card at Whole Foods on
                  May 30, 2023.
                </p>
                <p className="mt-2">Transaction Details:</p>
                <ul className="list-disc pl-4 mt-2">
                  <li>Merchant: Whole Foods</li>
                  <li>Amount: $87.32</li>
                  <li>Date: May 30, 2023</li>
                  <li>Card: Chase Sapphire ending in 1234</li>
                </ul>
                <p className="mt-4">
                  If you did not make this transaction, please contact us immediately at 1-800-432-3117.
                </p>
                <p className="mt-4">Thank you for being a Chase customer.</p>
                <p className="mt-2">Sincerely,</p>
                <p>Chase Customer Service</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Extracted Data</h3>
              <div className="rounded-md bg-muted p-4 font-mono text-sm h-[400px] overflow-auto">
                <pre className="text-sm">
                  {JSON.stringify(
                    {
                      source: "Chase",
                      extracted: {
                        vendor: "Whole Foods",
                        amount: 87.32,
                        date: "2023-05-30",
                        card: "Chase Sapphire",
                      },
                      ai_categorization: {
                        category: "Groceries",
                        confidence: 0.95,
                        alternatives: [
                          { category: "Shopping", confidence: 0.03 },
                          { category: "Other", confidence: 0.02 },
                        ],
                      },
                      processing: {
                        status: "success",
                        timestamp: "2023-05-30T14:25:12Z",
                        duration_ms: 234,
                      },
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline">Mark as Failed</Button>
            <Button variant="outline">Reprocess</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
