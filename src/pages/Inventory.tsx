
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchResults from "@/components/inventory/SearchResults";
import Scanner from "@/components/inventory/Scanner";
import CsvUploader from "@/components/inventory/CsvUploader";
import ApiService from "@/services/ApiService";

const Inventory = () => {
  const [label, setLabel] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!label) {
      toast({
        title: "Error",
        description: "Please enter a label to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await ApiService.searchByLabel(label);
      
      if (data && data.length > 0) {
        setSearchResults(data[0]);
        toast({
          title: "Success",
          description: "Item found successfully!",
        });
      } else {
        setSearchResults(null);
        toast({
          title: "No results",
          description: "No item found with this label",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: "Failed to search for the label. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanResult = (result: string) => {
    setLabel(result);
    setActiveTab("search");
    // Automatically search after scan
    setTimeout(() => {
      handleSearch();
    }, 300);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">IT Inventory Management</h1>
      
      <Tabs defaultValue="search" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="search">Search by Label</TabsTrigger>
                  <TabsTrigger value="scan">Scan Label</TabsTrigger>
                </TabsList>
                
                <TabsContent value="search">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Enter label ID..."
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSearch} 
                      disabled={isLoading}
                      className="flex-shrink-0"
                    >
                      {isLoading ? "Searching..." : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="scan">
                  <Scanner onScan={handleScanResult} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload">
          <CsvUploader />
        </TabsContent>
      </Tabs>

      {searchResults && (
        <SearchResults data={searchResults} />
      )}
    </div>
  );
};

export default Inventory;
