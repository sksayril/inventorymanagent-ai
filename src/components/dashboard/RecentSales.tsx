import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface SaleItem {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
  invoiceType: "GST" | "Non-GST";
}

interface RecentSalesProps {
  sales?: SaleItem[];
  title?: string;
  description?: string;
}

const RecentSales = ({
  sales = [
    {
      id: "INV-001",
      customer: {
        name: "Alex Johnson",
        email: "alex@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      },
      amount: 1250.75,
      status: "completed",
      date: "2023-06-15",
      invoiceType: "GST",
    },
    {
      id: "INV-002",
      customer: {
        name: "Sarah Williams",
        email: "sarah@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      amount: 850.5,
      status: "pending",
      date: "2023-06-14",
      invoiceType: "Non-GST",
    },
    {
      id: "INV-003",
      customer: {
        name: "Michael Chen",
        email: "michael@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      },
      amount: 2100.0,
      status: "completed",
      date: "2023-06-12",
      invoiceType: "GST",
    },
    {
      id: "INV-004",
      customer: {
        name: "Priya Sharma",
        email: "priya@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      },
      amount: 450.25,
      status: "cancelled",
      date: "2023-06-10",
      invoiceType: "Non-GST",
    },
    {
      id: "INV-005",
      customer: {
        name: "David Wilson",
        email: "david@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
      amount: 1875.3,
      status: "completed",
      date: "2023-06-08",
      invoiceType: "GST",
    },
  ],
  title = "Recent Sales",
  description = "Overview of the most recent sales transactions.",
}: RecentSalesProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <img
                        src={sale.customer.avatar}
                        alt={sale.customer.name}
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">{sale.customer.name}</p>
                      <p className="text-sm text-gray-500">
                        {sale.customer.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{sale.id}</TableCell>
                <TableCell className="font-medium">
                  ₹{sale.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={sale.invoiceType === "GST" ? "default" : "outline"}
                  >
                    {sale.invoiceType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}
                  >
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{sale.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentSales;
