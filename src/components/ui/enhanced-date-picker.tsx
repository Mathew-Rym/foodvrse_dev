import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface EnhancedDatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  showQuickSelect?: boolean; // New prop to control quick select buttons
}

export function EnhancedDatePicker({ 
  selectedDate, 
  onDateChange, 
  placeholder = "Select date",
  className = "",
  showQuickSelect = true
}: EnhancedDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    selectedDate ? selectedDate.getMonth() : new Date().getMonth()
  );
  const [selectedDay, setSelectedDay] = useState<number>(
    selectedDate ? selectedDate.getDate() : 1
  );

  // Generate years (from 1900 to current year + 10)
  const years = Array.from({ length: new Date().getFullYear() - 1900 + 10 }, (_, i) => 1900 + i).reverse();
  
  // Generate months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate days based on selected month and year
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    updateDate(newYear, selectedMonth, selectedDay);
  };

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    setSelectedMonth(monthIndex);
    // Adjust day if it exceeds the new month's days
    const newDaysInMonth = getDaysInMonth(monthIndex, selectedYear);
    const newDay = Math.min(selectedDay, newDaysInMonth);
    setSelectedDay(newDay);
    updateDate(selectedYear, monthIndex, newDay);
  };

  const handleDayChange = (day: string) => {
    const newDay = parseInt(day);
    setSelectedDay(newDay);
    updateDate(selectedYear, selectedMonth, newDay);
  };

  const updateDate = (year: number, month: number, day: number) => {
    const newDate = new Date(year, month, day);
    onDateChange(newDate);
  };

  const handleQuickSelect = (type: 'today' | 'yesterday' | 'lastWeek') => {
    const today = new Date();
    let targetDate = new Date();

    switch (type) {
      case 'today':
        targetDate = today;
        break;
      case 'yesterday':
        targetDate.setDate(today.getDate() - 1);
        break;
      case 'lastWeek':
        targetDate.setDate(today.getDate() - 7);
        break;
    }

    setSelectedYear(targetDate.getFullYear());
    setSelectedMonth(targetDate.getMonth());
    setSelectedDay(targetDate.getDate());
    onDateChange(targetDate);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Quick Select Buttons - Only show if enabled */}
      {showQuickSelect && (
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickSelect('today')}
            className="text-xs"
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickSelect('yesterday')}
            className="text-xs"
          >
            Yesterday
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickSelect('lastWeek')}
            className="text-xs"
          >
            Last Week
          </Button>
        </div>
      )}

      {/* Year/Month/Day Dropdowns */}
      <div className="flex gap-2">
        <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={months[selectedMonth]} onValueChange={handleMonthChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDay.toString()} onValueChange={handleDayChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Selected Date */}
      <Button 
        variant="outline" 
        className="w-full justify-start text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selectedDate ? format(selectedDate, "PPP") : placeholder}
      </Button>
    </div>
  );
}
