"use client";

import { DocumentState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Highlighter,
  Underline,
  MessageSquare,
  PenTool,
  MousePointer,
  Trash2,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ToolBarProps {
  documentState: DocumentState;
  setDocumentState: React.Dispatch<React.SetStateAction<DocumentState>>;
}

export function ToolBar({ documentState, setDocumentState }: ToolBarProps) {
  const { toast } = useToast();
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  const handleToolSelect = (tool: DocumentState['currentTool']) => {
    setDocumentState(prev => ({
      ...prev,
      currentTool: prev.currentTool === tool ? null : tool,
    }));
    controls.start({ scale: 1.1, transition: { duration: 0.1 } }).then(() => controls.start({ scale: 1 }));
  };

  const handleColorSelect = (color: string) => {
    setDocumentState(prev => ({
      ...prev,
      currentColor: color,
    }));
    controls.start({ scale: 1.1, transition: { duration: 0.1 } }).then(() => controls.start({ scale: 1 }));
  };

  const handleClearAnnotations = () => {
    if (documentState.annotations.length === 0) {
      toast({
        title: "No annotations to clear",
        description: "There are no annotations on this document.",
      });
      return;
    }

    if (confirm('Are you sure you want to clear all annotations?')) {
      setDocumentState(prev => ({
        ...prev,
        annotations: [],
      }));

      toast({
        title: "Annotations cleared",
        description: "All annotations have been removed from the document.",
      });
    }
  };

  const colors = [
    { name: 'Yellow', value: '#FFEB3B' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Blue', value: '#2196F3' },
    { name: 'Red', value: '#F44336' },
    { name: 'Purple', value: '#9C27B0' },
  ];

  useEffect(() => {
    if (isHovered) {
      controls.start({ y: -5, transition: { type: 'spring', stiffness: 300 } });
    } else {
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300 } });
    }
  }, [isHovered, controls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Card className="h-full border-none shadow-none bg-transparent backdrop-blur-md bg-opacity-20 rounded-lg">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold text-white bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Annotation Tools
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-neutral-400">
            Select a tool to annotate your document
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-800/50 backdrop-blur-md rounded-lg p-1">
              <TabsTrigger
                value="tools"
                className="flex items-center gap-2 text-white hover:bg-neutral-700/50 transition-all rounded-lg"
              >
                <PenTool className="h-4 w-4" />
                Tools
              </TabsTrigger>
              <TabsTrigger
                value="colors"
                className="flex items-center gap-2 text-white hover:bg-neutral-700/50 transition-all rounded-lg"
              >
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-4">
              <div className="grid grid-cols-3 gap-5 pt-6">
                {[
                  { tool: 'select', icon: <MousePointer className="h-5 w-5" />, label: 'Select' },
                  { tool: 'highlight', icon: <Highlighter className="h-5 w-5" />, label: 'Highlight' },
                  { tool: 'underline', icon: <Underline className="h-5 w-5" />, label: 'Underline' },
                  { tool: 'comment', icon: <MessageSquare className="h-5 w-5" />, label: 'Comment' },
                  { tool: 'signature', icon: <PenTool className="h-5 w-5" />, label: 'Signature' },
                  { tool: 'clear', icon: <Trash2 className="h-5 w-5" />, label: 'Clear All' },
                ].map(({ tool, icon, label }) => (
                  <motion.div
                    key={tool}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={controls}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-12 flex-col gap-2 text-white bg-neutral-800/50 backdrop-blur-md hover:bg-neutral-700/50 transition-all",
                        documentState.currentTool === tool && "bg-primary/10 border-primary"
                      )}
                      onClick={() => tool === 'clear' ? handleClearAnnotations() : handleToolSelect(tool as DocumentState['currentTool'])}
                      title={label}
                      disabled={!documentState.file}
                    >
                      {icon}
                      <span className="text-xs">{label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {colors.map(color => (
                  <motion.div
                    key={color.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={controls}
                  >
                    <button
                      className={cn(
                        "h-10 w-10 rounded-full border-2 hover:scale-105 transition-transform shadow-lg",
                        documentState.currentColor === color.value
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-muted"
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorSelect(color.value)}
                      title={color.name}
                      disabled={!documentState.file}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="bg-neutral-700" />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Current Tool</h3>
            <p className="text-sm text-muted-foreground text-neutral-400">
              {documentState.currentTool
                ? documentState.currentTool.charAt(0).toUpperCase() + documentState.currentTool.slice(1)
                : 'None selected'}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}