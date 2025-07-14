
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WasteReport } from '../pages/Index';

export const useWasteReports = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from Supabase
  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('waste_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        return;
      }

      // Transform Supabase data to match WasteReport interface
      const transformedReports: WasteReport[] = data.map((report) => ({
        id: report.id,
        image: report.image_url,
        location: {
          lat: parseFloat(report.latitude.toString()),
          lng: parseFloat(report.longitude.toString()),
          address: report.address,
        },
        status: report.status as WasteReport['status'],
        category: report.category,
        remarks: report.remarks || '',
        reportedAt: new Date(report.created_at || ''),
        updatedAt: new Date(report.updated_at || ''),
        beforeImage: report.before_image_url || undefined,
        afterImage: report.after_image_url || undefined,
        authorityComments: report.authority_comments || undefined,
      }));

      setReports(transformedReports);
    } catch (error) {
      console.error('Error in fetchReports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new report
  const addReport = async (report: Omit<WasteReport, 'id' | 'reportedAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('waste_reports')
        .insert({
          image_url: report.image,
          latitude: report.location.lat,
          longitude: report.location.lng,
          address: report.location.address,
          status: report.status,
          category: report.category,
          remarks: report.remarks,
          before_image_url: report.beforeImage,
          after_image_url: report.afterImage,
          authority_comments: report.authorityComments,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding report:', error);
        return null;
      }

      const newReport: WasteReport = {
        id: data.id,
        image: data.image_url,
        location: {
          lat: parseFloat(data.latitude.toString()),
          lng: parseFloat(data.longitude.toString()),
          address: data.address,
        },
        status: data.status as WasteReport['status'],
        category: data.category,
        remarks: data.remarks || '',
        reportedAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        beforeImage: data.before_image_url || undefined,
        afterImage: data.after_image_url || undefined,
        authorityComments: data.authority_comments || undefined,
      };

      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (error) {
      console.error('Error in addReport:', error);
      return null;
    }
  };

  // Update a report
  const updateReport = async (reportId: string, updates: Partial<WasteReport>) => {
    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.remarks !== undefined) updateData.remarks = updates.remarks;
      if (updates.beforeImage !== undefined) updateData.before_image_url = updates.beforeImage;
      if (updates.afterImage !== undefined) updateData.after_image_url = updates.afterImage;
      if (updates.authorityComments !== undefined) updateData.authority_comments = updates.authorityComments;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('waste_reports')
        .update(updateData)
        .eq('id', reportId);

      if (error) {
        console.error('Error updating report:', error);
        return;
      }

      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, ...updates, updatedAt: new Date() } 
          : report
      ));
    } catch (error) {
      console.error('Error in updateReport:', error);
    }
  };

  // Delete a report
  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('waste_reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        console.error('Error deleting report:', error);
        return;
      }

      setReports(prev => prev.filter(report => report.id !== reportId));
    } catch (error) {
      console.error('Error in deleteReport:', error);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `waste-reports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('waste-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('waste-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    addReport,
    updateReport,
    deleteReport,
    uploadImage,
    fetchReports,
  };
};
