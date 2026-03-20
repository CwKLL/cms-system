'use client';

import { useI18n } from '@/context/I18nContext';
import { level_color, status_config } from '@/lib/constants';
import { Award } from '@/types';
import {
  Box, Typography, Chip, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as XIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

interface Props {
  open: boolean;
  award: Award | null;
  onClose: () => void;
  /** Show admin-only actions (approve, reject, revert, delete) */
  isAdmin?: boolean;
  /** The viewing admin owns this submission — disable write actions */
  isOwn?: boolean;
  onApprove?: (award: Award) => void;
  onReject?: (awardId: string) => void;
  onRevert?: (awardId: string) => void;
  onDelete?: (awardId: string) => void;
  scoreInput?: string;
  scoreError?: string;
  onScoreChange?: (value: string) => void;
  /** When provided, submitter name becomes a clickable link */
  onProfileClick?: (userId: string) => void;
}

export default function AwardDetailDialog({
  open, award, onClose, isAdmin = false, isOwn = false,
  onApprove, onReject, onRevert, onDelete,
  scoreInput, scoreError, onScoreChange,
  onProfileClick,
}: Props) {
  const { t } = useI18n();

  const statusChip = (status: Award['status']) => {
    const cfg = status_config[status];
    return cfg
      ? <Chip icon={<cfg.Icon />} label={t(cfg.labelKey as any)} size="small" color={cfg.color} variant="outlined" />
      : null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {award && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.5}>
              {statusChip(award.status)}
              <Chip
                label={award.level}
                size="small"
                sx={{ bgcolor: `${level_color[award.level] ?? '#64748b'}20`, color: level_color[award.level] ?? '#64748b', fontWeight: 600 }}
              />
              <Typography component="span" variant="caption" fontWeight={600}>{award.category}</Typography>
            </Box>
            <Typography variant="h6" fontWeight={700}>{award.title}</Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.primary" mb={2}>{award.description}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              {t('submittedBy')}: {onProfileClick ? (
                <Typography
                  component="span"
                  variant="caption"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => { onClose(); onProfileClick(award.userId); }}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') { onClose(); onProfileClick(award.userId); } }}
                >{award.userName}</Typography>
              ) : (
                <Typography component="span" variant="caption" fontWeight={600} color="text.primary">{award.userName}</Typography>
              )} - {award.school}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              {t('submitted')}: {award.submittedAt ?? ''}
            </Typography>
            {award.status === 'approved' && award.approvedBy && (
              <Box mb={1}>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('reviewer')}: <Typography component="span" variant="caption" fontWeight={600} color="text.primary" sx={{ textDecoration: 'underline' }}>{award.approvedBy}</Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('reviewedOn')}: {award.approvedAt ?? ''}
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary" mt={1}>
                  +{award.score} <Typography component="span" variant="caption" color="text.secondary">{t('pts')}</Typography>
                </Typography>
              </Box>
            )}
            {award.status === 'rejected' && award.notes && (() => {
              const lastRejected = [...(award.notes ?? [])].reverse().find((n) => n.to === 'rejected') ?? award.notes[award.notes.length - 1];
              return (
                <Box mb={1}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t('reviewer')}: <Typography component="span" variant="caption" fontWeight={600} color="text.primary" sx={{ textDecoration: 'underline' }}>{lastRejected.by}</Typography>
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t('reviewedOn')}: {lastRejected.at ?? ''}
                  </Typography>
                  {lastRejected.reason && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t('rejectReason')}: {lastRejected.reason}
                    </Typography>
                  )}
                </Box>
              );
            })()}
            {isAdmin && award.status === 'pending' && !isOwn && (
              <Box mt={2}>
                <TextField
                  type="number"
                  size="small"
                  label={t('scoreLabel')}
                  inputProps={{ min: 0, max: 200 }}
                  value={scoreInput ?? ''}
                  onChange={(e) => onScoreChange?.(e.target.value)}
                  error={!!scoreError}
                  helperText={scoreError ?? ' '}
                  sx={{ width: 120 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 1.5 }}>
            <Box>
              {isAdmin && (award.status === 'pending' || award.status === 'rejected') && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<TrashIcon />}
                  disabled={isOwn}
                  onClick={() => { onDelete?.(award.id); onClose(); }}
                >
                  {t('delete')}
                </Button>
              )}
            </Box>
            <Box display="flex" gap={1}>
              <Button onClick={onClose}>{t('cancel')}</Button>
              {isAdmin && award.status === 'pending' && (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<XIcon />}
                    disabled={isOwn}
                    onClick={() => onReject?.(award.id)}
                  >
                    {t('reject')}
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    disabled={isOwn}
                    onClick={() => onApprove?.(award)}
                  >
                    {t('approve')}
                  </Button>
                </>
              )}
              {isAdmin && (award.status === 'approved' || award.status === 'rejected') && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onRevert?.(award.id)}
                >
                  {t('revertToPending')}
                </Button>
              )}
            </Box>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
