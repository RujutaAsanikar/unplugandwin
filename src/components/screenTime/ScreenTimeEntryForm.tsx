
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface ScreenTimeEntryFormProps {
  onSubmit: (date: Date, hours: number) => Promise<void>;
  isUserLoggedIn: boolean;
}

const ScreenTimeEntryForm: React.FC<ScreenTimeEntryFormProps> = ({ onSubmit, isUserLoggedIn }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState<number | ''>('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !hours) {
      toast({
        title: "Error",
        description: "Please select a date and enter the number of hours.",
        variant: "destructive",
      });
      return;
    }

    const hoursNumber = Number(hours);

    if (isNaN(hoursNumber) || hoursNumber <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of hours.",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(date, hoursNumber);
    setHours('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) =>
                date > new Date() || date < new Date('2024-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          type="number"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-24"
        />
      </div>
      <Button type="submit" className="w-full bg-primary">
        Add Entry
      </Button>
    </form>
  );
};

export default ScreenTimeEntryForm;
