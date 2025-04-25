import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserCircle2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
      console.error(error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center text-xl font-bold text-purple-600">
          <BarChart3 className="h-5 w-5 mr-2" />
          ExpenseEdge
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <UserCircle2 className="h-5 w-5 mr-1" />
              <span>{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
} 