import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SuppliersTable from "./SuppliersTable";
import SupplierForm from "./SupplierForm";
import PurchaseOrderForm from "./PurchaseOrderForm";
import CollapsibleSidebar from "../layout/CollapsibleSidebar";
import { useSidebar } from "@/context/SidebarContext";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstin?: string;
}

const PurchasePage = () => {
  const [activeTab, setActiveTab] = useState("suppliers");
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const { isCollapsed } = useSidebar();

  // Mock suppliers data
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "ABC Enterprises",
      contactPerson: "John Doe",
      phone: "+91 9876543210",
      email: "john@abcenterprises.com",
      address: "123 Main St, Mumbai, Maharashtra",
      gstin: "27AABCU9603R1ZX",
    },
    {
      id: "2",
      name: "XYZ Distributors",
      contactPerson: "Jane Smith",
      phone: "+91 8765432109",
      email: "jane@xyzdistributors.com",
      address: "456 Park Ave, Delhi, Delhi",
      gstin: "07AAACX8612R1Z7",
    },
    {
      id: "3",
      name: "Global Supplies",
      contactPerson: "Raj Kumar",
      phone: "+91 7654321098",
      email: "raj@globalsupplies.com",
      address: "789 Market Rd, Bangalore, Karnataka",
      gstin: "29AADCG4538Q1ZP",
    },
  ]);

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setShowSupplierForm(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierForm(true);
  };

  const handleDeleteSupplier = (id: string) => {
    // In a real app, you would call an API to delete the supplier
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  const handleSupplierFormSubmit = (data: any) => {
    // In a real app, you would call an API to save the supplier
    if (selectedSupplier) {
      // Update existing supplier
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === selectedSupplier.id
            ? { ...supplier, ...data, id: selectedSupplier.id }
            : supplier,
        ),
      );
    } else {
      // Add new supplier
      const newSupplier = {
        id: `${suppliers.length + 1}`,
        ...data,
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setShowSupplierForm(false);
  };

  const handleSupplierFormCancel = () => {
    setShowSupplierForm(false);
    setSelectedSupplier(null);
  };

  const handlePurchaseOrderSubmit = (data: any) => {
    // In a real app, you would call an API to save the purchase order
    console.log("Purchase order submitted:", data);
    // Show success message or redirect
  };

  return (
    <div className="flex h-screen bg-white">
      <CollapsibleSidebar />
      <div
        className={`flex-1 transition-all duration-300 bg-gray-50 p-6 ${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Purchase Management
          </h1>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 bg-white border">
              <TabsTrigger value="suppliers" className="text-base">
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="purchase-orders" className="text-base">
                Purchase Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suppliers" className="space-y-6">
              {showSupplierForm ? (
                <SupplierForm
                  initialData={
                    selectedSupplier
                      ? {
                          name: selectedSupplier.name,
                          contactPerson: selectedSupplier.contactPerson,
                          email: selectedSupplier.email,
                          phone: selectedSupplier.phone,
                          address: selectedSupplier.address,
                          gstNumber: selectedSupplier.gstin || "",
                          notes: "",
                        }
                      : undefined
                  }
                  onSubmit={handleSupplierFormSubmit}
                  onCancel={handleSupplierFormCancel}
                />
              ) : (
                <SuppliersTable
                  suppliers={suppliers}
                  onEdit={handleEditSupplier}
                  onDelete={handleDeleteSupplier}
                  onAdd={handleAddSupplier}
                />
              )}
            </TabsContent>

            <TabsContent value="purchase-orders" className="space-y-6">
              <PurchaseOrderForm
                suppliers={suppliers.map((s) => ({ id: s.id, name: s.name }))}
                onSubmit={handlePurchaseOrderSubmit}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
