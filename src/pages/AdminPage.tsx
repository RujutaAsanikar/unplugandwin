import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Shield, User, AlertTriangle, Image, ListFilter, FileSpreadsheet, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface CompletedChallenge {
  userId: string;
  userEmail: string;
  username: string;
  completionDate: string;
  screenshotCount: number;
}

interface UserSurvey {
  userId: string;
  username: string;
  name: string | null;
  age: string | null;
  dailyScreenTime: string | null;
  socialMediaPlatforms: string[] | null;
  deviceAccess: string | null;
  areasOfConcern: string[] | null;
  preferredRewards: string[] | null;
}

interface UserInfo {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  lastSignIn: string | null;
}

const AdminPage = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);
  const [userSurveys, setUserSurveys] = useState<UserSurvey[]>([]);
  const [usersList, setUsersList] = useState<UserInfo[]>([]);
  const [activeTab, setActiveTab] = useState('users');
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
          await Promise.all([
            fetchCompletedChallenges(),
            fetchUserSurveys(),
            fetchUsers()
          ]);
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
          // Get user profile for username
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userId)
            .single();
            
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

          // Use the username from profile data if available
          const username = profileData?.username || userDetails?.user?.email?.split('@')[0] || 'Unknown User';
            
          return {
            userId,
            userEmail: userDetails?.user?.email || 'Unknown User',
            username,
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

  const fetchUserSurveys = async () => {
    try {
      // Get all survey responses
      const { data: surveyData, error: surveyError } = await supabase
        .from('user_surveys')
        .select('user_id, name, age, daily_screen_time, social_media_platforms, device_access, areas_of_concern, preferred_rewards');

      if (surveyError) throw surveyError;

      if (surveyData && surveyData.length > 0) {
        const surveyResults = await Promise.all(surveyData.map(async (survey) => {
          // Get user profile for username
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', survey.user_id)
            .single();

          // Use the username from profile data if available
          const username = profileData?.username || 'Unknown User';
            
          return {
            userId: survey.user_id,
            username,
            name: survey.name,
            age: survey.age,
            dailyScreenTime: survey.daily_screen_time,
            socialMediaPlatforms: survey.social_media_platforms,
            deviceAccess: survey.device_access,
            areasOfConcern: survey.areas_of_concern,
            preferredRewards: survey.preferred_rewards
          };
        }));
        
        setUserSurveys(surveyResults);
      }
    } catch (error) {
      console.error('Error fetching user surveys:', error);
      toast({
        title: 'Error fetching user surveys',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchUsers = async () => {
    try {
      // Get all profiles to get usernames
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, created_at');

      if (profilesError) throw profilesError;
      
      if (profilesData && profilesData.length > 0) {
        // Transform the data
        const users = profilesData.map(profile => ({
          id: profile.id,
          email: '', // We'll populate this from auth.users if possible
          username: profile.username || 'Unknown',
          createdAt: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown',
          lastSignIn: null
        }));
        
        // Try to get more info for each user, but this may fail due to permissions
        for (const userInfo of users) {
          try {
            // Note: This will only work if Supabase service_role key is used or admin rights
            // For demo purposes, we'll continue even if this fails
            const { data: userData } = await supabase.auth.admin.getUserById(userInfo.id);
            
            if (userData && userData.user) {
              userInfo.email = userData.user.email || '';
              userInfo.lastSignIn = userData.user.last_sign_in_at 
                ? new Date(userData.user.last_sign_in_at).toLocaleDateString() 
                : null;
            }
          } catch (error) {
            console.warn(`Could not fetch auth details for user ${userInfo.id}`, error);
            // Continue anyway, we already have basic profile info
          }
        }
        
        setUsersList(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    if (isAdmin) {
      fetchCompletedChallenges();
      fetchUserSurveys();
      fetchUsers();
      toast({
        title: 'Refreshing data',
        description: 'Getting the latest user data.',
      });
    }
  };

  const renderArrayAsBadges = (arr: string[] | null) => {
    if (!arr || arr.length === 0) return <span className="text-muted-foreground">None</span>;
    
    return (
      <div className="flex flex-wrap gap-1">
        {arr.map((item, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {item}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header activeTab="Dashboard" />
      <main className="container max-w-6xl mx-auto py-8 pb-20 px-4">
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
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="users" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  User Accounts
                </TabsTrigger>
                <TabsTrigger value="challenges" className="flex items-center">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Challenge Completions
                </TabsTrigger>
                <TabsTrigger value="surveys" className="flex items-center">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  User Surveys
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Accounts</CardTitle>
                    <CardDescription>
                      All registered users and their account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {usersList.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No user accounts found.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Sign In</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usersList.map((userInfo) => (
                            <TableRow key={userInfo.id}>
                              <TableCell className="font-mono text-xs">
                                {userInfo.id}
                              </TableCell>
                              <TableCell>{userInfo.email || '-'}</TableCell>
                              <TableCell className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                {userInfo.username || '-'}
                              </TableCell>
                              <TableCell>{userInfo.createdAt}</TableCell>
                              <TableCell>{userInfo.lastSignIn || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="challenges">
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
                            <TableHead>Email</TableHead>
                            <TableHead>Completion Date</TableHead>
                            <TableHead>Screenshots</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedChallenges.map((challenge) => (
                            <TableRow key={challenge.userId}>
                              <TableCell className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                {challenge.username}
                              </TableCell>
                              <TableCell>{challenge.userEmail}</TableCell>
                              <TableCell>{challenge.completionDate}</TableCell>
                              <TableCell>{challenge.screenshotCount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="surveys">
                <Card>
                  <CardHeader>
                    <CardTitle>User Surveys</CardTitle>
                    <CardDescription>
                      User survey responses for the digital detox program
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userSurveys.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No survey responses have been submitted yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Age</TableHead>
                              <TableHead>Daily Screen Time</TableHead>
                              <TableHead>Social Media</TableHead>
                              <TableHead>Areas of Concern</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userSurveys.map((survey) => (
                              <TableRow key={survey.userId}>
                                <TableCell className="font-medium">{survey.username}</TableCell>
                                <TableCell>{survey.name || '-'}</TableCell>
                                <TableCell>{survey.age || '-'}</TableCell>
                                <TableCell>{survey.dailyScreenTime || '-'}</TableCell>
                                <TableCell>{renderArrayAsBadges(survey.socialMediaPlatforms)}</TableCell>
                                <TableCell>{renderArrayAsBadges(survey.areasOfConcern)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

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
