
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Shield, User, AlertTriangle, Image } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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
      // Use count instead of group since group is not available
      const { data: entryCounts, error: countError } = await supabase
        .from('screen_time_entries')
        .select('user_id, id')
        .order('created_at', { ascending: false });

      if (countError) throw countError;

      // Process the data to count entries per user
      const userEntryCount = new Map<string, number>();
      
      if (entryCounts) {
        entryCounts.forEach(entry => {
          if (entry && typeof entry === 'object' && 'user_id' in entry) {
            const userId = entry.user_id as string;
            userEntryCount.set(userId, (userEntryCount.get(userId) || 0) + 1);
          }
        });
      }
      
      // Filter users with 30+ entries
      const completedUserIds = Array.from(userEntryCount.entries())
        .filter(([_, count]) => count >= 30)
        .map(([userId]) => userId);

      if (completedUserIds.length > 0) {
        const userData = await Promise.all(completedUserIds.map(async (userId) => {
          // Get user details
          const { data: userDetails } = await supabase.auth.admin.getUserById(userId);
          
          // Get user's screenshots count
          const { count: screenshotCount } = await supabase
            .from('screen_time_entries')
            .select('id', { count: 'exact' })
            .eq('user_id', userId as string);
            
          // Get user's most recent entry date
          const { data: latestEntryData } = await supabase
            .from('screen_time_entries')
            .select('created_at')
            .eq('user_id', userId as string)
            .order('created_at', { ascending: false })
            .limit(1);
            
          let completionDate = 'Unknown';
          if (latestEntryData && latestEntryData[0] && latestEntryData[0].created_at) {
            completionDate = new Date(latestEntryData[0].created_at).toLocaleDateString();
          }
            
          return {
            userId,
            userEmail: userDetails?.user?.email || 'Unknown User',
            completionDate,
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
      <Header activeTab="Dashboard" />
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
          <div className="space-y-6">
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
              <CardContent>
                <p className="mb-4">To become an admin, add your user ID to the admin_users table in Supabase:</p>
                <div className="p-4 bg-gray-100 rounded-md overflow-x-auto mb-4">
                  <code className="text-sm whitespace-pre-wrap break-all">
                    INSERT INTO public.admin_users (user_id)<br />
                    VALUES ('{user.id}');
                  </code>
                </div>
                <p>Your user ID: <span className="font-mono bg-gray-100 p-1 rounded">{user.id}</span></p>
              </CardContent>
            </Card>
          </div>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Completion Date</TableHead>
                        <TableHead>Screenshots</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedChallenges.map((challenge) => (
                        <TableRow key={challenge.userId}>
                          <TableCell className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            {challenge.userEmail}
                          </TableCell>
                          <TableCell>{challenge.completionDate}</TableCell>
                          <TableCell>{challenge.screenshotCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2 h-5 w-5" />
                  User Uploaded Images
                </CardTitle>
                <CardDescription>
                  How to view user uploaded screenshots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Go to the Supabase dashboard for your project</li>
                  <li>Navigate to the Storage section in the left sidebar</li>
                  <li>Find the "screenshots" bucket</li>
                  <li>Browse through the folders (organized by user ID)</li>
                  <li>You can also check the "screenshots" table in the Database section for file metadata</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default AdminPage;
