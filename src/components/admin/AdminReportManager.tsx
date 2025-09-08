import React, { useState } from 'react';
import { WasteReport } from '@/pages/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminReportManagerProps {
  reports: WasteReport[];
  onUpdateReport: (reportId: string, updates: Partial<WasteReport>) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

const AdminReportManager: React.FC<AdminReportManagerProps> = ({ 
  reports, 
  onUpdateReport, 
  uploadImage 
}) => {
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleReportSelect = (report: WasteReport) => {
    setSelectedReport(report);
    setStatus(report.status);
    setComments(report.authorityComments || '');
    setAfterImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterImage(file);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedReport) return;

    // Require after image for completed/cleaned status
    if ((status === 'completed' || status === 'cleaned') && !selectedReport.afterImage && !afterImage) {
      toast({
        variant: "destructive",
        title: "After image required",
        description: "Please upload an after image before marking as completed or cleaned."
      });
      return;
    }

    setUploading(true);
    try {
      let afterImageUrl = selectedReport.afterImage;
      
      if (afterImage) {
        afterImageUrl = await uploadImage(afterImage);
      }

      await onUpdateReport(selectedReport.id, {
        status: status as any,
        authorityComments: comments,
        afterImage: afterImageUrl,
        updatedAt: new Date()
      });

      toast({
        title: "Report updated",
        description: "The report status has been successfully updated."
      });

      // Reset form
      setSelectedReport(null);
      setStatus('');
      setComments('');
      setAfterImage(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update the report. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dirty': return 'destructive';
      case 'cleaning': 
      case 'in-progress': return 'secondary';
      case 'cleaned': 
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {reports.filter(r => r.status !== 'completed' && r.status !== 'cleaned').map((report) => (
              <div
                key={report.id}
                onClick={() => handleReportSelect(report)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedReport?.id === report.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {report.id.slice(0, 8)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{report.location.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(report.reportedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Update Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Report Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedReport ? (
              <>
                <div className="space-y-2">
                  <Label>Current Report Images</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    {/* Before Image */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <p className="text-sm font-medium">Before (Citizen Report)</p>
                      </div>
                      <img 
                        src={selectedReport.image || selectedReport.beforeImage} 
                        alt="Before cleanup" 
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                    
                    {/* After Image Preview */}
                    {(selectedReport.afterImage || afterImage) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          <p className="text-sm font-medium">After (Admin Upload)</p>
                        </div>
                        <img 
                          src={afterImage ? URL.createObjectURL(afterImage) : selectedReport.afterImage} 
                          alt="After cleanup" 
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dirty">Needs Cleanup</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="cleaning">Being Cleaned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cleaned">Cleaned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(status === 'completed' || status === 'cleaned') && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      After Image (Required)
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {!selectedReport.afterImage && !afterImage && (
                      <p className="text-sm text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        After image is required for completed/cleaned status
                      </p>
                    )}
                    {selectedReport.afterImage && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        After image already uploaded
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Authority Comments</Label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add comments about the cleanup process..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleStatusUpdate} 
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? 'Updating...' : 'Update Report'}
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select a report from the list to update its status</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReportManager;