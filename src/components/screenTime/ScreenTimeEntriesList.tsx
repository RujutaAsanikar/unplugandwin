
import React from 'react';
import { format } from 'date-fns';
import { ScreenTimeEntry } from '@/lib/types';

interface ScreenTimeEntriesListProps {
  entries: ScreenTimeEntry[];
}

const ScreenTimeEntriesList: React.FC<ScreenTimeEntriesListProps> = ({ entries }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Your Entries</h3>
      {entries.length === 0 ? (
        <p className="text-muted-foreground">No entries yet. Start tracking your screen time!</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="text-sm">
              {format(new Date(entry.date), 'PPP')}: {entry.minutes / 60} hours
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScreenTimeEntriesList;
