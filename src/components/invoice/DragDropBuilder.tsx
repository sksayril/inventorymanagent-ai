import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Image,
  Type,
  Table,
  FileText,
  Grid,
  Layout,
  Save,
  X,
  Move,
} from "lucide-react";

interface ElementProps {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
}

interface DragDropBuilderProps {
  templateId?: string;
  onSave?: (elements: ElementProps[]) => void;
}

const DragDropBuilder = ({
  templateId = "new-template",
  onSave,
}: DragDropBuilderProps) => {
  const [elements, setElements] = useState<ElementProps[]>([
    {
      id: "header-1",
      type: "text",
      content: "INVOICE",
      position: { x: 350, y: 50 },
    },
    {
      id: "company-logo",
      type: "image",
      content: "https://api.dicebear.com/7.x/avataaars/svg?seed=company",
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
    },
    {
      id: "table-1",
      type: "table",
      content: "Products Table",
      position: { x: 50, y: 200 },
      size: { width: 700, height: 300 },
    },
  ]);

  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [showElementDialog, setShowElementDialog] = useState(false);
  const [newElementType, setNewElementType] = useState("text");
  const [newElementContent, setNewElementContent] = useState("");

  const addElement = () => {
    const newElement: ElementProps = {
      id: `element-${Date.now()}`,
      type: newElementType,
      content: newElementContent || getDefaultContent(newElementType),
      position: { x: 100, y: 100 },
    };

    if (newElementType === "table" || newElementType === "image") {
      newElement.size = {
        width: newElementType === "table" ? 600 : 150,
        height: newElementType === "table" ? 250 : 150,
      };
    }

    setElements([...elements, newElement]);
    setShowElementDialog(false);
    setNewElementContent("");
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "text":
        return "Text Element";
      case "image":
        return "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder";
      case "table":
        return "Products Table";
      case "gst":
        return "GST Details";
      default:
        return "New Element";
    }
  };

  const handleDragEnd = (id: string, newPosition: { x: number; y: number }) => {
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, position: newPosition } : el,
      ),
    );
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    setActiveElement(null);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(elements);
    }
    alert("Template saved successfully!");
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-5 w-5" />;
      case "image":
        return <Image className="h-5 w-5" />;
      case "table":
        return <Table className="h-5 w-5" />;
      case "gst":
        return <FileText className="h-5 w-5" />;
      case "layout":
        return <Layout className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Invoice Template Builder</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowElementDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Element
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> Save Template
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Elements palette */}
        <div className="w-64 border-r p-4 bg-gray-50 overflow-y-auto">
          <h3 className="font-medium mb-3">Elements</h3>
          <div className="space-y-2">
            {["text", "image", "table", "gst", "layout"].map((type) => (
              <div
                key={type}
                className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setNewElementType(type);
                  setShowElementDialog(true);
                }}
              >
                {getElementIcon(type)}
                <span className="ml-2 capitalize">{type}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-3">Template Properties</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Template Name
                </label>
                <Input defaultValue={templateId} />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Paper Size
                </label>
                <Select defaultValue="a4">
                  <SelectTrigger>
                    <SelectValue placeholder="Select paper size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Main canvas area */}
        <div className="flex-1 bg-gray-100 overflow-auto p-8 relative">
          <div
            className="bg-white shadow-md mx-auto"
            style={{ width: "794px", height: "1123px", position: "relative" }}
          >
            {elements.map((element) => (
              <motion.div
                key={element.id}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  handleDragEnd(element.id, {
                    x: element.position.x + info.offset.x,
                    y: element.position.y + info.offset.y,
                  });
                }}
                initial={{ x: element.position.x, y: element.position.y }}
                animate={{ x: element.position.x, y: element.position.y }}
                className={`absolute cursor-move ${activeElement === element.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setActiveElement(element.id)}
                style={
                  element.size
                    ? { width: element.size.width, height: element.size.height }
                    : {}
                }
              >
                <div className="relative group">
                  {activeElement === element.id && (
                    <div className="absolute -top-8 right-0 flex bg-white shadow rounded z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeElement(element.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Move className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {element.type === "text" && (
                    <div className="p-2 border bg-white">
                      <p>{element.content}</p>
                    </div>
                  )}

                  {element.type === "image" && (
                    <div className="border bg-white overflow-hidden">
                      <img
                        src={element.content}
                        alt="Template element"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {element.type === "table" && (
                    <div className="border bg-white p-2 overflow-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border p-2">Item</th>
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Qty</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-2">1</td>
                            <td className="border p-2">Product Name</td>
                            <td className="border p-2">2</td>
                            <td className="border p-2">₹500.00</td>
                            <td className="border p-2">₹1,000.00</td>
                          </tr>
                          <tr>
                            <td className="border p-2">2</td>
                            <td className="border p-2">Another Product</td>
                            <td className="border p-2">1</td>
                            <td className="border p-2">₹750.00</td>
                            <td className="border p-2">₹750.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {element.type === "gst" && (
                    <div className="border bg-white p-3">
                      <h3 className="font-medium mb-2">GST Details</h3>
                      <div className="space-y-1 text-sm">
                        <p>CGST (9%): ₹157.50</p>
                        <p>SGST (9%): ₹157.50</p>
                        <p>Total Tax: ₹315.00</p>
                        <p className="font-medium mt-2">
                          Grand Total: ₹2,065.00
                        </p>
                      </div>
                    </div>
                  )}

                  {element.type === "layout" && (
                    <div
                      className="border bg-white p-2 grid grid-cols-2 gap-2"
                      style={{ minHeight: "100px" }}
                    >
                      <div className="border p-2 bg-gray-50">Column 1</div>
                      <div className="border p-2 bg-gray-50">Column 2</div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right sidebar - Properties panel */}
        {activeElement && (
          <div className="w-72 border-l p-4 bg-gray-50 overflow-y-auto">
            <h3 className="font-medium mb-3">Element Properties</h3>
            <Tabs defaultValue="style">
              <TabsList className="w-full">
                <TabsTrigger value="style" className="flex-1">
                  Style
                </TabsTrigger>
                <TabsTrigger value="position" className="flex-1">
                  Position
                </TabsTrigger>
              </TabsList>
              <TabsContent value="style" className="space-y-3 mt-3">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Content
                  </label>
                  <Input
                    value={
                      elements.find((el) => el.id === activeElement)?.content ||
                      ""
                    }
                    onChange={(e) => {
                      setElements(
                        elements.map((el) =>
                          el.id === activeElement
                            ? { ...el, content: e.target.value }
                            : el,
                        ),
                      );
                    }}
                  />
                </div>
                {elements.find((el) => el.id === activeElement)?.type ===
                  "text" && (
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">
                      Font Size
                    </label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="position" className="space-y-3 mt-3">
                {elements.find((el) => el.id === activeElement) && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">
                          X Position
                        </label>
                        <Input
                          type="number"
                          value={
                            elements.find((el) => el.id === activeElement)
                              ?.position.x
                          }
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setElements(
                              elements.map((el) =>
                                el.id === activeElement
                                  ? {
                                      ...el,
                                      position: { ...el.position, x: value },
                                    }
                                  : el,
                              ),
                            );
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">
                          Y Position
                        </label>
                        <Input
                          type="number"
                          value={
                            elements.find((el) => el.id === activeElement)
                              ?.position.y
                          }
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setElements(
                              elements.map((el) =>
                                el.id === activeElement
                                  ? {
                                      ...el,
                                      position: { ...el.position, y: value },
                                    }
                                  : el,
                              ),
                            );
                          }}
                        />
                      </div>
                    </div>
                    {elements.find((el) => el.id === activeElement)?.size && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">
                            Width
                          </label>
                          <Input
                            type="number"
                            value={
                              elements.find((el) => el.id === activeElement)
                                ?.size?.width
                            }
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              setElements(
                                elements.map((el) =>
                                  el.id === activeElement
                                    ? {
                                        ...el,
                                        size: { ...el.size!, width: value },
                                      }
                                    : el,
                                ),
                              );
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">
                            Height
                          </label>
                          <Input
                            type="number"
                            value={
                              elements.find((el) => el.id === activeElement)
                                ?.size?.height
                            }
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              setElements(
                                elements.map((el) =>
                                  el.id === activeElement
                                    ? {
                                        ...el,
                                        size: { ...el.size!, height: value },
                                      }
                                    : el,
                                ),
                              );
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Add Element Dialog */}
      <Dialog open={showElementDialog} onOpenChange={setShowElementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Element</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium block mb-1">
                Element Type
              </label>
              <Select value={newElementType} onValueChange={setNewElementType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select element type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="gst">GST Details</SelectItem>
                  <SelectItem value="layout">Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Content</label>
              <Input
                placeholder={`Enter ${newElementType} content`}
                value={newElementContent}
                onChange={(e) => setNewElementContent(e.target.value)}
              />
              {newElementType === "image" && (
                <p className="text-xs text-gray-500 mt-1">
                  Enter image URL or leave blank for placeholder
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowElementDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={addElement}>Add Element</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DragDropBuilder;
