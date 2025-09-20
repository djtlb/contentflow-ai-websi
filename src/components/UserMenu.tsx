import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Gear, SignOut, CreditCard, FileText, Crown } from "@phosphor-icons/react"
import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/supabase'
import { toast } from 'sonner'

export const UserMenu: React.FC = () => {
  const { user, isAdmin } = useAuth()

  const handleSignOut = async () => {
    try {
      const { error } = await auth.signOut()
      if (error) {
        toast.error('Sign out failed', {
          description: error.message
        })
      } else {
        toast.success('Signed out successfully')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'profile':
        toast.info('Profile settings coming soon!')
        break
      case 'billing':
        toast.info('Billing management coming soon!')
        break
      case 'content':
        toast.info('Content management coming soon!')
        break
      case 'settings':
        toast.info('Settings coming soon!')
        break
      case 'admin':
        toast.success('Admin access confirmed!', {
          description: 'You have full access to all premium features including AI video generation.'
        })
        break
    }
  }

  if (!user) return null

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              {isAdmin && (
                <Crown size={14} className="text-amber-600" />
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
              {isAdmin && <span className="text-amber-600 ml-1">(Admin)</span>}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => handleMenuAction('admin')}>
              <Crown className="mr-2 h-4 w-4 text-amber-600" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => handleMenuAction('profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMenuAction('content')}>
          <FileText className="mr-2 h-4 w-4" />
          <span>My Content</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMenuAction('billing')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMenuAction('settings')}>
          <Gear className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <SignOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}