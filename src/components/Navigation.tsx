
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and left navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png" 
                alt="mymoto" 
                className="h-8" 
              />
            </Link>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={cn(
                    "block py-2 px-3 text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
                  )}>
                    Shop cars
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/sell" className={cn(
                    "block py-2 px-3 text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
                  )}>
                    Sell
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/service" className={cn(
                    "block py-2 px-3 text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
                  )}>
                    Service
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/more" className={cn(
                    "block py-2 px-3 text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
                  )}>
                    More
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right navigation */}
          <div className="flex items-center gap-4">
            <Link to="/favorites" className="flex items-center gap-1 py-2 px-3 text-sm font-medium text-gray-700 hover:text-brand-green transition-colors">
              <Heart className="h-4 w-4" />
              <span>Favourites</span>
            </Link>
            <Link to="/locations" className="flex items-center gap-1 py-2 px-3 text-sm font-medium text-gray-700 hover:text-brand-green transition-colors">
              <MapPin className="h-4 w-4" />
              <span>Dealer locations</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
