'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import {
  Box, Typography, Card, CardContent, TextField, Button, IconButton,
  InputAdornment, Alert, Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
} from '@mui/icons-material';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@cms.edu', password: 'admin123' },
  { role: 'Student', email: 'alice@cms.edu', password: 'user123' },
  { role: 'Teacher', email: 'david@cms.edu', password: 'user123' },
];

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  if (currentUser) {
    router.replace('/dashboard');
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = login(email.trim(), password);
    if (ok) {
      router.push('/dashboard');
    } else {
      setError(t('invalidCredentials'));
    }
  };

  const fillDemo = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setError('');
  };

  return (
    <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
      <Box width="100%" maxWidth={440}>
        <Card variant="outlined" sx={{ overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ bgcolor: '#1e1b4b', px: 4, py: 5, textAlign: 'center' }}>
            <TrophyIcon sx={{ fontSize: 40, color: '#facc15', mb: 1.5 }} />
            <Typography variant="h5" fontWeight={700} color="#fff">{t('appName')}</Typography>
            <Typography variant="body2" color="#a5b4fc" mt={0.5}>{t('signInSubtitle')}</Typography>
          </Box>

          {/* Form */}
          <CardContent sx={{ px: 4, py: 3.5 }}>
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2.5}>
                <TextField
                  label={t('email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  placeholder="you@cms.edu"
                />
                <TextField
                  label={t('password')}
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  placeholder="••••••••"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw((v) => !v)} edge="end" size="small">
                          {showPw ? <EyeOffIcon fontSize="small" /> : <EyeIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" variant="contained" fullWidth size="large">
                  {t('signIn')}
                </Button>
              </Box>
            </form>
          </CardContent>

          {/* Demo accounts */}
          <Box px={4} pb={3.5}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.disabled">— {t('demoAccounts')} —</Typography>
            </Divider>
            <Box display="flex" flexDirection="column" gap={1}>
              {DEMO_ACCOUNTS.map((acc) => (
                <Button
                  key={acc.email}
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  onClick={() => fillDemo(acc.email, acc.password)}
                  sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                >
                  <Typography variant="body2" fontWeight={600}>{acc.role}</Typography>
                  <Typography variant="caption" color="text.secondary">{acc.email}</Typography>
                </Button>
              ))}
            </Box>
          </Box>
        </Card>

        <Typography variant="caption" display="block" textAlign="center" color="text.disabled" mt={2}>
          {t('guestNote')}{' '}
          <Typography component="a" href="/" variant="caption" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            {t('leaderboard')}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
