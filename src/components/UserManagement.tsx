
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserX, Shield, ShieldOff } from 'lucide-react';
import { User } from '@/auth/AuthContext';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList: User[] = [];
        
        usersSnapshot.forEach(doc => {
          const userData = doc.data() as User;
          userData.id = userData.id || 0; // Ensure ID exists
          usersList.push({
            ...userData,
            email: userData.email || '',
            avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
          });
        });
        
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  // Toggle admin status
  const toggleAdmin = async (userId: number, isAdmin: boolean) => {
    try {
      setIsLoading(true);
      
      // Find the Firestore doc ID for this user
      const usersSnapshot = await getDocs(collection(db, 'users'));
      let userDocId = '';
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.id === userId) {
          userDocId = doc.id;
        }
      });
      
      if (!userDocId) {
        throw new Error("User document not found");
      }
      
      // Update the user's admin status
      await updateDoc(doc(db, 'users', userDocId), {
        isAdmin: !isAdmin
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isAdmin: !isAdmin } 
          : user
      ));
      
      toast({
        title: "Success",
        description: `Admin ${isAdmin ? 'rights removed from' : 'rights granted to'} ${users.find(u => u.id === userId)?.name}`,
      });
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove user
  const removeUser = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this user?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Find the Firestore doc ID for this user
      const usersSnapshot = await getDocs(collection(db, 'users'));
      let userDocId = '';
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.id === userId) {
          userDocId = doc.id;
        }
      });
      
      if (!userDocId) {
        throw new Error("User document not found");
      }
      
      // Delete the user document
      await deleteDoc(doc(db, 'users', userDocId));
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Success",
        description: `User ${users.find(u => u.id === userId)?.name} has been removed`,
      });
    } catch (error) {
      console.error("Error removing user:", error);
      toast({
        title: "Error",
        description: "Failed to remove user.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="animate-spin h-8 w-8" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Manage Users</h3>
      
      <div className="bg-background/50 rounded-md p-4">
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-background/70 rounded-md">
              <div className="flex items-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAdmin(user.id, user.isAdmin || false)}
                  className={user.isAdmin ? "bg-amber-700/20" : ""}
                >
                  {user.isAdmin 
                    ? <><ShieldOff className="h-4 w-4 mr-1" /> Remove Admin</>
                    : <><Shield className="h-4 w-4 mr-1" /> Make Admin</>}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeUser(user.id)}
                >
                  <UserX className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <p className="text-center py-4 text-gray-400">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};
