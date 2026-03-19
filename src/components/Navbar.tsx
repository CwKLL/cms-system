'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box, Menu, MenuItem,
  Chip, Tooltip, ListItemIcon, ListItemText, Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  AdminPanelSettings as AdminIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { Locale, localeLabels } from '@/i18n';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string) => pathname === href;

  const navButtonSx = (href: string) => ({
    color: isActive(href) ? '#fff' : 'rgba(255,255,255,0.7)',
    bgcolor: isActive(href) ? 'rgba(255,255,255,0.15)' : 'transparent',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' },
    borderRadius: 2,
    px: 2,
    textTransform: 'none' as const,
    fontWeight: 600,
    fontSize: '0.875rem',
  });

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1e1b4b', boxShadow: 3 }}>
      <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrophyIcon sx={{ color: '#facc15', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            {t('appName')}
          </Typography>
        </Link>

        {/* Nav links */}
        <Box sx={{ display: 'flex', gap: 0.5, ml: 4, flexGrow: 1 }}>
          <Button component={Link} href="/" startIcon={<TrophyIcon />} sx={navButtonSx('/')}>
            {t('leaderboard')}
          </Button>
          {currentUser && (
            <>
              <Button component={Link} href="/dashboard" startIcon={<DashboardIcon />} sx={navButtonSx('/dashboard')}>
                {t('dashboard')}
              </Button>
              <Button component={Link} href="/upload" startIcon={<UploadIcon />} sx={navButtonSx('/upload')}>
                {t('uploadAward')}
              </Button>
            </>
          )}
          {currentUser?.role === 'admin' && (
            <Button component={Link} href="/admin" startIcon={<AdminIcon />} sx={navButtonSx('/admin')}>
              {t('admin')}
            </Button>
          )}
        </Box>

        {/* Language switcher */}
        <Tooltip title={t('language')}>
          <IconButton onClick={(e) => setLangAnchor(e.currentTarget)} sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }}>
            <LanguageIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={() => setLangAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {(Object.entries(localeLabels) as [Locale, string][]).map(([key, label]) => (
            <MenuItem
              key={key}
              selected={locale === key}
              onClick={() => { setLocale(key); setLangAnchor(null); }}
            >
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>

        {/* Auth section */}
        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#4f46e5', fontSize: '0.75rem', fontWeight: 700 }}>
              {currentUser.avatarInitials}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="body2" sx={{ color: '#c7d2fe', fontWeight: 600, lineHeight: 1.2 }}>
                {currentUser.name}
              </Typography>
              <Chip
                label={currentUser.role === 'admin' ? t('roleAdmin') : t('roleUser')}
                size="small"
                sx={{ height: 18, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.15)', color: '#c7d2fe', mt: 0.25 }}
              />
            </Box>
            <Tooltip title={t('logout')}>
              <IconButton onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Button
            component={Link}
            href="/login"
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#6366f1' }, textTransform: 'none', fontWeight: 600 }}
          >
            {t('login')}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
