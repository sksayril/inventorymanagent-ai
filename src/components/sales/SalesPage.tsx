import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, FileText } from "lucide-react";
import CustomersTable from "./CustomersTable";
import CustomerForm from "./CustomerForm";
import InvoiceForm from "./InvoiceForm";
import CollapsibleSidebar from "../layout/CollapsibleSidebar";
import { useSidebar } from "@/context/SidebarContext";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  createdAt: string;
}

const SalesPage = () => {
  const [activeTab, setActiveTab] = useState("customers");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { isCollapsed } = useSidebar();

  // Sample customers data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "123-456-7890",
      address: "123 Business Ave, Commerce City",
      gstNumber: "GST1234567890",
      createdAt: "2023-05-15",
    },
    {
      id: "2",
      name: "Tech Solutions Inc",
      email: "info@techsolutions.com",
      phone: "987-654-3210",
      address: "456 Innovation St, Tech Valley",
      gstNumber: "GST0987654321",
      createdAt: "2023-06-20",
    },
    {
      id: "3",
      name: "Global Traders",
      email: "sales@globaltraders.com",
      phone: "555-123-4567",
      address: "789 Market Blvd, Trade City",
      gstNumber: "GST5555555555",
      createdAt: "2023-07-10",
    },
  ]);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowCustomerForm(true);
    setShowInvoiceForm(false);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
    setShowInvoiceForm(false);
  };

  const handleDeleteCustomer = (customerId: string) => {
    // In a real app, you would call an API to delete the customer
    setCustomers(customers.filter((c) => c.id !== customerId));
  };

  const handleCreateInvoice = () => {
    setShowInvoiceForm(true);
    setShowCustomerForm(false);
  };

  const handleBackToList = () => {
    setShowCustomerForm(false);
    setShowInvoiceForm(false);
    setEditingCustomer(null);
  };

  const handleCustomerSubmit = (data: any) => {
    // In a real app, you would call an API to save the customer
    if (editingCustomer) {
      // Update existing customer
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, ...data, id: editingCustomer.id }
            : c,
        ),
      );
    } else {
      // Add new customer
      const newCustomer = {
        ...data,
        id: `${customers.length + 1}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCustomers([...customers, newCustomer]);
    }
    setShowCustomerForm(false);
  };

  const handleInvoiceSubmit = (data: any) => {
    // In a real app, you would call an API to save the invoice
    console.log("Invoice submitted:", data);
    setShowInvoiceForm(false);
  };

  return (
    <div className="flex h-screen bg-white">
      <CollapsibleSidebar />
      <div
        className={`flex-1 transition-all duration-300 bg-gray-50 ${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
      >
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Sales Management
            </h1>
            <div className="flex space-x-3">
              <Button
                onClick={handleAddCustomer}
                className="bg-sky-500 hover:bg-sky-600"
              >
                <Users className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
              <Button
                onClick={handleCreateInvoice}
                className="bg-sky-500 hover:bg-sky-600"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </div>
          </div>

          {!showCustomerForm && !showInvoiceForm ? (
            <Tabs
              defaultValue="customers"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="customers" className="text-base">
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </TabsTrigger>
                <TabsTrigger value="invoices" className="text-base">
                  <FileText className="mr-2 h-4 w-4" />
                  Invoices
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customers" className="mt-0">
                <CustomersTable
                  customers={customers}
                  onEdit={handleEditCustomer}
                  onDelete={handleDeleteCustomer}
                  onAddNew={handleAddCustomer}
                />
              </TabsContent>

              <TabsContent value="invoices" className="mt-0">
                <div className="w-full space-y-4 bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Invoices
                    </h2>
                    <Button
                      onClick={handleCreateInvoice}
                      className="bg-sky-500 hover:bg-sky-600"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Button>
                  </div>

                  {/* Placeholder for invoices table - would be a separate component in a real app */}
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No invoices created yet
                    </h3>
                    <p className="mb-4">
                      Start creating invoices for your customers to track sales.
                    </p>
                    <Button
                      onClick={handleCreateInvoice}
                      className="bg-sky-500 hover:bg-sky-600"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Invoice
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : showCustomerForm ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={handleBackToList}
                  className="mb-4"
                >
                  ← Back to Customers
                </Button>
              </div>
              <CustomerForm
                onSubmit={handleCustomerSubmit}
                initialData={editingCustomer || undefined}
                isEditing={!!editingCustomer}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={handleBackToList}
                  className="mb-4"
                >
                  ← Back to Sales
                </Button>
              </div>
              <InvoiceForm
                onSubmit={handleInvoiceSubmit}
                customers={customers.map((c) => ({ id: c.id, name: c.name }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
