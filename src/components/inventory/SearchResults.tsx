
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SearchResultsProps {
  data: any;
  searchType?: "label" | "user";
}

const SearchResults: React.FC<SearchResultsProps> = ({ data, searchType = "label" }) => {
  const sections = [
    {
      title: "General Information",
      fields: [
        { key: "plant", label: "Plant" },
        { key: "label", label: "Label" },
        { key: "user", label: "User" },
        { key: "location", label: "Location" },
      ],
    },
    {
      title: "Network Info",
      fields: [
        { key: "ip_address", label: "IP Address" },
        { key: "ip_type", label: "IP Type" },
        { key: "mac", label: "MAC" },
        { key: "host_name", label: "Host Name" },
      ],
    },
    {
      title: "PC Info",
      fields: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "service_id_or_serial_number", label: "Service ID/Serial Number" },
        { key: "cpu", label: "CPU" },
        { key: "ram", label: "RAM" },
        { key: "storage", label: "Storage" },
      ],
    },
    {
      title: "OS Info",
      fields: [
        { key: "os_type", label: "OS Type" },
        { key: "os_product_key", label: "OS Product Key" },
        { key: "admin_account", label: "Admin Account" },
        { key: "password", label: "Password" },
      ],
    },
    {
      title: "Software Info",
      fields: [
        { key: "office_version", label: "Office Version" },
        { key: "office_product_key", label: "Office Product Key" },
        { key: "old_office_version", label: "Old Office Version" },
        { key: "old_office_product_key", label: "Old Office Product Key" },
        { key: "antivirus", label: "Antivirus" },
        { key: "as400", label: "AS400" },
        { key: "others", label: "Others" },
      ],
    },
  ];

  // Helper function to render detailed card for a single item
  const renderDetailedCard = (itemData: any, index?: number) => {
    // Determine which image to show based on label
    let imageSrc = "";
    if (itemData.label === "WP-DV-23101") {
      imageSrc = "/WP-DV-23101.jpg";
    } else {
      imageSrc = `/${itemData.label}.jpg`;
    }

    return (
      <Card key={index !== undefined ? index : itemData.label} className={index !== undefined ? "mb-6" : ""}>
        <CardHeader>
          <CardTitle>
            {searchType === "user"
              ? `Details for User: ${itemData.user}`
              : `Details for Label: ${itemData.label}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            <img
              src={imageSrc}
              alt={`Item Image for ${itemData.label}`}
              className="rounded-lg max-h-64 object-contain shadow-md"
              onError={(e) => {
                // If image fails to load, hide it
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <Table>
            <TableBody>
              {sections.map((section) => (
                <React.Fragment key={section.title}>
                  <TableRow className="bg-muted">
                    <TableCell colSpan={2} className="font-bold">
                      {section.title}
                    </TableCell>
                  </TableRow>
                  {section.fields.map((field) => (
                    <TableRow key={field.key}>
                      <TableCell className="font-medium w-1/3">{field.label}</TableCell>
                      <TableCell>{itemData[field.key] || "-"}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  // Check if data is an array (multiple results from user search)
  const isMultipleResults = Array.isArray(data);

  // Render multiple results (for user search)
  if (isMultipleResults) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Found {data.length} Asset(s)</h2>
        {data.map((item: any, index: number) => renderDetailedCard(item, index))}
      </div>
    );
  }

  // Render single result (for label search)
  return renderDetailedCard(data);
};

export default SearchResults;
