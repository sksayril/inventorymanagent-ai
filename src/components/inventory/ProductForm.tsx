import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import {
  Package,
  DollarSign,
  Percent,
  Tag,
  Barcode,
  AlertCircle,
} from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters" }),
  sku: z.string().min(3, { message: "SKU must be at least 3 characters" }),
  barcode: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().optional(),
  purchasePrice: z.string().min(1, { message: "Purchase price is required" }),
  sellingPrice: z.string().min(1, { message: "Selling price is required" }),
  taxRate: z.string().optional(),
  stockQuantity: z.string().min(1, { message: "Stock quantity is required" }),
  minStockLevel: z
    .string()
    .min(1, { message: "Minimum stock level is required" }),
  isActive: z.boolean().default(true),
});

interface ProductFormProps {
  initialData?: z.infer<typeof formSchema>;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  isEditing?: boolean;
}

const ProductForm = ({
  initialData = {
    name: "",
    sku: "",
    barcode: "",
    category: "",
    description: "",
    purchasePrice: "",
    sellingPrice: "",
    taxRate: "18",
    stockQuantity: "0",
    minStockLevel: "5",
    isActive: true,
  },
  onSubmit = (data) => console.log("Form submitted:", data),
  isEditing = false,
}: ProductFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-md">
      <CardHeader className="bg-sky-600 text-white">
        <CardTitle className="text-xl font-semibold">
          {isEditing ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6 pt-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Package className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="Enter product name"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="Enter SKU"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Barcode className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="Enter barcode (optional)"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="food">Food & Beverages</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description (optional)"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST Rate (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Percent className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            type="number"
                            placeholder="18"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Standard GST rate is 18%
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Inventory Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Inventory Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minStockLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Stock Level*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AlertCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            type="number"
                            placeholder="5"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Alert will be shown when stock falls below this level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Inactive products won't appear in sales forms
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
              {isEditing ? "Update Product" : "Add Product"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProductForm;
