'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAwards } from '@/context/AwardContext';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { MOCK_USERS } from '@/lib/mockData';
import { level_color, status_config } from '@/lib/constants';
import { Award } from '@/types';
import AwardDetailDialog from '@/components/AwardDetailDialog';
import {
  Box, Typography, Card, CardContent, Avatar, Chip, Button, Divider, Stack,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  ArrowBack as BackIcon,
  MilitaryTech as MedalIcon,
  Visibility as EyeIcon,
} from '@mui/icons-material';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { awards } = useAwards();
  const { currentUser } = useAuth();
  const { t } = useI18n();

  const searchParams = useSearchParams();
  const from = searchParams?.get('from') ?? '';
  const fromAdmin = from === 'admin';
  const [viewDialog, setViewDialog] = useState<{ open: boolean; award: Award | null }>({ open: false, award: null });

  const user = MOCK_USERS.find((u) => u.id === id);
  if (!user) {
    return (
      <Box textAlign="center" py={10}>
        <Typography color="text.secondary" variant="h6">{t('userNotFound')}</Typography>
        <Button component={Link} href={fromAdmin ? '/admin' : '/'} startIcon={<BackIcon />} sx={{ mt: 2 }}>
          {t(fromAdmin ? 'backToAdmin' : 'backToLeaderboard')}
        </Button>
      </Box>
    );
  }

  const isAdmin = currentUser?.role === 'admin';
  const isOwner = currentUser?.id === id;

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
      <AwardDetailDialog
        open={viewDialog.open}
        award={viewDialog.award}
        onClose={() => setViewDialog({ open: false, award: null })}
      />

      {/* Back */}
      <Button component={Link} href={fromAdmin ? '/admin' : '/'} startIcon={<BackIcon />} sx={{ alignSelf: 'flex-start' }} color="inherit">
        {t(fromAdmin ? 'backToAdmin' : 'backToLeaderboard')}
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
            { label: (isAdmin || isOwner) ? t('approvedAwards') : t('awards'), value: approvedAwards.length, color: '#15803d', always: true },
            { label: t('totalSubmissions'), value: allUserAwards.length, color: '#374151', always: false },
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
          <Typography variant="subtitle1" fontWeight={600}>{t('totalAwards')}</Typography>
        </Box>

        {visibleAwards.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography color="text.disabled">{t('noSubmissionsYet')}</Typography>
          </Box>
        ) : (
          <Stack divider={<Divider />}>
            {visibleAwards.map((award) => {
              const cfg = status_config[award.status];
              return (
                <Box key={award.id} sx={{ px: 3, py: 2, display: 'flex', alignItems: 'stretch', gap: 2 }}>
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
                        sx={{ bgcolor: `${level_color[award.level] ?? '#64748b'}20`, color: level_color[award.level] ?? '#64748b', fontWeight: 600 }}
                      />
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ display: 'inline-flex', alignItems: 'center', height: 24, lineHeight: 1, fontWeight: 600, color: 'black' }}
                      >
                        {award.category}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} sx={{ textDecoration: 'underline' }}>{award.title}</Typography>
                    <Typography variant="body2" color="black" mt={0.25}>{award.description}</Typography>
                    {(isOwner || isAdmin) && (
                      <Typography variant="caption" color="black" mt={0.5} display="block">
                        {t('submitted')}: {award.submittedAt}
                      </Typography>
                    )}
                    {award.status === 'rejected' && award.notes && (
                      (() => {
                        const lastRejected = [...(award.notes ?? [])].reverse().find((n) => n.to === 'rejected') ?? award.notes[award.notes.length - 1];
                        return (
                          <Box>
                            <Typography variant="caption" color="black" display="block">
                              {t('reviewer')}: <Typography component="span" variant="caption" fontWeight={600} color="text.primary" sx={{ textDecoration: 'underline' }}>{lastRejected.by}</Typography>
                            </Typography>
                            <Typography variant="caption" color="black" display="block">
                              {t('reviewedOn')}: {lastRejected.at ?? ''}
                            </Typography>
                            {lastRejected.reason && (
                              <Typography variant="caption" color="black" display="block">
                                {t('rejectReason')}: {lastRejected.reason}
                              </Typography>
                            )}
                          </Box>
                        );
                      })()
                    )}
                  </Box>
                  <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end" flexShrink={0}>
                    <Box>
                      {award.status === 'approved' && (
                        <Typography variant="h6" fontWeight={700} color="primary">+{award.score} {t('pts')}</Typography>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EyeIcon sx={{ fontSize: 13 }} />}
                      sx={{ fontSize: '0.75rem', px: 2, minWidth: 100 }}
                      onClick={() => setViewDialog({ open: true, award })}
                    >
                      {t('view')}
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
