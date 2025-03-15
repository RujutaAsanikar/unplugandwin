
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Shield, User, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface CompletedChallenge {
  userId: string;
  userEmail: string;
  completionDate: string;
  screenshotCount: number;
}

const AdminPage = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
        
        if (error) throw error;
        
        setIsAdmin(!!data);
        
        if (data) {
          await fetchCompletedChallenges();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: 'Error checking admin status',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const fetchCompletedChallenges = async () => {
    try {
      // Get users who have 30 or more entries
      const { data: completedData, error: completedError } = await supabase
        .from('screen_time_entries')
        .select('user_id, count(*)')
        .group('user_id')
        .having('count(*) >= 30');

      if (completedError) throw completedError;

      if (completedData && completedData.length > 0) {
        const userIds = completedData.map(item => item.user_id);
        
        // Get user info from auth table via profiles
        const userData = await Promise.all(userIds.map(async (userId) => {
          // Get user details
          const { data: userDetails } = await supabase.auth.admin.getUserById(userId);
          
          // Get user's screenshots count
          const { count: screenshotCount } = await supabase
            .from('screen_time_entries')
            .select('id', { count: 'exact' })
            .eq('user_id', userId);
            
          // Get user's most recent entry date
          const { data: latestEntryData } = await supabase
            .from('screen_time_entries')
            .select('created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);
            
          return {
            userId,
            userEmail: userDetails?.user?.email || 'Unknown User',
            completionDate: latestEntryData && latestEntryData[0] ? new Date(latestEntryData[0].created_at).toLocaleDateString() : 'Unknown',
            screenshotCount: screenshotCount || 0
          };
        }));
        
        setCompletedChallenges(userData);
      }
    } catch (error) {
      console.error('Error fetching completed challenges:', error);
      toast({
        title: 'Error fetching completed challenges',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    if (isAdmin) {
      fetchCompletedChallenges();
      toast({
        title: 'Refreshing data',
        description: 'Getting the latest challenge completion data.',
      });
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header activeTab="Admin" />
      <main className="container max-w-4xl mx-auto py-8 pb-20 px-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : !user ? (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Authentication Required
              </CardTitle>
              <CardDescription className="text-red-600">
                You need to be logged in to access the admin area.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : !isAdmin ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-700">
                <Shield className="mr-2 h-5 w-5" />
                Access Restricted
              </CardTitle>
              <CardDescription className="text-amber-600">
                This area is restricted to administrators only.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold flex items-center">
                <Shield className="mr-2 h-6 w-6 text-primary" />
                Admin Dashboard
              </h1>
              <Button onClick={handleRefresh} variant="outline">
                Refresh Data
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Challenge Completions</CardTitle>
                <CardDescription>
                  Users who have completed the 30-day screenshot challenge
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedChallenges.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No users have completed the challenge yet.
                  </p>
                ) : (
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Completion Date</th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Screenshots</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedChallenges.map((challenge, index) => (
                          <tr key={challenge.userId} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                            <td className="p-3 flex items-center">
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                              {challenge.userEmail}
                            </td>
                            <td className="p-3">{challenge.completionDate}</td>
                            <td className="p-3">{challenge.screenshotCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default AdminPage;
