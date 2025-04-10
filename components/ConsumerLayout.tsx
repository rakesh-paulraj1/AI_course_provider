"use client"
import Link from 'next/link';

import { Award, LogOut, Menu, X,} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from "next/navigation";
interface LayoutProps {
  children: React.ReactNode;
}


export function Layoutconsumer({ children }: LayoutProps) {
const router = useRouter();
  const handlesignout = async () => {
    await signOut({
      redirect: false, // We'll handle the redirect manually
    });
    router.push('/'); // Redirect to sign-in page after logout
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/70 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center w-full">
      
        <div className="flex items-center mr-auto">
          <Link href="/" className="font-semibold text-lg">
            Course GPT
          </Link>
        </div>
        
        
        <nav className="hidden md:flex items-center gap-4 mx-auto">
          {/* <Link href="/createcourse">
            <button className='px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'>
              Explore Courses
            </button>
          </Link> */}
          <Link href="/consumerprofile">
            <button className='px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'>
              Profile
            </button>
          </Link>
        </nav>
        <div>

        </div>
        
        {/* Right-aligned items */}
        <div className="flex items-center ml-auto">
        <div className="hidden md:block">
          <button onClick={handlesignout}><LogOut className="h-5 w-5" /></button>
    
  </div>
  <div className="block md:hidden flex items-center space-x-2">
    <LogOut className="h-5 w-5" />
    <button onClick={toggleMobileMenu} aria-label="Toggle menu">
      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  </div>
</div>
</div>

{/* Mobile Navigation */}
{mobileMenuOpen && (
  <div className="md:hidden border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col space-y-2">
      {/* <Link href="/createcourse">
        <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
          Create Course
        </button>
      </Link> */}
      <Link href="/consumerprofile">
        <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
          Profile
        </button>
      </Link>
    </div>
  </div>
)}
    </header>
    
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full">
        {children}
      </div>
    </main>
    
    <footer className="border-t border-border py-6 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground"></p>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Course GPT 
        </p>
      </div>
    </footer>
  </div>
  );
}
