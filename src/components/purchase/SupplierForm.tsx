import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Define the form schema using zod
const supplierFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  contactPerson: z
    .string()
    .min(2, { message: "Contact person name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address is required" }),
  gstNumber: z.string().optional(),
  notes: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface SupplierFormProps {
  initialData?: SupplierFormValues;
  onSubmit?: (data: SupplierFormValues) => void;
  onCancel?: () => void;
}

const SupplierForm = ({
  initialData = {
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
    notes: "",
  },
  onSubmit = () => {},
  onCancel = () => {},
}: SupplierFormProps) => {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: SupplierFormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          {initialData.name ? "Edit Supplier" : "Add New Supplier"}
        </CardTitle>
        <CardDescription>
          {initialData.name
            ? "Update the supplier information below"
            : "Fill in the supplier details to add them to your system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter contact person name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter GST number (if applicable)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Enter the supplier's GST identification number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter complete address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Additional notes about this supplier"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Add any additional information about this
                        supplier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <CardFooter className="flex justify-end space-x-4 px-0">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                <Save className="mr-2 h-4 w-4" />
                {initialData.name ? "Update Supplier" : "Add Supplier"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SupplierForm;
