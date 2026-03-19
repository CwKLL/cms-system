'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAwards } from '@/context/AwardContext';
import { useI18n } from '@/context/I18nContext';
import { CATEGORIES, LEVELS } from '@/lib/mockData';
import {
  Box, Typography, Card, CardContent, TextField, Button, MenuItem, Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

export default function UploadPage() {
  const { currentUser } = useAuth();
  const { submitAward } = useAwards();
  const { t } = useI18n();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!currentUser) router.replace('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitAward({
      userId: currentUser.id,
      userName: currentUser.name,
      school: currentUser.school,
      title,
      description,
      category,
      level,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} mb={1}>{t('submissionReceived')}</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>{t('awardPendingReview')}</Typography>
          <Box display="flex" gap={1.5} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => { setTitle(''); setDescription(''); setSubmitted(false); }}
            >
              {t('submitAnother')}
            </Button>
            <Button variant="contained" onClick={() => router.push('/dashboard')}>
              {t('goToDashboard')}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxWidth={640} mx="auto">
      <Box mb={3.5}>
        <Typography variant="h4" fontWeight={700}>{t('uploadTitle')}</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>{t('uploadSubtitle')}</Typography>
      </Box>

      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#1e1b4b', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <UploadIcon sx={{ color: '#a5b4fc' }} />
          <Typography variant="subtitle1" color="#fff" fontWeight={600}>{t('awardDetails')}</Typography>
        </Box>

        <CardContent sx={{ px: 3, py: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2.5}>
              {/* Title */}
              <TextField
                label={t('awardTitle')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                placeholder={t('awardTitlePlaceholder')}
                size="small"
              />

              {/* Category & Level */}
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <TextField
                  select
                  label={t('category')}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  size="small"
                  fullWidth
                >
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
                <TextField
                  select
                  label={t('competitionLevel')}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  size="small"
                  fullWidth
                >
                  {LEVELS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </TextField>
              </Box>

              {/* Description */}
              <TextField
                label={t('description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                fullWidth
                multiline
                rows={4}
                placeholder={t('descriptionPlaceholder')}
                size="small"
              />

              {/* File upload placeholder */}
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.secondary" mb={1}>
                  {t('supportingDocument')}
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    px: 3,
                    py: 4,
                    textAlign: 'center',
                    opacity: 0.6,
                    cursor: 'not-allowed',
                  }}
                >
                  <UploadIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">{t('fileUploadNote')}</Typography>
                  <Typography variant="caption" color="text.disabled">{t('fileUploadSoon')}</Typography>
                </Box>
              </Box>

              {/* Submitter info */}
              <Alert severity="info" variant="outlined">
                {t('submittingAs')} <strong>{currentUser.name}</strong> · {currentUser.school}
              </Alert>

              <Button type="submit" variant="contained" size="large" fullWidth>
                {t('submitForReview')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Alert severity="warning" sx={{ mt: 2 }}>
        {t('submissionNote')}
      </Alert>
    </Box>
  );
}
