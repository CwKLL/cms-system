'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAwards } from '@/context/AwardContext';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { MOCK_USERS } from '@/lib/mockData';
import {
  Box, Typography, Card, CardContent, Avatar, Chip, Button, Divider, Stack,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
  AccessTime as ClockIcon,
  Cancel as XIcon,
  MilitaryTech as MedalIcon,
} from '@mui/icons-material';

const STATUS_MAP = {
  approved: { labelKey: 'statusApproved', color: 'success' as const, Icon: CheckIcon },
  pending:  { labelKey: 'statusPending',  color: 'warning' as const, Icon: ClockIcon },
  rejected: { labelKey: 'statusRejected', color: 'error' as const,   Icon: XIcon },
};

const LEVEL_COLOR: Record<string, string> = {
  International: '#7c3aed',
  National: '#2563eb',
  Regional: '#0891b2',
  District: '#0d9488',
  School: '#64748b',
};

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { awards } = useAwards();
  const { currentUser } = useAuth();
  const { t } = useI18n();

  const user = MOCK_USERS.find((u) => u.id === id);
  if (!user) {
    return (
      <Box textAlign="center" py={10}>
        <Typography color="text.secondary" variant="h6">{t('userNotFound')}</Typography>
        <Button component={Link} href="/" startIcon={<BackIcon />} sx={{ mt: 2 }}>
          {t('backToLeaderboard')}
        </Button>
      </Box>
    );
  }

  const isAdmin = currentUser?.role === 'admin';
  const isOwner = currentUser?.id === id;

  // Role-based filtering:
  // - Admin: sees all awards
  // - Owner (viewing own profile): sees all their own awards
  // - Others / public: sees only approved awards
  const allUserAwards = awards.filter((a) => a.userId === id);
  const visibleAwards = (isAdmin || isOwner)
    ? allUserAwards
    : allUserAwards.filter((a) => a.status === 'approved');

  const approvedAwards = allUserAwards.filter((a) => a.status === 'approved');
  const totalScore = approvedAwards.reduce((s, a) => s + a.score, 0);

  const byCategory = approvedAwards.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Box maxWidth={720} mx="auto" display="flex" flexDirection="column" gap={3}>
      {/* Back */}
      <Button component={Link} href="/" startIcon={<BackIcon />} sx={{ alignSelf: 'flex-start' }} color="inherit">
        {t('backToLeaderboard')}
      </Button>

      {/* Profile card */}
      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#1e1b4b', px: 4, py: 4 }}>
          <Box display="flex" alignItems="center" gap={2.5}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#4f46e5', fontSize: 22, fontWeight: 700 }}>
              {user.avatarInitials}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#fff">{user.name}</Typography>
              <Typography variant="body2" color="#a5b4fc" mt={0.5}>{user.school}</Typography>
              <Chip
                label={user.role === 'admin' ? t('roleAdmin') : t('roleUser')}
                size="small"
                sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.15)', color: '#c7d2fe', fontSize: '0.7rem', textTransform: 'capitalize' }}
              />
            </Box>
          </Box>
        </Box>

        {/* Score summary */}
        <Box
          display="grid"
          gridTemplateColumns={(isAdmin || isOwner) ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'}
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          {[
            { label: t('totalScore'), value: totalScore, color: '#4f46e5', always: true },
            { label: t('approvedAwards'), value: approvedAwards.length, color: '#15803d', always: true },
            { label: t('totalSubmissions'), value: visibleAwards.length, color: '#374151', always: false },
          ]
            .filter((s) => s.always || (isAdmin || isOwner))
            .map((s) => (
              <Box key={s.label} textAlign="center" px={3} py={2.5}>
                <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Box>
            ))}
        </Box>
      </Card>

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <TrophyIcon sx={{ color: '#eab308', fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight={600}>{t('achievementsByCategory')}</Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Object.entries(byCategory).map(([cat, count]) => (
                <Chip key={cat} label={`${cat} · ${count}`} sx={{ bgcolor: '#eef2ff', color: '#4338ca' }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Award list */}
      <Card variant="outlined">
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MedalIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>{t('allSubmissions')}</Typography>
        </Box>

        {visibleAwards.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography color="text.disabled">{t('noSubmissionsYet')}</Typography>
          </Box>
        ) : (
          <Stack divider={<Divider />}>
            {visibleAwards.map((award) => {
              const cfg = STATUS_MAP[award.status];
              return (
                <Box key={award.id} sx={{ px: 3, py: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.75}>
                      {(isAdmin || isOwner) && (
                        <Chip
                          icon={<cfg.Icon />}
                          label={t(cfg.labelKey as any)}
                          size="small"
                          color={cfg.color}
                          variant="outlined"
                        />
                      )}
                      <Chip
                        label={award.level}
                        size="small"
                        sx={{ bgcolor: `${LEVEL_COLOR[award.level] ?? '#64748b'}20`, color: LEVEL_COLOR[award.level] ?? '#64748b', fontWeight: 600 }}
                      />
                      <Typography variant="caption" color="text.disabled">{award.category}</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600}>{award.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.25}>{award.description}</Typography>
                    <Typography variant="caption" color="text.disabled" display="block" mt={0.75}>
                      {t('submitted')}: {award.submittedAt}
                    </Typography>
                  </Box>
                  {award.status === 'approved' && (
                    <Box flexShrink={0} textAlign="right">
                      <Typography variant="h6" fontWeight={700} color="primary">+{award.score}</Typography>
                      <Typography variant="caption" color="text.disabled">{t('pts')}</Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </Card>
    </Box>
  );
}
