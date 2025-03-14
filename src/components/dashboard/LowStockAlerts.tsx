import React from "react";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  category: string;
}

interface LowStockAlertsProps {
  items?: LowStockItem[];
  title?: string;
  description?: string;
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({
  items = [
    {
      id: "1",
      name: "Printer Paper A4",
      sku: "PP-A4-500",
      currentStock: 5,
      minStockLevel: 20,
      category: "Office Supplies",
    },
    {
      id: "2",
      name: "Ink Cartridge Black",
      sku: "IC-BLK-01",
      currentStock: 2,
      minStockLevel: 10,
      category: "Printer Supplies",
    },
    {
      id: "3",
      name: "Ballpoint Pens Blue",
      sku: "BP-BLU-12",
      currentStock: 8,
      minStockLevel: 25,
      category: "Office Supplies",
    },
    {
      id: "4",
      name: "Sticky Notes Yellow",
      sku: "SN-YLW-3x3",
      currentStock: 3,
      minStockLevel: 15,
      category: "Office Supplies",
    },
  ],
  title = "Low Stock Alerts",
  description = "Products that need to be restocked soon",
}) => {
  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.minStockLevel}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.currentStock === 0
                        ? "bg-red-100 text-red-800"
                        : item.currentStock <= item.minStockLevel / 3
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {item.currentStock === 0
                      ? "Out of Stock"
                      : item.currentStock <= item.minStockLevel / 3
                        ? "Critical"
                        : "Low Stock"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;
