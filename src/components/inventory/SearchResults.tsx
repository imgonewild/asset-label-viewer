
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SearchResultsProps {
  data: any;
}

const SearchResults: React.FC<SearchResultsProps> = ({ data }) => {
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

  // Check if data is an array (multiple results from user search)
  const isMultipleResults = Array.isArray(data);

  // Render multiple results (for user search)
  if (isMultipleResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Found {data.length} Asset(s)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Host Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.label || "-"}</TableCell>
                  <TableCell>{item.user || "-"}</TableCell>
                  <TableCell>{item.location || "-"}</TableCell>
                  <TableCell>{item.brand || "-"}</TableCell>
                  <TableCell>{item.model || "-"}</TableCell>
                  <TableCell>{item.ip_address || "-"}</TableCell>
                  <TableCell>{item.host_name || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  // Render single result (for label search) - original detailed view
  // Determine which image to show based on label
  let imageSrc = "";
  if (data.label === "WP-DV-23101") {
    imageSrc = "/WP-DV-23101.jpg";
  } else {
    imageSrc = `/${data.label}.jpg`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details for Label: {data.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-center">
          <img
            src={imageSrc}
            alt={`Item Image for ${data.label}`}
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
                    <TableCell>{data[field.key] || "-"}</TableCell>
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

export default SearchResults;
