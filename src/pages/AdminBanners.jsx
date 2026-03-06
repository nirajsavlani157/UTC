import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';

export default function AdminBanners() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const { data: banners = [] } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => utc.entities.Banner.list('order', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => utc.entities.Banner.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => utc.entities.Banner.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => utc.entities.Banner.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', image: '', order: 0, is_active: true });
    setEditingBanner(null);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      order: banner.order || 0,
      is_active: banner.is_active !== false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, order: parseInt(formData.order) };
    
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl('AdminDashboard'))}
              className="border-neutral-700 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-light text-white">Homepage Banners</h1>
              <p className="text-neutral-400 mt-1">{banners.length} banners</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-amber-500 hover:bg-amber-400 text-black"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="Premium Food Containers"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-white">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="Reusable & Durable Solutions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-white">Banner Image URL *</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="https://..."
                    required
                  />
                  <p className="text-xs text-neutral-500">Recommended size: 1920x800px</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order" className="text-white">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active" className="text-white cursor-pointer">
                    Active (show on homepage)
                  </Label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-neutral-700 text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-black"
                  >
                    {editingBanner ? 'Update' : 'Create'} Banner
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card key={banner.id} className="bg-neutral-900 border-neutral-800 overflow-hidden">
              <div className="relative aspect-[21/9] bg-neutral-800">
                {banner.image && (
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-medium">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-neutral-300 text-sm">{banner.subtitle}</p>
                  )}
                </div>
                {!banner.is_active && (
                  <div className="absolute top-3 right-3">
                    <EyeOff className="w-5 h-5 text-red-400" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-400">
                    Order: {banner.order} • {banner.is_active ? 'Active' : 'Hidden'}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                      className="border-neutral-700 text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Delete this banner?')) {
                          deleteMutation.mutate(banner.id);
                        }
                      }}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-500">No banners yet. Add your first banner!</p>
          </div>
        )}
      </div>
    </div>
  );
}