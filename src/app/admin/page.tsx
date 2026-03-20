'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAwards } from '@/context/AwardContext';
import { useI18n } from '@/context/I18nContext';
import { level_color, status_config } from '@/lib/constants';
import { CATEGORIES, LEVELS } from '@/lib/mockData';
import { extractSemesters, getSemesterKey, getSemesterLabel } from '@/lib/semester';
import { Award } from '@/types';
import AwardDetailDialog from '@/components/AwardDetailDialog';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, Chip, Button, TextField,
  Stack, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
} from '@mui/material';
import {
  AdminPanelSettings as ShieldIcon,
  CheckCircle as CheckIcon,
  Visibility as EyeIcon,
} from '@mui/icons-material';

type TabKey = 'pending' | 'approved' | 'rejected' | 'all';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const { awards, rejectAward, updateStatus, deleteAward } = useAwards();
  const { t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('pending');
  const [scoreInput, setScoreInput] = useState<Record<string, string>>({});
  const [scoreError, setScoreError] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'warning' | 'success' | 'info' }>({ open: false, message: '', severity: 'error' });
  const [reasonDialog, setReasonDialog] = useState<{ open: boolean; awardId: string; type: 'reject' | 'revert'; reason: string }>({ open: false, awardId: '', type: 'reject', reason: '' });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; award: Award | null }>({ open: false, award: null });
  const [semesterFilter, setSemesterFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (!currentUser) { router.replace('/login'); return; }
    if (currentUser.role !== 'admin') router.replace('/');
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const showSnackbar = (message: string, severity: 'error' | 'warning' | 'success' | 'info' = 'error') =>
    setSnackbar({ open: true, message, severity });

  const handleReasonConfirm = () => {
    const { awardId, type, reason } = reasonDialog;
    if (type === 'reject') {
      rejectAward(awardId, currentUser.name, reason || undefined);
    } else {
      updateStatus(awardId, 'pending', currentUser.name, reason || undefined);
    }
    setReasonDialog({ open: false, awardId: '', type: 'reject', reason: '' });
  };

  const availableSemesters = extractSemesters(awards.map((a) => a.submittedAt));

  const awardsInFilter = awards.filter((a) => {
    if (semesterFilter && getSemesterKey(a.submittedAt) !== semesterFilter) return false;
    if (levelFilter && a.level !== levelFilter) return false;
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  const filtered = tab === 'all' ? awardsInFilter : awardsInFilter.filter((a) => a.status === tab);

  const counts = {
    pending: awardsInFilter.filter((a) => a.status === 'pending').length,
    approved: awardsInFilter.filter((a) => a.status === 'approved').length,
    rejected: awardsInFilter.filter((a) => a.status === 'rejected').length,
    all: awardsInFilter.length,
  };

  const handleApprove = (award: Award) => {
    if (award.userId === currentUser.id) {
      showSnackbar(t('cannotApproveOwn'), 'warning');
      return;
    }

    const raw = scoreInput[award.id];
    const score = parseInt(raw ?? '', 10);
    if (isNaN(score) || score < 0) {
      setScoreError((prev) => ({ ...prev, [award.id]: t('enterValidScore') }));
      return;
    }
    setScoreError((prev) => { const next = { ...prev }; delete next[award.id]; return next; });
    updateStatus(award.id, 'approved', currentUser.name, undefined, score);
    setViewDialog({ open: false, award: null });
  };

  const handleRejectFromModal = (awardId: string) => {
    setViewDialog({ open: false, award: null });
    setReasonDialog({ open: true, awardId, type: 'reject', reason: '' });
  };

  const handleRevertFromModal = (awardId: string) => {
    setViewDialog({ open: false, award: null });
    setReasonDialog({ open: true, awardId, type: 'revert', reason: '' });
  };

  const statusChip = (status: Award['status']) => {
    const cfg = status_config[status];
    return cfg
      ? <Chip icon={<cfg.Icon />} label={t(cfg.labelKey as any)} size="small" color={cfg.color} variant="outlined" />
      : null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Snackbar for inline notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Reason dialog for reject / revert */}
      <Dialog
        open={reasonDialog.open}
        onClose={() => setReasonDialog((d) => ({ ...d, open: false }))}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {reasonDialog.type === 'reject' ? t('enterRejectReason') : t('enterRevertReason')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            size="small"
            sx={{ mt: 1 }}
            value={reasonDialog.reason}
            onChange={(e) => setReasonDialog((d) => ({ ...d, reason: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReasonDialog((d) => ({ ...d, open: false }))}>
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            color={reasonDialog.type === 'reject' ? 'error' : 'primary'}
            onClick={handleReasonConfirm}
          >
            {reasonDialog.type === 'reject' ? t('reject') : t('revertToPending')}
          </Button>
        </DialogActions>
      </Dialog>

      <AwardDetailDialog
        open={viewDialog.open}
        award={viewDialog.award}
        onClose={() => setViewDialog({ open: false, award: null })}
        isAdmin
        isOwn={!!viewDialog.award && viewDialog.award.userId === currentUser.id}
        onApprove={handleApprove}
        onReject={handleRejectFromModal}
        onRevert={handleRevertFromModal}
        onDelete={deleteAward}
        scoreInput={scoreInput[viewDialog.award?.id ?? ''] ?? ''}
        scoreError={scoreError[viewDialog.award?.id ?? '']}
        onScoreChange={(v) => {
          const id = viewDialog.award?.id ?? '';
          setScoreInput((prev) => ({ ...prev, [id]: v }));
          setScoreError((prev) => { const n = { ...prev }; delete n[id]; return n; });
        }}
        onProfileClick={(userId) => router.push(`/profile/${userId}?from=admin`)}
      />

      {/* Header */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <ShieldIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>{t('adminPanel')}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>{t('reviewAndScore')}</Typography>
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

      {/* Award cards */}
      {filtered.length === 0 ? (
        <Box textAlign="center" py={8}>
          <CheckIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
          <Typography color="text.disabled">{t('noSubmissionsInCategory')}</Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {filtered.map((award) => {
            const isOwn = award.userId === currentUser.id;
            return (
              <Card key={award.id} variant="outlined" sx={{ position: 'relative', ...(isOwn ? { opacity: 0.55, bgcolor: 'action.hover' } : {}) }}>
                <CardContent sx={{ p: 3 }}>
                  {isOwn && (
                    <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'background.paper', px: 1, py: 0.25, borderRadius: 1, boxShadow: 1 }}>
                      <Typography variant="caption" fontSize={16} color="text.secondary">{t('ownSubmissionDisabled')}</Typography>
                    </Box>
                  )}
                  {/* Status, meta, score */}
                  <Box display="flex" justifyContent="space-between" alignItems="stretch" gap={2}>
                    <Box flex={1} minWidth={0}>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={1}>
                        {statusChip(award.status)}
                        <Chip
                          label={award.level}
                          size="small"
                          sx={{ bgcolor: `${level_color[award.level] ?? '#64748b'}20`, color: level_color[award.level] ?? '#64748b', fontWeight: 600 }}
                        />
                        <Typography component="span" variant="caption" sx={{ display: 'inline-flex', alignItems: 'center', height: 24, lineHeight: 1, fontWeight: 600, color: 'black' }}>
                          {award.category}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ textDecoration: 'underline' }}>{award.title}</Typography>
                      <Typography variant="body2" color="black" mt={0.5}>{award.description}</Typography>
                      <Box>
                        <Typography variant="caption" color="black" display="block" mt={0.5}>
                          {t('submittedBy')}: <Typography
                            component="span"
                            variant="caption"
                            fontWeight={600}
                            color="text.primary"
                            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => router.push(`/profile/${award.userId}?from=admin`)}
                            role="link"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/profile/${award.userId}?from=admin`); }}
                          >
                            {award.userName}
                          </Typography> - {award.school}
                        </Typography>
                        <Typography variant="caption" color="black" display="block">
                          {t('submitted')}: {award.submittedAt ?? ''}
                        </Typography>
                      </Box>
                      {award.status === 'approved' && award.approvedBy && (
                        <Box>
                          <Typography variant="caption" color="black" display="block">
                            {t('reviewer')}: <Typography component="span" variant="caption" fontWeight={600} color="text.primary" sx={{ textDecoration: 'underline' }}>{award.approvedBy}</Typography>
                          </Typography>
                          <Typography variant="caption" color="black" display="block">
                            {t('reviewedOn')}: {award.approvedAt ?? ''}
                          </Typography>
                        </Box>
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

                    {/* Right column: pts top, View bottom */}
                    <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end" sx={{ flexShrink: 0 }}>
                      <Box>
                        {award.status === 'approved' && (
                          <Typography variant="h6" fontWeight={700} color="primary">
                            +{award.score} <Typography component="span" variant="caption" color="text.secondary">{t('pts')}</Typography>
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
                </CardContent>
              </Card>
            )
          })}
        </Stack>
      )}
    </Box>
  );
}
