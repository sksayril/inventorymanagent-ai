import React, { useState } from "react";
import ProductsTable from "./ProductsTable";
import ProductForm from "./ProductForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Package, BarChart3, ArrowDownUp } from "lucide-react";
import CollapsibleSidebar from "../layout/CollapsibleSidebar";
import { useSidebar } from "@/context/SidebarContext";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const InventoryPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const { isCollapsed } = useSidebar();

  // Sample products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Laptop HP ProBook",
      sku: "LP-001",
      category: "Electronics",
      quantity: 25,
      price: 45000,
      status: "In Stock",
    },
    {
      id: "2",
      name: "Office Chair",
      sku: "FN-002",
      category: "Furniture",
      quantity: 12,
      price: 5500,
      status: "In Stock",
    },
    {
      id: "3",
      name: "Wireless Mouse",
      sku: "AC-003",
      category: "Accessories",
      quantity: 5,
      price: 1200,
      status: "Low Stock",
    },
    {
      id: "4",
      name: "Printer Ink Cartridge",
      sku: "SP-004",
      category: "Supplies",
      quantity: 0,
      price: 850,
      status: "Out of Stock",
    },
    {
      id: "5",
      name: "Desk Lamp",
      sku: "FN-005",
      category: "Furniture",
      quantity: 18,
      price: 1800,
      status: "In Stock",
    },
  ]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    // In a real app, you would call an API to delete the product
    setProducts(products.filter((product) => product.id !== productId));
  };

  const handleFormSubmit = (data: any) => {
    // In a real app, you would call an API to add/update the product
    console.log("Form submitted:", data);
    setIsDialogOpen(false);
  };

  const handleExportProducts = () => {
    // In a real app, you would generate a CSV/Excel file
    console.log("Exporting products...");
  };

  return (
    <div className="flex h-screen bg-white">
      <CollapsibleSidebar />
      <div
        className={`flex-1 transition-all duration-300 bg-gray-50 p-6 ${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inventory Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your products, track stock levels, and monitor inventory
                status
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleExportProducts}
              >
                <ArrowDownUp size={16} />
                Import/Export
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
                    onClick={handleAddProduct}
                  >
                    <Package size={16} />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] p-0">
                  <ProductForm
                    isEditing={!!editingProduct}
                    initialData={
                      editingProduct
                        ? {
                            name: editingProduct.name,
                            sku: editingProduct.sku,
                            barcode: "",
                            category: editingProduct.category.toLowerCase(),
                            description: "",
                            purchasePrice: (
                              editingProduct.price * 0.7
                            ).toString(), // Example calculation
                            sellingPrice: editingProduct.price.toString(),
                            taxRate: "18",
                            stockQuantity: editingProduct.quantity.toString(),
                            minStockLevel: "5",
                            isActive: true,
                          }
                        : undefined
                    }
                    onSubmit={handleFormSubmit}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs
            defaultValue="products"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package size={16} />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-0">
              <ProductsTable
                products={products}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onExportProducts={handleExportProducts}
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <div className="bg-white p-6 rounded-lg shadow-sm min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Inventory Analytics
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Detailed inventory analytics and reporting features will be
                    available here. Track product performance, stock turnover
                    rates, and more.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
