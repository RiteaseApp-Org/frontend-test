"use client";

import { useState } from 'react';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { DocumentUploader } from '@/components/document-uploader';
import { DocumentViewer } from '@/components/document-viewer';
import { ToolBar } from '@/components/tool-bar';
import { DocumentState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, FileText, Settings, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, rgb } from 'pdf-lib';
import { cn } from '@/lib/utils';

export default function Home() {
    const { toast } = useToast();
    const [documentState, setDocumentState] = useState<DocumentState>({
        file: null,
        annotations: [],
        currentPage: 1,
        totalPages: 0,
        scale: 1,
        currentTool: null,
        currentColor: '#38BDF8',
    });

    const handleFileUpload = (file: File) => {
        setDocumentState({
            ...documentState,
            file,
            annotations: [],
            currentPage: 1,
        });

        toast({
            title: "Document uploaded",
            description: `${file.name} is ready for annotation.`,
        });
    };

    const processPDFWithAnnotations = async (file: File, annotations: any[]) => {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        annotations.forEach(({ page, x, y, text, color }) => {
            if (pages[page]) {
                pages[page].drawText(text, {
                    x,
                    y,
                    size: 12,
                    color: rgb(color.r, color.g, color.b),
                });
            }
        });

        const modifiedPdfBytes = await pdfDoc.save();
        return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    };

    const handleExport = async () => {
        if (!documentState.file) {
            toast({
                title: "No document to export",
                description: "Please upload a document first.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Exporting document",
            description: "Preparing your annotated document for download...",
        });

        try {
            const annotatedBlob = await processPDFWithAnnotations(documentState.file, documentState.annotations);
            const url = URL.createObjectURL(annotatedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `annotated-${documentState.file.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({
                title: "Export complete",
                description: "Your annotated document has been downloaded.",
            });
        } catch (error) {
            toast({
                title: "Export failed",
                description: "An error occurred while processing the document.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-foreground flex flex-col">
            <BackgroundBeams />

            {/* Header */}
            <header className="bg-background/80 backdrop-blur-md border-b border-muted/20 py-4 sticky top-0 z-50">
                <div className="container flex items-center justify-between px-6">
                    <div className="flex items-center space-x-2 font-semibold text-xl">
                        <FileText className="h-7 w-7 text-primary" />
                        <span>AnnotatePro</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            onClick={handleExport}
                            disabled={!documentState.file}
                            className="rounded-full px-4 py-2 hover:bg-primary/10 transition-colors"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container flex-1 flex flex-col lg:flex-row p-6 lg:p-8 gap-8">
                {/* Sidebar for Tools */}
                <aside className="lg:w-72 xl:w-80 bg-background/50 backdrop-blur-md rounded-xl p-6 shadow-lg border border-muted/20 relative">
                    <BackgroundBeams />
                    <div className="flex flex-col space-y-6 relative z-10">
                        <h2 className="text-lg font-semibold text-foreground/80">Tools</h2>
                        <ToolBar
                            documentState={documentState}
                            setDocumentState={setDocumentState}
                        />
                    </div>
                </aside>

                {/* Document Viewer Area */}
                <div className="flex-1 bg-background/50 backdrop-blur-md rounded-xl shadow-lg border border-muted/20 overflow-hidden">
                    {!documentState.file ? (
                        <div className="p-8 flex flex-col items-center justify-center h-full space-y-6">
                            <div className="text-center space-y-2">
                                <Upload className="h-12 w-12 text-primary mx-auto" />
                                <h2 className="text-2xl font-semibold">Upload a Document</h2>
                                <p className="text-foreground/60">Drag and drop a PDF file to get started.</p>
                            </div>
                            <DocumentUploader onFileUpload={handleFileUpload} />
                        </div>
                    ) : (
                        <DocumentViewer
                            documentState={documentState}
                            setDocumentState={setDocumentState}
                        />
                    )}
                </div>
            </main>

           
        </div>
    );
}
