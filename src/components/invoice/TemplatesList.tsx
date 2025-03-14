import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Plus, Edit, Trash2, Copy, Eye } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastModified: string;
  isDefault?: boolean;
}

interface TemplatesListProps {
  templates?: Template[];
  onSelect?: (templateId: string) => void;
  onNew?: () => void;
  onEdit?: (templateId: string) => void;
  onDelete?: (templateId: string) => void;
  onDuplicate?: (templateId: string) => void;
  onPreview?: (templateId: string) => void;
  selectedTemplateId?: string;
}

const TemplatesList = ({
  templates = [
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
  ],
  onSelect = (id) => console.log(`Selected template: ${id}`),
  onNew = () => console.log("Create new template"),
  onEdit = (id) => console.log(`Edit template: ${id}`),
  onDelete = (id) => console.log(`Delete template: ${id}`),
  onDuplicate = (id) => console.log(`Duplicate template: ${id}`),
  onPreview = (id) => console.log(`Preview template: ${id}`),
  selectedTemplateId = "1",
}: TemplatesListProps) => {
  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Invoice Templates
          </h2>
          <Button onClick={onNew} className="bg-sky-600 hover:bg-sky-700">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[700px] p-4">
        <div className="space-y-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:border-sky-400 ${selectedTemplateId === template.id ? "border-2 border-sky-600" : ""}`}
              onClick={() => onSelect(template.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {template.name}
                      {template.isDefault && (
                        <span className="ml-2 text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-gray-500">
                  <p>Created: {template.createdAt}</p>
                  <p>Last modified: {template.lastModified}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(template.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(template.id);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(template.id);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {!template.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(template.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TemplatesList;
