
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: any) => void;
}

interface ItemFormData {
  name: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  quantity: number;
  pickupStart: string;
  pickupEnd: string;
  category: string;
}

const AddItemModal = ({ isOpen, onClose, onAddItem }: AddItemModalProps) => {
  const form = useForm<ItemFormData>({
    defaultValues: {
      name: '',
      description: '',
      originalPrice: 0,
      discountPrice: 0,
      quantity: 1,
      pickupStart: '',
      pickupEnd: '',
      category: ''
    }
  });

  const onSubmit = (data: ItemFormData) => {
    const newItem = {
      id: Date.now(),
      title: data.name,
      vendor: "Mama's Kitchen",
      description: data.description,
      price: data.discountPrice,
      originalPrice: data.originalPrice,
      pickup: `${data.pickupStart} - ${data.pickupEnd}`,
      quantity: data.quantity,
      category: data.category,
      status: 'active',
      image: "/placeholder.svg"
    };

    onAddItem(newItem);
    toast.success('Item added successfully!');
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Food Item</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Item name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mixed Pastries Box" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your food item..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="originalPrice"
                rules={{ required: 'Original price is required', min: 1 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (KSh)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPrice"
                rules={{ required: 'Discount price is required', min: 1 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Price (KSh)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quantity"
              rules={{ required: 'Quantity is required', min: 1 }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickupStart"
                rules={{ required: 'Pickup start time is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Start</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pickupEnd"
                rules={{ required: 'Pickup end time is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup End</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bakery, Salads, Hot Food" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                Add Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
