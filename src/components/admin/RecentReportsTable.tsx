import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit, Trash2, Download, Filter } from 'lucide-react';
import { WasteReport } from '@/pages/Index';

interface RecentReportsTableProps {
  reports: WasteReport[];
}

const RecentReportsTable = ({ reports }: RecentReportsTableProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'cleaned':
      case 'completed':
        return 'default';
      case 'cleaning':
      case 'in-progress':
        return 'secondary';
      case 'dirty':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleaned':
      case 'completed':
        return 'text-green-600';
      case 'cleaning':
      case 'in-progress':
        return 'text-yellow-600';
      case 'dirty':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSearch = report.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportToCSV = () => {
    const csvContent = [
      ['Report ID', 'Location', 'Status', 'Category', 'Date', 'Remarks'].join(','),
      ...filteredReports.map(report => [
        report.id,
        `"${report.location.address}"`,
        report.status,
        report.category,
        report.reportedAt.toLocaleDateString(),
        `"${report.remarks}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `green-hash-reports-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Recent Reports</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by location or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="dirty">Dirty</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="cleaned">Cleaned</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs">
                    {report.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <img
                      src={report.image}
                      alt="Report"
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {report.location.address}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(report.status)}
                      className={getStatusColor(report.status)}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>
                    {report.reportedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReportsTable;