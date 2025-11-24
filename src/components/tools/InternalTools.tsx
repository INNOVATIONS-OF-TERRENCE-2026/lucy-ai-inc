import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Calculator, Image, Code, Globe, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const InternalTools = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const calculateExpression = (expr: string) => {
    try {
      // Safe math evaluation (basic calculator)
      const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
      const result = eval(sanitized);
      setResult(`Result: ${result}`);
    } catch (error) {
      toast({
        title: 'Calculation error',
        description: 'Invalid expression',
        variant: 'destructive'
      });
    }
  };

  const extractPDFText = async (file: File) => {
    // Client-side PDF text extraction using FileReader
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      setResult(`Extracted text:\n${text.substring(0, 1000)}...`);
    };
    reader.readAsText(file);
  };

  const analyzeData = (data: string) => {
    try {
      const rows = data.split('\n').map(row => row.split(','));
      const stats = {
        rows: rows.length,
        columns: rows[0]?.length || 0,
        sample: rows.slice(0, 3)
      };
      setResult(`Data Analysis:\nRows: ${stats.rows}\nColumns: ${stats.columns}\n\nSample:\n${JSON.stringify(stats.sample, null, 2)}`);
    } catch (error) {
      toast({
        title: 'Analysis error',
        description: 'Invalid data format',
        variant: 'destructive'
      });
    }
  };

  const cleanHTML = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    setResult(text);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Code className="w-6 h-6" />
        Lucy Tools (Internal)
      </h2>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="calculator">
            <Calculator className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Calc</span>
          </TabsTrigger>
          <TabsTrigger value="pdf">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
          <TabsTrigger value="html">
            <Globe className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">HTML</span>
          </TabsTrigger>
          <TabsTrigger value="image">
            <Image className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Image</span>
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Code</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <Textarea
            placeholder="Enter math expression (e.g., 2 + 2 * 3)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
          />
          <Button onClick={() => calculateExpression(input)}>Calculate</Button>
        </TabsContent>

        <TabsContent value="pdf" className="space-y-4">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) extractPDFText(file);
            }}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">Upload a text or PDF file to extract content</p>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Textarea
            placeholder="Paste CSV data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
          />
          <Button onClick={() => analyzeData(input)}>Analyze Data</Button>
        </TabsContent>

        <TabsContent value="html" className="space-y-4">
          <Textarea
            placeholder="Paste HTML to extract text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
          />
          <Button onClick={() => cleanHTML(input)}>Clean HTML</Button>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Image analysis is integrated directly in the chat. Upload images in conversation for AI analysis.
          </p>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Code execution is available through the Code Executor tool in conversations.
          </p>
        </TabsContent>
      </Tabs>

      {result && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </Card>
  );
};
