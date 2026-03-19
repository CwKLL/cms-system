'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAwards } from '@/context/AwardContext';
import { useI18n } from '@/context/I18nContext';
import { Award } from '@/types';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, Chip, Button, TextField,
  IconButton, Divider, Stack, Alert,
} from '@mui/material';
import {
  AdminPanelSettings as ShieldIcon,
  AccessTime as ClockIcon,
  CheckCircle as CheckIcon,
  Cancel as XIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

type TabKey = 'pending' | 'approved' | 'rejected' | 'all';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const { awards, approveAward, rejectAward, deleteAward } = useAwards();
  const { t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('pending');
  const [scoreInput, setScoreInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUser) { router.replace('/login'); return; }
    if (currentUser.role !== 'admin') router.replace('/');
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const filtered = tab === 'all' ? awards : awards.filter((a) => a.status === tab);

  const counts = {
    pending:  awards.filter((a) => a.status === 'pending').length,
    approved: awards.filter((a) => a.status === 'approved').length,
    rejected: awards.filter((a) => a.status === 'rejected').length,
    all:      awards.length,
  };

  const handleApprove = (award: Award) => {
    const raw = scoreInput[award.id];
    const score = parseInt(raw ?? '', 10);
    if (isNaN(score) || score < 0) {
      alert(t('enterValidScore'));
      return;
    }
    approveAward(award.id, score, currentUser.name);
  };

  const statusChip = (status: string) => {
    if (status === 'pending') return <Chip icon={<ClockIcon />} label={t('statusPending')} size="small" color="warning" variant="outlined" />;
    if (status === 'approved') return <Chip icon={<CheckIcon />} label={t('statusApproved')} size="small" color="success" variant="outlined" />;
    if (status === 'rejected') return <Chip icon={<XIcon />} label={t('statusRejected')} size="small" color="error" variant="outlined" />;
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <ShieldIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>{t('adminPanel')}</Typography>
          <Typography variant="body2" color="text.secondary">{t('reviewAndScore')}</Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Card variant="outlined" sx={{ overflow: 'visible' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 2, pt: 1, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 48 } }}
        >
          <Tab value="pending" label={`${t('statusPending')} (${counts.pending})`} />
          <Tab value="approved" label={`${t('statusApproved')} (${counts.approved})`} />
          <Tab value="rejected" label={`${t('statusRejected')} (${counts.rejected})`} />
          <Tab value="all" label={`${t('statusAll')} (${counts.all})`} />
        </Tabs>
      </Card>

      {/* Award cards */}
      {filtered.length === 0 ? (
        <Box textAlign="center" py={8}>
          <CheckIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
          <Typography color="text.disabled">{t('noSubmissionsInCategory')}</Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {filtered.map((award) => (
            <Card key={award.id} variant="outlined">
              <CardContent sx={{ p: 3 }}>
                {/* Status, meta, score */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={1}>
                      {statusChip(award.status)}
                      <Typography variant="caption" color="text.disabled">
                        {award.level} · {award.category}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>{award.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>{award.description}</Typography>
                    <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                      {t('by')} <Typography component="span" variant="caption" fontWeight={600} color="text.primary">{award.userName}</Typography> · {award.school} · {t('submitted')}: {award.submittedAt}
                    </Typography>
                    {award.approvedBy && (
                      <Typography variant="caption" color="text.disabled" display="block">
                        {award.status === 'approved'
                          ? t('approvedByOn', { approver: award.approvedBy, date: award.approvedAt ?? '' })
                          : t('reviewedByOn', { approver: award.approvedBy, date: award.approvedAt ?? '' })}
                        {award.status === 'approved' && ` · ${t('score')}: ${award.score} ${t('pts')}`}
                      </Typography>
                    )}
                  </Box>

                  {award.status === 'approved' && (
                    <Typography variant="h5" fontWeight={700} color="primary" sx={{ flexShrink: 0 }}>
                      +{award.score} <Typography component="span" variant="caption" color="text.secondary">{t('pts')}</Typography>
                    </Typography>
                  )}
                </Box>

                {/* Admin actions for pending */}
                {award.status === 'pending' && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                      <TextField
                        type="number"
                        size="small"
                        label={t('scoreLabel')}
                        inputProps={{ min: 0, max: 200 }}
                        value={scoreInput[award.id] ?? ''}
                        onChange={(e) => setScoreInput((prev) => ({ ...prev, [award.id]: e.target.value }))}
                        sx={{ width: 100 }}
                      />
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={() => handleApprove(award)}
                      >
                        {t('approve')}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<XIcon />}
                        onClick={() => rejectAward(award.id, currentUser.name)}
                      >
                        {t('reject')}
                      </Button>
                      <Box flex={1} />
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<TrashIcon />}
                        onClick={() => deleteAward(award.id)}
                      >
                        {t('delete')}
                      </Button>
                    </Box>
                  </>
                )}

                {/* Delete for already reviewed */}
                {(award.status === 'approved' || award.status === 'rejected') && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<TrashIcon />}
                        onClick={() => deleteAward(award.id)}
                      >
                        {t('delete')}
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
