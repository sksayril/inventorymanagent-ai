import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, FileText, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formSchema = z.object({
  customer: z.string().min(1, { message: "Please select a customer" }),
  invoiceDate: z.string().min(1, { message: "Please select a date" }),
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  gstType: z.enum(["gst", "non-gst"]),
  items: z
    .array(
      z.object({
        product: z.string().min(1, { message: "Product is required" }),
        quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
        price: z
          .number()
          .min(0.01, { message: "Price must be greater than 0" }),
        gstRate: z
          .number()
          .min(0, { message: "GST rate must be 0 or greater" }),
      }),
    )
    .min(1, { message: "At least one item is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  onSubmit?: (data: FormValues) => void;
  customers?: { id: string; name: string }[];
  products?: { id: string; name: string; price: number; gstRate: number }[];
}

const InvoiceForm = ({
  onSubmit = (data) => console.log(data),
  customers = [
    { id: "1", name: "Acme Corp" },
    { id: "2", name: "Wayne Enterprises" },
    { id: "3", name: "Stark Industries" },
  ],
  products = [
    { id: "1", name: "Product A", price: 100, gstRate: 18 },
    { id: "2", name: "Product B", price: 200, gstRate: 12 },
    { id: "3", name: "Product C", price: 300, gstRate: 5 },
  ],
}: InvoiceFormProps) => {
  const [invoiceItems, setInvoiceItems] = useState([
    { id: "1", product: "", quantity: 1, price: 0, gstRate: 0 },
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
      gstType: "gst",
      items: [{ product: "", quantity: 1, price: 0, gstRate: 0 }],
    },
  });

  const addItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        id: Date.now().toString(),
        product: "",
        quantity: 1,
        price: 0,
        gstRate: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (invoiceItems.length > 1) {
      const updatedItems = [...invoiceItems];
      updatedItems.splice(index, 1);
      setInvoiceItems(updatedItems);
    }
  };

  const handleProductSelect = (productId: string, index: number) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      const updatedItems = [...invoiceItems];
      updatedItems[index] = {
        ...updatedItems[index],
        product: productId,
        price: selectedProduct.price,
        gstRate: selectedProduct.gstRate,
      };
      setInvoiceItems(updatedItems);
    }
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product);
      const price = product?.price || item.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const calculateGST = () => {
    if (form.watch("gstType") === "non-gst") return 0;

    return invoiceItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product);
      const price = product?.price || item.price;
      const gstRate = product?.gstRate || item.gstRate;
      return sum + (price * item.quantity * gstRate) / 100;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#1e88e5]">
            Create New Invoice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gstType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invoice type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gst">GST Invoice</SelectItem>
                        <SelectItem value="non-gst">Non-GST Invoice</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select whether this invoice includes GST or not
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Invoice Items</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      {form.watch("gstType") === "gst" && (
                        <TableHead>GST Rate (%)</TableHead>
                      )}
                      <TableHead>Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select
                            value={item.product}
                            onValueChange={(value) =>
                              handleProductSelect(value, index)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const updatedItems = [...invoiceItems];
                              updatedItems[index].quantity =
                                parseInt(e.target.value) || 1;
                              setInvoiceItems(updatedItems);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => {
                              const updatedItems = [...invoiceItems];
                              updatedItems[index].price =
                                parseFloat(e.target.value) || 0;
                              setInvoiceItems(updatedItems);
                            }}
                            className="w-24"
                          />
                        </TableCell>
                        {form.watch("gstType") === "gst" && (
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.gstRate}
                              onChange={(e) => {
                                const updatedItems = [...invoiceItems];
                                updatedItems[index].gstRate =
                                  parseFloat(e.target.value) || 0;
                                setInvoiceItems(updatedItems);
                              }}
                              className="w-20"
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={invoiceItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-col items-end space-y-2 pt-4">
                  <div className="flex justify-between w-64">
                    <span className="font-medium">Subtotal:</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {form.watch("gstType") === "gst" && (
                    <div className="flex justify-between w-64">
                      <span className="font-medium">GST:</span>
                      <span>₹{calculateGST().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between w-64 text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-end space-x-4 px-0">
                <Button type="button" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
