import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { utc } from '@/api/utcClient';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Eye, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminOrders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => utc.entities.Order.list('-created_date', 200),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => utc.entities.Order.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl('AdminDashboard'))}
            className="border-neutral-700 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-light text-white">Orders</h1>
            <p className="text-neutral-400 mt-1">{orders.length} total orders</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800">
                <TableHead className="text-neutral-400">Order #</TableHead>
                <TableHead className="text-neutral-400">Customer</TableHead>
                <TableHead className="text-neutral-400">Items</TableHead>
                <TableHead className="text-neutral-400">Total</TableHead>
                <TableHead className="text-neutral-400">Payment</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="text-neutral-400">Date</TableHead>
                <TableHead className="text-neutral-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-neutral-800">
                  <TableCell className="text-white font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div className="text-white">{order.customer_name}</div>
                    <div className="text-sm text-neutral-400">{order.customer_email}</div>
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {order.items?.length || 0} items
                  </TableCell>
                  <TableCell className="text-amber-400 font-medium">
                    ₹{order.total?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      order.payment_status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(status) => updateStatusMutation.mutate({ id: order.id, status })}
                    >
                      <SelectTrigger className="w-32 bg-neutral-800 border-neutral-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem value="pending" className="text-white">Pending</SelectItem>
                        <SelectItem value="processing" className="text-white">Processing</SelectItem>
                        <SelectItem value="shipped" className="text-white">Shipped</SelectItem>
                        <SelectItem value="delivered" className="text-white">Delivered</SelectItem>
                        <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-neutral-400">
                    {new Date(order.created_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="border-neutral-700 text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-neutral-500 py-12">
                    <Package className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
                    <p>No orders yet</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-400">Order Number</p>
                    <p className="font-medium">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Date</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.created_date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Customer Information</h3>
                  <div className="bg-neutral-800 p-4 rounded-lg space-y-2">
                    <p><span className="text-neutral-400">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="text-neutral-400">Email:</span> {selectedOrder.customer_email}</p>
                    <p><span className="text-neutral-400">Phone:</span> {selectedOrder.customer_phone}</p>
                  </div>
                </div>

                {selectedOrder.shipping_address && (
                  <div>
                    <h3 className="font-medium mb-3">Shipping Address</h3>
                    <div className="bg-neutral-800 p-4 rounded-lg">
                      <p>{selectedOrder.shipping_address.street}</p>
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}</p>
                      <p>{selectedOrder.shipping_address.postal_code}</p>
                      <p>{selectedOrder.shipping_address.country}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-neutral-800 p-3 rounded-lg">
                        {item.image && (
                          <img src={item.image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-neutral-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-amber-400 font-medium">₹{item.price?.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Subtotal</span>
                      <span>₹{selectedOrder.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Shipping</span>
                      <span>₹{selectedOrder.shipping_cost?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium pt-2 border-t border-neutral-800">
                      <span>Total</span>
                      <span className="text-amber-400">₹{selectedOrder.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}