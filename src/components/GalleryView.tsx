import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, User } from 'lucide-react';
import { WasteReport } from '@/pages/Index';

interface GalleryViewProps {
  reports: WasteReport[];
}

const GalleryView: React.FC<GalleryViewProps> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-destructive text-destructive-foreground';
      case 'in_progress':
        return 'bg-yellow-500 text-white';
      case 'cleaned':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>📸 Gallery View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="relative cursor-pointer group overflow-hidden rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors"
                onClick={() => setSelectedReport(report)}
              >
                <div className="aspect-square">
                  <img
                    src={report.image}
                    alt="Waste report"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <p className="text-white text-xs mt-1 line-clamp-2">
                      {report.location.address}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {reports.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reports found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Detail Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  Report Details
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="aspect-video">
                  <img
                    src={selectedReport.image}
                    alt="Waste report"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReport.beforeImage && (
                    <div>
                      <h4 className="font-semibold mb-2">Before Image</h4>
                      <img
                        src={selectedReport.beforeImage}
                        alt="Before cleanup"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {selectedReport.afterImage && (
                    <div>
                      <h4 className="font-semibold mb-2">After Image</h4>
                      <img
                        src={selectedReport.afterImage}
                        alt="After cleanup"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{selectedReport.location.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Reported</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedReport.reportedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">{selectedReport.category}</p>
                    </div>
                  </div>
                  
                  {selectedReport.remarks && (
                    <div>
                      <p className="text-sm font-medium">Remarks</p>
                      <p className="text-sm text-muted-foreground">{selectedReport.remarks}</p>
                    </div>
                  )}
                  
                  {selectedReport.authorityComments && (
                    <div>
                      <p className="text-sm font-medium">Authority Comments</p>
                      <p className="text-sm text-muted-foreground">{selectedReport.authorityComments}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setSelectedReport(null)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryView;