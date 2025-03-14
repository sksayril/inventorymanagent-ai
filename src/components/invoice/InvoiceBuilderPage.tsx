import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Save, Eye, ArrowLeft } from "lucide-react";
import TemplatesList from "./TemplatesList";
import DragDropBuilder from "./DragDropBuilder";
import CollapsibleSidebar from "../layout/CollapsibleSidebar";
import { useSidebar } from "@/context/SidebarContext";

interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastModified: string;
  isDefault?: boolean;
  elements?: any[];
}

const InvoiceBuilderPage = () => {
  const [activeTab, setActiveTab] = useState<string>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const { isCollapsed } = useSidebar();

  // Mock templates data
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Standard GST Invoice",
      description: "Default template for GST invoices",
      createdAt: "2023-05-15",
      lastModified: "2023-06-20",
      isDefault: true,
    },
    {
      id: "2",
      name: "Simplified Receipt",
      description: "Compact invoice format for small businesses",
      createdAt: "2023-07-10",
      lastModified: "2023-07-10",
    },
    {
      id: "3",
      name: "Detailed Business Invoice",
      description: "Comprehensive invoice with detailed breakdown",
      createdAt: "2023-08-05",
      lastModified: "2023-09-12",
    },
  ]);

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(true);
    setActiveTab("editor");
  };

  const handleEditTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setIsEditing(true);
      setActiveTab("editor");
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
  };

  const handleDuplicateTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      const newTemplate = {
        ...template,
        id: `${template.id}-copy-${Date.now()}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        isDefault: false,
      };
      setTemplates([...templates, newTemplate]);
    }
  };

  const handlePreviewTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setPreviewMode(true);
      setActiveTab("preview");
    }
  };

  const handleSaveTemplate = (elements: any[]) => {
    if (selectedTemplate) {
      // Update existing template
      const updatedTemplates = templates.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              elements,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : t,
      );
      setTemplates(updatedTemplates);
    } else {
      // Create new template
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: "New Template",
        description: "Custom invoice template",
        createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        elements,
      };
      setTemplates([...templates, newTemplate]);
      setSelectedTemplate(newTemplate);
    }

    setIsEditing(false);
    setActiveTab("templates");
  };

  const handleBackToTemplates = () => {
    setActiveTab("templates");
    setIsEditing(false);
    setPreviewMode(false);
  };

  return (
    <div className="flex h-screen bg-white">
      <CollapsibleSidebar />
      <div
        className={`flex-1 transition-all duration-300 flex flex-col h-full bg-white ${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Invoice Template Builder
            </h1>
            <div className="flex space-x-2">
              {activeTab !== "templates" && (
                <Button variant="outline" onClick={handleBackToTemplates}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Templates
                </Button>
              )}
              {activeTab === "editor" && (
                <Button onClick={() => setPreviewMode(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "templates" && (
            <div className="h-full">
              <TemplatesList
                templates={templates}
                onSelect={handleSelectTemplate}
                onNew={handleNewTemplate}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                onDuplicate={handleDuplicateTemplate}
                onPreview={handlePreviewTemplate}
                selectedTemplateId={selectedTemplate?.id}
              />
            </div>
          )}

          {activeTab === "editor" && (
            <div className="h-full">
              <DragDropBuilder
                templateId={selectedTemplate?.id}
                onSave={handleSaveTemplate}
              />
            </div>
          )}

          {activeTab === "preview" && (
            <div className="h-full flex flex-col items-center">
              <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex justify-between items-center">
                    <span>Preview: {selectedTemplate?.name}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(true);
                          setPreviewMode(false);
                          setActiveTab("editor");
                        }}
                      >
                        Edit Template
                      </Button>
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Use Template
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-white border rounded-md p-8 min-h-[800px]">
                    {/* This would render the actual preview of the template */}
                    <div className="text-center text-2xl font-bold mb-6">
                      INVOICE
                    </div>
                    <div className="flex justify-between mb-8">
                      <div>
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=company"
                          alt="Company Logo"
                          className="w-24 h-24"
                        />
                        <div className="mt-2">
                          <p className="font-bold">Your Company Name</p>
                          <p>123 Business Street</p>
                          <p>City, State, ZIP</p>
                          <p>GST No: 22AAAAA0000A1Z5</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">Invoice #: INV-001</p>
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>
                          Due Date:{" "}
                          {new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p className="font-bold">Bill To:</p>
                      <p>Customer Name</p>
                      <p>Customer Address</p>
                      <p>City, State, ZIP</p>
                      <p>GST No: 29BBBBB0000B1Z2</p>
                    </div>

                    <table className="w-full border-collapse mb-8">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Item</th>
                          <th className="border p-2 text-left">Description</th>
                          <th className="border p-2 text-right">Qty</th>
                          <th className="border p-2 text-right">Price</th>
                          <th className="border p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">1</td>
                          <td className="border p-2">Product Name</td>
                          <td className="border p-2 text-right">2</td>
                          <td className="border p-2 text-right">₹500.00</td>
                          <td className="border p-2 text-right">₹1,000.00</td>
                        </tr>
                        <tr>
                          <td className="border p-2">2</td>
                          <td className="border p-2">Another Product</td>
                          <td className="border p-2 text-right">1</td>
                          <td className="border p-2 text-right">₹750.00</td>
                          <td className="border p-2 text-right">₹750.00</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="flex justify-end">
                      <div className="w-64">
                        <div className="flex justify-between py-2">
                          <span>Subtotal:</span>
                          <span>₹1,750.00</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span>CGST (9%):</span>
                          <span>₹157.50</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span>SGST (9%):</span>
                          <span>₹157.50</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-2 pt-2">
                          <span>Total:</span>
                          <span>₹2,065.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceBuilderPage;
