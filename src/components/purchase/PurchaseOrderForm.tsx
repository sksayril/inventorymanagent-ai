import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Save } from "lucide-react";

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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  supplier: z.string().min(1, { message: "Please select a supplier" }),
  orderDate: z.string().min(1, { message: "Please select a date" }),
  expectedDeliveryDate: z.string(),
  notes: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.string().min(1, { message: "Please select a product" }),
        quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
        unitPrice: z
          .number()
          .min(0, { message: "Price must be a positive number" }),
      }),
    )
    .min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface PurchaseOrderFormProps {
  onSubmit?: (data: FormValues) => void;
  suppliers?: { id: string; name: string }[];
  products?: { id: string; name: string; price: number }[];
}

const PurchaseOrderForm = ({
  onSubmit = (data) => console.log(data),
  suppliers = [
    { id: "1", name: "ABC Suppliers" },
    { id: "2", name: "XYZ Distributors" },
    { id: "3", name: "Global Imports" },
  ],
  products = [
    { id: "1", name: "Product A", price: 10.99 },
    { id: "2", name: "Product B", price: 24.99 },
    { id: "3", name: "Product C", price: 5.99 },
    { id: "4", name: "Product D", price: 15.5 },
  ],
}: PurchaseOrderFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
      orderDate: new Date().toISOString().split("T")[0],
      expectedDeliveryDate: "",
      notes: "",
      products: [],
    },
  });

  const [supplierSelected, setSupplierSelected] = useState(false);
  const { fields, append, remove } = form.control._formValues.products || [];

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      const updatedProducts = [...form.getValues().products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId,
        unitPrice: selectedProduct.price,
      };
      form.setValue("products", updatedProducts);
    }
  };

  const addProduct = () => {
    append({ productId: "", quantity: 1, unitPrice: 0 });
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateTotal = () => {
    return form
      .getValues()
      .products.reduce(
        (total, product) => total + product.quantity * product.unitPrice,
        0,
      );
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create Purchase Order
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
                <CardDescription>
                  Select supplier and order details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSupplierSelected(true);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
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
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedDeliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Additional notes or instructions"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Items:</span>
                    <span className="text-sm">{fields?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-sm font-bold">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Add products to your purchase order
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={addProduct}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={!supplierSelected}
                >
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </div>
              {!supplierSelected && (
                <p className="text-amber-600 text-sm mt-2">
                  Please select a supplier first before adding products
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields?.map((field, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md relative"
                  >
                    <div className="col-span-2">
                      <FormLabel>Product</FormLabel>
                      <Select
                        defaultValue={field.productId}
                        onValueChange={(value) =>
                          handleProductSelect(index, value)
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
                    </div>

                    <div>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        type="number"
                        min="1"
                        defaultValue={field.quantity.toString()}
                        onChange={(e) => {
                          const updatedProducts = [
                            ...form.getValues().products,
                          ];
                          updatedProducts[index] = {
                            ...updatedProducts[index],
                            quantity: parseInt(e.target.value) || 0,
                          };
                          form.setValue("products", updatedProducts);
                        }}
                      />
                    </div>

                    <div>
                      <FormLabel>Unit Price (₹)</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={field.unitPrice.toString()}
                        onChange={(e) => {
                          const updatedProducts = [
                            ...form.getValues().products,
                          ];
                          updatedProducts[index] = {
                            ...updatedProducts[index],
                            unitPrice: parseFloat(e.target.value) || 0,
                          };
                          form.setValue("products", updatedProducts);
                        }}
                      />
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => removeProduct(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                <Save className="mr-2 h-4 w-4" /> Save Purchase Order
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PurchaseOrderForm;
