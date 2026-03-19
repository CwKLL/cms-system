'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAwards } from '@/context/AwardContext';
import { useI18n } from '@/context/I18nContext';
import {
  Box, Typography, Card, CardContent, Button, Chip, Divider, Stack,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AccessTime as ClockIcon,
  CheckCircle as CheckIcon,
  Cancel as XIcon,
  EmojiEvents as TrophyIcon,
  MilitaryTech as MedalIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

const STATUS_CONFIG = {
  approved: { label: 'statusApproved', color: 'success' as const, Icon: CheckIcon },
  pending:  { label: 'statusPending',  color: 'warning' as const, Icon: ClockIcon },
  rejected: { label: 'statusRejected', color: 'error' as const,   Icon: XIcon },
};

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { awards, deleteAward } = useAwards();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.replace('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  // Users see only their own awards
  const myAwards = awards.filter((a) => a.userId === currentUser.id);
  const totalScore = myAwards.filter((a) => a.status === 'approved').reduce((s, a) => s + a.score, 0);
  const approvedCount = myAwards.filter((a) => a.status === 'approved').length;
  const pendingCount  = myAwards.filter((a) => a.status === 'pending').length;
  const rejectedCount = myAwards.filter((a) => a.status === 'rejected').length;

  const statCards = [
    { label: t('totalScore'), value: totalScore, color: '#4f46e5', bg: '#eef2ff' },
    { label: t('approved'), value: approvedCount, color: '#15803d', bg: '#f0fdf4' },
    { label: t('pending'), value: pendingCount, color: '#b45309', bg: '#fffbeb' },
    { label: t('rejected'), value: rejectedCount, color: '#b91c1c', bg: '#fef2f2' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>{t('myDashboard')}</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {currentUser.name} · {currentUser.school} ·{' '}
            <Typography component="span" variant="body2" color="primary" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
              {currentUser.role === 'admin' ? t('roleAdmin') : t('roleUser')}
            </Typography>
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/upload"
          variant="contained"
          startIcon={<UploadIcon />}
        >
          {t('uploadAward')}
        </Button>
      </Box>

      {/* Stats */}
      <Box display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} gap={2}>
        {statCards.map((s) => (
          <Card key={s.label} variant="outlined" sx={{ bgcolor: s.bg }}>
            <CardContent sx={{ py: 2.5 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>{s.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Award list */}
      <Card variant="outlined">
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MedalIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>{t('mySubmissions')}</Typography>
          <Typography variant="body2" color="text.disabled" sx={{ ml: 'auto' }}>
            {myAwards.length} {t('total')}
          </Typography>
        </Box>

        {myAwards.length === 0 ? (
          <Box textAlign="center" py={8}>
            <TrophyIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1.5 }} />
            <Typography color="text.disabled">{t('noSubmissionsYet')}</Typography>
            <Button component={Link} href="/upload" color="primary" sx={{ mt: 1 }}>
              {t('uploadFirstAward')}
            </Button>
          </Box>
        ) : (
          <Stack divider={<Divider />}>
            {myAwards.map((award) => {
              const cfg = STATUS_CONFIG[award.status];
              return (
                <Box key={award.id} sx={{ px: 3, py: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
                      <Chip
                        icon={<cfg.Icon />}
                        label={t(cfg.label as any)}
                        size="small"
                        color={cfg.color}
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.disabled">
                        {award.level} · {award.category}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} noWrap>{award.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.25} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {award.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
                      {t('submitted')}: {award.submittedAt}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5} flexShrink={0}>
                    {award.status === 'approved' && (
                      <Typography variant="h6" fontWeight={700} color="primary">
                        +{award.score} {t('pts')}
                      </Typography>
                    )}
                    <Button
                      size="small"
                      color="error"
                      startIcon={<TrashIcon />}
                      onClick={() => deleteAward(award.id)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {t('delete')}
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Card>
    </Box>
  );
}
