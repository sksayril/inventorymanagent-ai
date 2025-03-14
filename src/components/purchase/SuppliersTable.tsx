import React, { useState } from "react";
import { Edit, Trash2, Search, Plus, Phone, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstin?: string;
}

interface SuppliersTableProps {
  suppliers?: Supplier[];
  onEdit?: (supplier: Supplier) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

const SuppliersTable = ({
  suppliers = [
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
  ],
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
}: SuppliersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Suppliers</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search suppliers..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={onAdd}
            className="bg-[#1E90FF] hover:bg-[#1E90FF]/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-3 w-3 text-gray-500" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3 text-gray-500" />
                        {supplier.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.gstin || "N/A"}</TableCell>
                  <TableCell
                    className="max-w-xs truncate"
                    title={supplier.address}
                  >
                    {supplier.address}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(supplier)}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(supplier.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SuppliersTable;
