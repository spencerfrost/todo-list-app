import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { useToast } from 'components/ui/use-toast';
import React, { useCallback, useEffect, useState } from 'react';
import { createCategory, getCategories } from 'services/api';
import { Category } from 'services/types';

interface CategoryManagerProps {
  onCategorySelect: (categoryId: number) => void;
  selectedCategoryId?: number;
}

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB'];

const CategoryManager: React.FC<CategoryManagerProps> = ({ onCategorySelect, selectedCategoryId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(COLORS[0]);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async () => {
    try {
      const newCategory = await createCategory({
        name: newCategoryName,
        color: newCategoryColor,
      });
      await fetchCategories();
      setIsDialogOpen(false);
      setNewCategoryName('');
      setNewCategoryColor(COLORS[0]);
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      onCategorySelect(newCategory.id);
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === 'create') {
      setIsDialogOpen(true);
    } else {
      onCategorySelect(Number(value));
    }
  };

  return (
    <>
      <Select onValueChange={handleSelectChange} value={selectedCategoryId?.toString()}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              <span style={{ color: category.color }}>{category.name}</span>
            </SelectItem>
          ))}
          <SelectItem value="create">Create Category</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="categoryColor">Color</Label>
              <Select onValueChange={setNewCategoryColor} value={newCategoryColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: color }}></div>
                        {color}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCategory}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryManager;