import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FileDown,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface ProductsTableProps {
  products?: Product[];
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onExportProducts?: () => void;
}

const ProductsTable = ({
  products = [
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
  ],
  onAddProduct = () => console.log("Add product clicked"),
  onEditProduct = (product) => console.log("Edit product", product),
  onDeleteProduct = (id) => console.log("Delete product", id),
  onExportProducts = () => console.log("Export products clicked"),
}: ProductsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Inventory Products
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onExportProducts}
            className="flex items-center gap-2"
          >
            <FileDown size={16} />
            Export
          </Button>
          <Button
            onClick={onAddProduct}
            className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by name, SKU, or category..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{product.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                    >
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEditProduct(product)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteProduct(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No products found. Try adjusting your search or add a new
                  product.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default ProductsTable;
