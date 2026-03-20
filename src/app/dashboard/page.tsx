'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAwards } from '@/context/AwardContext';
import { useI18n } from '@/context/I18nContext';
import { level_color, status_config } from '@/lib/constants';
import { CATEGORIES, LEVELS } from '@/lib/mockData';
import { extractSemesters, getSemesterKey, getSemesterLabel } from '@/lib/semester';
import { Award } from '@/types';
import AwardDetailDialog from '@/components/AwardDetailDialog';
import {
  Box, Typography, Card, CardContent, Button, Chip, Divider, Stack, TextField, MenuItem,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  EmojiEvents as TrophyIcon,
  MilitaryTech as MedalIcon,
  Visibility as EyeIcon,
} from '@mui/icons-material';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { awards } = useAwards();
  const { t } = useI18n();
  const router = useRouter();
  const [semesterFilter, setSemesterFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewDialog, setViewDialog] = useState<{ open: boolean; award: Award | null }>({ open: false, award: null });

  useEffect(() => {
    if (!currentUser) router.replace('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const myAwards = awards.filter((a) => a.userId === currentUser.id);
  const availableSemesters = extractSemesters(myAwards.map((a) => a.submittedAt));

  const displayAwards = myAwards.filter((a) => {
    if (semesterFilter && getSemesterKey(a.submittedAt) !== semesterFilter) return false;
    if (levelFilter && a.level !== levelFilter) return false;
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  const { totalScore, approvedCount, pendingCount, rejectedCount } = displayAwards.reduce(
    (acc, a) => {
      if (a.status === 'approved') { acc.approvedCount++; acc.totalScore += a.score; }
      else if (a.status === 'pending') acc.pendingCount++;
      else acc.rejectedCount++;
      return acc;
    },
    { totalScore: 0, approvedCount: 0, pendingCount: 0, rejectedCount: 0 },
  );

  const statCards = [
    { label: t('totalScore'), value: totalScore, color: '#4f46e5', bg: '#eef2ff' },
    { label: t('approved'), value: approvedCount, color: '#15803d', bg: '#f0fdf4' },
    { label: t('pending'), value: pendingCount, color: '#b45309', bg: '#fffbeb' },
    { label: t('rejected'), value: rejectedCount, color: '#b91c1c', bg: '#fef2f2' },
    { label: t('totalSubmissions'), value: displayAwards.length, color: '#374151' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <AwardDetailDialog
        open={viewDialog.open}
        award={viewDialog.award}
        onClose={() => setViewDialog({ open: false, award: null })}
      />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>{t('myDashboard')}</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5} fontWeight={600} fontSize={24}>
            {currentUser.name} · {currentUser.school}
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
      <Box display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' }} gap={2}>
        {statCards.map((s) => (
          <Card key={s.label} variant="outlined" sx={{ bgcolor: s.bg }}>
            <CardContent sx={{ py: 2.5 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>{s.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          select size="small" label={t('filterBySemester')} value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)} sx={{ minWidth: 200 }}
        >
          <MenuItem value="">{t('allSemesters')}</MenuItem>
          {availableSemesters.map((k) => (
            <MenuItem key={k} value={k}>{getSemesterLabel(k)}</MenuItem>
          ))}
        </TextField>
        <TextField
          select size="small" label={t('filterByLevel')} value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)} sx={{ minWidth: 160 }}
        >
          <MenuItem value="">{t('allLevels')}</MenuItem>
          {LEVELS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
        </TextField>
        <TextField
          select size="small" label={t('filterByCategory')} value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)} sx={{ minWidth: 180 }}
        >
          <MenuItem value="">{t('allCategories')}</MenuItem>
          {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      </Box>

      {/* Award list */}
      <Card variant="outlined">
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MedalIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>{t('myAwards')}</Typography>
        </Box>

        {displayAwards.length === 0 ? (
          <Box textAlign="center" py={8}>
            <TrophyIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1.5 }} />
            <Typography color="text.disabled">{t('noSubmissionsYet')}</Typography>
            <Button component={Link} href="/upload" color="primary" sx={{ mt: 1 }}>
              {t('uploadFirstAward')}
            </Button>
          </Box>
        ) : (
          <Stack divider={<Divider />}>
            {displayAwards.map((award) => {
              const cfg = status_config[award.status];
              return (
                <Box key={award.id} sx={{ px: 3, py: 2, display: 'flex', alignItems: 'stretch', gap: 2 }}>
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
                      <Chip
                        icon={<cfg.Icon />}
                        label={t(cfg.labelKey as any)}
                        size="small"
                        color={cfg.color}
                        variant="outlined"
                      />
                      <Chip
                        label={award.level}
                        size="small"
                        sx={{ bgcolor: `${level_color[award.level] ?? '#64748b'}20`, color: level_color[award.level] ?? '#64748b', fontWeight: 600 }}
                      />
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ display: 'inline-flex', alignItems: 'center', height: 24, lineHeight: 1, fontWeight: 600, fontSize: 13, color: 'black' }}
                      >
                        {award.category}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} noWrap sx={{ textDecoration: 'underline' }}>{award.title}</Typography>
                    <Typography variant="body2" color="black" mt={0.25} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {award.description}
                    </Typography>
                    <Typography variant="caption" color="black" mt={0.5} display="block">
                      {t('submitted')}: {award.submittedAt}
                    </Typography>
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
                  <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end" gap={0.5} flexShrink={0}>
                    <Box>
                      {award.status === 'approved' && (
                        <Typography variant="h6" fontWeight={700} color="primary">
                          +{award.score} {t('pts')}
                        </Typography>
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