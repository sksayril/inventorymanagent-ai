import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Plus, UserPlus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  createdAt: string;
}

interface CustomersTableProps {
  customers?: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
  onAddNew?: () => void;
}

const CustomersTable = ({
  customers = [
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
  ],
  onEdit = () => {},
  onDelete = () => {},
  onAddNew = () => {},
}: CustomersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.gstNumber && customer.gstNumber.includes(searchTerm)),
  );

  return (
    <div className="w-full space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
        <Button onClick={onAddNew} className="bg-sky-500 hover:bg-sky-600">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Table>
        <TableCaption>List of all customers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>GST Number</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.gstNumber || "N/A"}</TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(customer)}
                      className="h-8 w-8 text-sky-500 hover:text-sky-600 hover:bg-sky-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(customer.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                No customers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomersTable;
