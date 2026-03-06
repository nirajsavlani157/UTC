import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const { data: siteSettings = [] } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => utc.entities.SiteSettings.list('-created_date', 100),
  });

  useEffect(() => {
    const settingsObj = {};
    siteSettings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });
    setSettings(prev => ({ ...prev, ...settingsObj }));
  }, [siteSettings]);

  const saveMutation = useMutation({
    mutationFn: async (newSettings) => {
      const promises = [];
      
      for (const [key, value] of Object.entries(newSettings)) {
        const existing = siteSettings.find(s => s.setting_key === key);
        const type = ['facebook_url', 'instagram_url', 'twitter_url', 'youtube_url'].includes(key) ? 'social' : 'contact';
        
        if (existing) {
          promises.push(utc.entities.SiteSettings.update(existing.id, { setting_value: value }));
        } else {
          promises.push(utc.entities.SiteSettings.create({ 
            setting_key: key, 
            setting_value: value,
            setting_type: type
          }));
        }
      }
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      alert('Settings saved successfully!');
    },
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
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
              <h1 className="text-3xl font-light text-white">Site Settings</h1>
              <p className="text-neutral-400 mt-1">Manage social media and contact info</p>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            className="bg-amber-500 hover:bg-amber-400 text-black"
            disabled={saveMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Social Media */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-white">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={settings.facebook_url}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-white">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={settings.instagram_url}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-white">Twitter/X URL</Label>
                <Input
                  id="twitter"
                  value={settings.twitter_url}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube" className="text-white">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={settings.youtube_url}
                  onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="info@base44.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Business Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="123 Business St, City, State"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}