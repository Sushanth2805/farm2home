
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";

interface ProduceSearchProps {
  searchQuery: string;
  locationFilter: string;
  metroCities: string[];
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

const ProduceSearch: React.FC<ProduceSearchProps> = ({
  searchQuery,
  locationFilter,
  metroCities,
  onSearchChange,
  onLocationChange
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-organic-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="text-sm font-medium text-organic-700 mb-1 block">
            Search Produce
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-organic-500" />
            <Input
              id="search"
              placeholder="Search by name or description..."
              className="organic-input pl-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-organic-700 mb-1 block">
            Filter by Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-organic-500 pointer-events-none" />
            <Select value={locationFilter} onValueChange={onLocationChange}>
              <SelectTrigger className="organic-input pl-9">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All locations</SelectItem>
                {metroCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduceSearch;
