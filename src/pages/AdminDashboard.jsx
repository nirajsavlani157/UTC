import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
      return;
    }

    const checkAuth = async () => {
      try {
        const currentUser = await utc.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser({ full_name: 'Admin' });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => utc.entities.Product.list('-created_date', 100),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => utc.entities.Order.list('-created_date', 100),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-amber-500'
    },
    {
      title: 'Pending Orders',
      value: orders.filter(o => o.status === 'pending').length,
      icon: FileText,
      color: 'bg-red-500'
    },
    {
      title: 'Revenue',
      value: `₹${orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Admin Dashboard</h1>
            <p className="text-neutral-400">Welcome back, {user?.full_name}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                sessionStorage.removeItem('adminLoggedIn');
                navigate(createPageUrl('AdminLogin'));
              }}
              variant="outline" 
              className="border-neutral-700 text-white"
            >
              Logout
            </Button>
            <Link to={createPageUrl('AdminProducts')}>
              <Button className="bg-amber-500 hover:bg-amber-400 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">{stat.title}</p>
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to={createPageUrl('AdminProducts')}>
            <Card className="bg-neutral-900 border-neutral-800 hover:border-amber-500 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">Manage Products</h3>
                <p className="text-sm text-neutral-400 mt-1">Add, edit, or remove products</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('AdminOrders')}>
            <Card className="bg-neutral-900 border-neutral-800 hover:border-amber-500 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">Manage Orders</h3>
                <p className="text-sm text-neutral-400 mt-1">View and process orders</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('AdminCollections')}>
            <Card className="bg-neutral-900 border-neutral-800 hover:border-amber-500 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">Manage Collections</h3>
                <p className="text-sm text-neutral-400 mt-1">Organize product collections</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Link to={createPageUrl('AdminBanners')}>
            <Card className="bg-neutral-900 border-neutral-800 hover:border-amber-500 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">Homepage Banners</h3>
                <p className="text-sm text-neutral-400 mt-1">Edit hero slider images</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('AdminSettings')}>
            <Card className="bg-neutral-900 border-neutral-800 hover:border-amber-500 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">Site Settings</h3>
                <p className="text-sm text-neutral-400 mt-1">Social media & contact info</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <Link to={createPageUrl('AdminOrders')}>
                <Button variant="outline" className="border-neutral-700 text-amber-400">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800">
                  <TableHead className="text-neutral-400">Order #</TableHead>
                  <TableHead className="text-neutral-400">Customer</TableHead>
                  <TableHead className="text-neutral-400">Total</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                  <TableHead className="text-neutral-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id} className="border-neutral-800">
                    <TableCell className="text-white font-medium">{order.order_number}</TableCell>
                    <TableCell className="text-neutral-300">{order.customer_name}</TableCell>
                    <TableCell className="text-amber-400">₹{order.total?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                        order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-400">
                      {new Date(order.created_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-neutral-500 py-8">
                      No orders yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}