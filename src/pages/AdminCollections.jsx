import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';

export default function AdminCollections() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const { data: collections = [] } = useQuery({
    queryKey: ['admin-collections'],
    queryFn: () => utc.entities.Collection.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => utc.entities.Collection.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => utc.entities.Collection.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => utc.entities.Collection.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', slug: '', image: '', description: '' });
    setEditingCollection(null);
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name || '',
      slug: collection.slug || '',
      image: collection.image || '',
      description: collection.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCollection) {
      updateMutation.mutate({ id: editingCollection.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
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
              <h1 className="text-3xl font-light text-white">Collections</h1>
              <p className="text-neutral-400 mt-1">{collections.length} collections</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-amber-500 hover:bg-amber-400 text-black"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCollection ? 'Edit Collection' : 'Add New Collection'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Collection Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-white">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="e.g., meal-trays"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-white">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                  />
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
                    {editingCollection ? 'Update' : 'Create'} Collection
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="bg-neutral-900 border-neutral-800 overflow-hidden">
              <div className="aspect-video bg-neutral-800 overflow-hidden">
                {collection.image && (
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-white font-medium mb-1">{collection.name}</h3>
                <p className="text-sm text-neutral-400 mb-3">{collection.slug}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(collection)}
                    className="flex-1 border-neutral-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Delete this collection?')) {
                        deleteMutation.mutate(collection.id);
                      }
                    }}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-500">No collections yet. Add your first collection!</p>
          </div>
        )}
      </div>
    </div>
  );
}