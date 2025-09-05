import React from 'react';
import { WasteReport } from '@/pages/App';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, MessageCircle } from 'lucide-react';

interface FeedScreenProps {
  reports: WasteReport[];
}

const FeedScreen: React.FC<FeedScreenProps> = ({ reports }) => {
  // Filter reports that have both before and after images (completed reports)
  const completedReports = reports.filter(
    report => report.beforeImage && report.afterImage && 
    (report.status === 'completed' || report.status === 'cleaned')
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h1>
        <p className="text-gray-600">See the amazing before and after transformations from our community</p>
      </div>

      {completedReports.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No completed reports yet</h3>
          <p className="text-gray-500">Check back soon to see before and after transformations!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {completedReports.map((report) => (
            <Card key={report.id} className="overflow-hidden border-0 shadow-lg bg-white">
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">GH</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Green Hash Community</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={report.status === 'completed' ? 'default' : 'secondary'}
                      className="bg-emerald-100 text-emerald-800"
                    >
                      {report.status === 'completed' ? 'Completed' : 'Cleaned'}
                    </Badge>
                  </div>
                </div>

                {/* Before and After Images */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Before Image */}
                  <div className="relative">
                    <img 
                      src={report.beforeImage || report.image} 
                      alt="Before cleanup" 
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="destructive" className="bg-red-500">
                        Before
                      </Badge>
                    </div>
                  </div>

                  {/* After Image */}
                  <div className="relative">
                    <img 
                      src={report.afterImage} 
                      alt="After cleanup" 
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="bg-emerald-500">
                        After
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{report.location.address}</p>
                  </div>
                  
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">
                      {report.category}
                    </Badge>
                  </div>

                  {report.remarks && (
                    <p className="text-gray-700 mb-3">{report.remarks}</p>
                  )}

                  {report.authorityComments && (
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-emerald-800 mb-1">Authority Update:</p>
                      <p className="text-sm text-emerald-700">{report.authorityComments}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedScreen;