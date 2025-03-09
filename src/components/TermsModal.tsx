
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  challengeName: string;
}

const TermsModal: React.FC<TermsModalProps> = ({ 
  isOpen, 
  onClose, 
  onAccept,
  challengeName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-xl">Challenge Terms & Conditions</DialogTitle>
          <p className="text-muted-foreground mt-2">
            Please review and accept the terms before starting "{challengeName}"
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold text-base">1. Commitment to Challenge</h3>
            <p className="text-muted-foreground text-sm mt-1">
              I hereby commit to undertaking this digital wellness challenge with full dedication and sincerity.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base">2. Adherence to Guidelines</h3>
            <p className="text-muted-foreground text-sm mt-1">
              I agree to follow the challenge guidelines and actively work towards reducing my digital consumption as specified.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base">3. Honest Participation</h3>
            <p className="text-muted-foreground text-sm mt-1">
              I pledge to maintain honesty in tracking and reporting my progress throughout the challenge duration.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base">4. Challenge Completion</h3>
            <p className="text-muted-foreground text-sm mt-1">
              I understand that rewards are contingent upon successful completion of the full challenge period.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-base">5. Reward Acknowledgment</h3>
            <p className="text-muted-foreground text-sm mt-1">
              I accept that rewards will be distributed upon verification of challenge completion according to the specified criteria.
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex flex-col sm:flex-row gap-4 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="sm:w-auto w-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onAccept}
            className="bg-primary hover:bg-primary/90 sm:w-auto w-full"
          >
            Accept & Start Challenge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
