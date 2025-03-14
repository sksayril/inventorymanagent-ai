import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const MetricCard = ({
  title = "Metric",
  value = "$0",
  description = "No data available",
  icon = <DollarSign className="h-5 w-5 text-muted-foreground" />,
  trend,
}: MetricCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-sky-100 p-1.5 text-sky-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-sm text-muted-foreground">
          {trend && (
            <span
              className={`mr-1 flex items-center ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {trend.isPositive ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {trend.value}
            </span>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricsOverviewProps {
  metrics?: {
    totalRevenue: string;
    totalSales: number;
    totalProducts: number;
    lowStockItems: number;
  };
}

const MetricsOverview = ({
  metrics = {
    totalRevenue: "$24,780",
    totalSales: 432,
    totalProducts: 156,
    lowStockItems: 8,
  },
}: MetricsOverviewProps) => {
  return (
    <div className="w-full bg-white">
      <h2 className="text-xl font-semibold mb-4">Business Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          description="This month"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: "12%", isPositive: true }}
        />
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales.toString()}
          description="This month"
          icon={<ShoppingCart className="h-5 w-5" />}
          trend={{ value: "5%", isPositive: true }}
        />
        <MetricCard
          title="Total Products"
          value={metrics.totalProducts.toString()}
          description="In inventory"
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Low Stock Items"
          value={metrics.lowStockItems.toString()}
          description="Need attention"
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: "3", isPositive: false }}
        />
      </div>
    </div>
  );
};

export default MetricsOverview;
