import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ListingsGrid from '@/components/ListingsGrid';
import { FilterPopup, FilterOptions } from '@/components/FilterPopup';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    address: "Nairobi, Kenya",
    lat: -1.2921,
    lng: 36.8219,
    distance: 10
  });

  // Mock category data
  const mockCategoryData = {
    'Bread & Pastries': {
      name: 'Bread & Pastries',
      description: 'Fresh bread, pastries, and baked goods from local bakeries',
      icon: '🥐',
      color: 'bg-yellow-100 text-yellow-800',
      totalItems: 24
    },
    'Drinks': {
      name: 'Drinks',
      description: 'Coffee, tea, juices, and other beverages',
      icon: '🥤',
      color: 'bg-blue-100 text-blue-800',
      totalItems: 18
    },
    'Groceries': {
      name: 'Groceries',
      description: 'Fresh produce, dairy, and pantry essentials',
      icon: '🛒',
      color: 'bg-green-100 text-green-800',
      totalItems: 32
    },
    'Meals': {
      name: 'Meals',
      description: 'Complete meals and food packages',
      icon: '🍽️',
      color: 'bg-orange-100 text-orange-800',
      totalItems: 45
    }
  };

  useEffect(() => {
    if (categoryName) {
      fetchCategoryData();
    }
  }, [categoryName]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      // Try to fetch real category data from Supabase
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', categoryName)
        .single();

      if (error) {
        console.error('Error fetching category data:', error);
        // Use mock data as fallback
        setCategoryData(mockCategoryData[categoryName as keyof typeof mockCategoryData] || {
          name: categoryName,
          description: `All ${categoryName} items`,
          icon: '📦',
          color: 'bg-gray-100 text-gray-800',
          totalItems: 0
        });
      } else if (data) {
        setCategoryData({
          name: data.name,
          description: data.description || `All ${data.name} items`,
          icon: data.icon || '📦',
          color: data.color || 'bg-gray-100 text-gray-800',
          totalItems: data.total_items || 0
        });
      } else {
        // Use mock data if no real data found
        setCategoryData(mockCategoryData[categoryName as keyof typeof mockCategoryData] || {
          name: categoryName,
          description: `All ${categoryName} items`,
          icon: '📦',
          color: 'bg-gray-100 text-gray-800',
          totalItems: 0
        });
      }
    } catch (error) {
      console.error('Error in fetchCategoryData:', error);
      setCategoryData(mockCategoryData[categoryName as keyof typeof mockCategoryData] || {
        name: categoryName,
        description: `All ${categoryName} items`,
        icon: '📦',
        color: 'bg-gray-100 text-gray-800',
        totalItems: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/discover');
  };

  const handleFilter = () => {
    setShowFilter(true);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    console.log("Applied filters for category:", categoryName, filters);
    setActiveFilters(filters);
    
    const filterCount = getActiveFilterCount(filters);
    if (filterCount > 0) {
      toast.success(`Applied ${filterCount} filter${filterCount !== 1 ? 's' : ''} to ${categoryName}`);
    } else {
      toast.success("All filters cleared");
    }
  };

  const getActiveFilterCount = (filters: FilterOptions): number => {
    let count = 0;
    if (filters.showSoldOut) count++;
    if (filters.pickupDay.length > 0) count++;
    if (filters.pickupWindow[0] !== 0 || filters.pickupWindow[1] !== 23) count++;
    if (filters.surpriseBagTypes.length > 0) count++;
    if (filters.dietaryPreferences.length > 0) count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) count++;
    if (filters.distanceRange[0] !== 0 || filters.distanceRange[1] !== 10) count++;
    if (filters.ratingFilter > 0) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">Category not found</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${categoryData.color}`}>
                {categoryData.icon}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{categoryData.name}</h1>
                <p className="text-sm text-gray-600">{categoryData.totalItems} items available</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleFilter}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {activeFilters && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                {getActiveFilterCount(activeFilters)}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Category Description */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <p className="text-sm text-gray-600">{categoryData.description}</p>
      </div>

      {/* Current Location */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{currentLocation.address}</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <ListingsGrid
          categoryFilter={categoryName}
          showSoldOut={activeFilters?.showSoldOut || false}
          userLocation={{ lat: currentLocation.lat, lng: currentLocation.lng }}
          distanceFilter={currentLocation.distance}
          showNoItemsMessage={true}
          showAllItems={true}
        />
      </div>

      {/* Filter Popup */}
      <FilterPopup
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default CategoryPage;
