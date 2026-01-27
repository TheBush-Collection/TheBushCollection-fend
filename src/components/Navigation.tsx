import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Settings, Calendar, Star, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserBookingsModal from '@/components/UserBookingsModal';


export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowNav(false); // scrolling down
      } else {
        setShowNav(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Support both backend user shape and frontend user properties
  const displayName =
    user?.fullName || user?.name ||
    (user?.email ? user.email.split('@')[0] : 'User');

  const navItems = [
    { path: '/', label: 'Home', color: '#5C3B22', textColor: '#FFFFFF' }, 
    { path: '/about', label: 'About', color: '#A19B5C', textColor: '#FFFFFF' }, 
    { path: '/packages', label: 'Packages', color: '#758774', textColor: '#FFFFFF' }, 
    { path: '/collections', label: 'Collections', color: '#6E6B6B', textColor: '#FFFFFF' },
    { path: '/media-center', label: 'Media Center', color: '#434C43', textColor: '#FFFFFF' },
    { path: '/contact', label: 'Contact', color: '#70A9D3', textColor: '#FFFFFF' } 
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`bg-[#efe7d1] sticky top-0 z-50 border-b border-[#e6dcc7] transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}> 
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/images/Bush Collection Logo.webp"
                alt="The Bush Collection"
                className="h-16 w-auto"
              />
                 </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`relative z-10 transition-all px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      active
                        ? 'shadow-md'
                        : 'hover:brightness-95'
                    }`}
                    style={active ? {
                      color: item.textColor,
                      backgroundColor: item.color,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
                    } : { color: '#2f2a27' }}
                  >
                    {item.label}
                  </Link>
                  {!active && (
                    <div 
                      className="absolute inset-0 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-10 z-0"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </div>
              );
            })}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-transparent">
                    <div className="w-8 h-8 bg-[#d9732b] rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#2f2a27]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="flex items-center space-x-2 cursor-pointer">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="flex items-center space-x-2 cursor-pointer">
                    <UserBookingsModal>
                      <div className="flex items-center space-x-2 w-full">
                        <Calendar className="h-4 w-4" />
                        <span>My Bookings</span>
                      </div>
                    </UserBookingsModal>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="flex items-center space-x-2 cursor-pointer">
                    <Link to="/profile" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="rounded-full bg-white text-[#2f2a27] border-[#d7cdb8]">
                    Login
                  </Button>
                </Link>
              </div>
            )}
            </div>

            <Link to="/book">
              <Button className="rounded-full px-5 py-2" style={{ backgroundColor: '#2b1f16', color: '#fff' }}>
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#e6dcc7] bg-[#efe7d1]">
             <div className="px-2 pt-2 pb-3 space-y-1">
               {navItems.map((item) => (
                 <Link
                   key={item.path}
                   to={item.path}
                   className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                     isActive(item.path)
                       ? 'text-orange-600 bg-orange-50'
                       : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                   }`}
                   onClick={() => setIsMenuOpen(false)}
                 >
                   {item.label}
                 </Link>
               ))}

               {/* Mobile Authentication */}
               <div className="px-3 py-2 space-y-2">
                 {user ? (
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="outline" className="w-full flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                           <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                             <User className="h-3 w-3 text-white" />
                           </div>
                               <span className="text-sm">{displayName}</span>
                         </div>
                         <ChevronDown className="h-4 w-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-56">
                       <DropdownMenuLabel className="font-normal">
                         <div className="flex flex-col space-y-1">
                           <p className="text-sm font-medium leading-none">{displayName}</p>
                           <p className="text-xs leading-none text-muted-foreground">
                             {user.email}
                           </p>
                         </div>
                       </DropdownMenuLabel>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem asChild className="flex items-center space-x-2 cursor-pointer">
                         <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                           <Star className="h-4 w-4" />
                           <span>Dashboard</span>
                         </Link>
                       </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem asChild className="flex items-center space-x-2 cursor-pointer">
                         <UserBookingsModal>
                           <div className="flex items-center space-x-2 w-full" onClick={() => setIsMenuOpen(false)}>
                             <Calendar className="h-4 w-4" />
                             <span>My Bookings</span>
                           </div>
                         </UserBookingsModal>
                       </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem asChild className="flex items-center space-x-2 cursor-pointer">
                         <Link to="/profile" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                           <Settings className="h-4 w-4" />
                           <span>My Profile</span>
                         </Link>
                       </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem
                         onClick={() => {
                           logout();
                           setIsMenuOpen(false);
                         }}
                         className="flex items-center space-x-2 cursor-pointer"
                       >
                         <LogOut className="h-4 w-4" />
                         <span>Log out</span>
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 ) : (
                   <>
                     <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                       <Button variant="outline" className="w-full">
                         Login
                       </Button>
                     </Link>
                   </>
                 )}

                <Link to="/book" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Book Now
                  </Button>
                </Link>
               </div>
             </div>
           </div>
         )}
      </div>
    </nav>
  );
}