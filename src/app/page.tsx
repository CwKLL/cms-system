'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAwards } from '@/context/AwardContext';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { MOCK_USERS } from '@/lib/mockData';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Chip, Button, Alert,
  MenuItem, TextField, Pagination,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  MilitaryTech as MedalIcon,
  Visibility as EyeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface ExtendedEntry {
  rank: number;
  schoolRank: number;
  userId: string;
  name: string;
  school: string;
  totalScore: number;
  approvedAwards: number;
}

function rankBadge(rank: number) {
  if (rank === 1) return <span style={{ fontSize: 26 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 26 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 26 }}>🥉</span>;
  return (
    <Avatar sx={{ width: 30, height: 30, bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 13 }}>
      {rank}
    </Avatar>
  );
}

const PAGE_SIZE = 10;

export default function LeaderboardPage() {
  const { awards } = useAwards();
  const { currentUser } = useAuth();
  const { t } = useI18n();
  const [schoolFilter, setSchoolFilter] = useState('');
  const [page, setPage] = useState(1);

  const isAdmin = currentUser?.role === 'admin';

  const leaderboard: ExtendedEntry[] = useMemo(() => {
    const scoreMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};

    awards
      .filter((a) => a.status === 'approved')
      .forEach((a) => {
        scoreMap[a.userId] = (scoreMap[a.userId] ?? 0) + a.score;
        countMap[a.userId] = (countMap[a.userId] ?? 0) + 1;
      });

    // Only rank users who have at least 1 approved award
    const sorted: ExtendedEntry[] = MOCK_USERS
      .filter((u) => scoreMap[u.id] !== undefined)
      .map((u) => ({
        rank: 0,
        schoolRank: 0,
        userId: u.id,
        name: u.name,
        school: u.school,
        totalScore: scoreMap[u.id] ?? 0,
        approvedAwards: countMap[u.id] ?? 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore || a.name.localeCompare(b.name))
      .map((entry, i) => ({ ...entry, rank: i + 1 }));

    // Compute in-school rank: group by school (already globally sorted so order preserved)
    const schoolCounter: Record<string, number> = {};
    sorted.forEach((entry) => {
      schoolCounter[entry.school] = (schoolCounter[entry.school] ?? 0) + 1;
      entry.schoolRank = schoolCounter[entry.school];
    });

    return sorted;
  }, [awards]);

  const schoolsWithUsers = useMemo(() => {
    const schools = new Set(leaderboard.map((e) => e.school));
    return Array.from(schools).sort();
  }, [leaderboard]);

  const filtered = useMemo(() => {
    setPage(1);
    if (!schoolFilter) return leaderboard;
    return leaderboard.filter((e) => e.school === schoolFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaderboard, schoolFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const myEntry = currentUser ? leaderboard.find((e) => e.userId === currentUser.id) : null;
  const pendingCount = awards.filter((a) => a.status === 'pending').length;

  return (
    <Box>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={1.5}>
          <TrophyIcon sx={{ fontSize: 40, color: '#eab308' }} />
          <Typography variant="h3" fontWeight={800} color="text.primary">
            {t('achievementLeaderboard')}
          </Typography>
          <TrophyIcon sx={{ fontSize: 40, color: '#eab308' }} />
        </Box>
        <Typography variant="body1" color="text.secondary" fontSize="1.1rem">
          {t('leaderboardSubtitle')}{' '}
          <Typography component="span" fontWeight={600} color="primary">10 {t('schools')}</Typography>
        </Typography>
        {isAdmin && pendingCount > 0 && (
          <Alert severity="warning" sx={{ mt: 2, display: 'inline-flex', borderRadius: 3 }}>
            {t('pendingReview', { count: pendingCount })}
          </Alert>
        )}
      </Box>

      {/* Stats */}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3} mb={4}>
        {[
          { label: t('totalParticipants'), value: MOCK_USERS.length },
          { label: t('approvedAwards'), value: awards.filter((a) => a.status === 'approved').length },
          { label: t('schoolsLabel'), value: 10 },
        ].map((s) => (
          <Card key={s.label} variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" fontWeight={700} color="primary">{s.value}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>{s.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Your Rank card â€” only for logged-in users who have scored */}
      {myEntry && (
        <Card
          variant="outlined"
          sx={{ mb: 3, bgcolor: '#eef2ff', borderColor: '#818cf8', borderWidth: 2 }}
        >
          <CardContent sx={{ py: 2, px: 3 }}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <PersonIcon sx={{ color: '#4f46e5', fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight={700} color="primary">
                {t('yourRank')}
              </Typography>
              <Box display="flex" gap={4} ml={1} flexWrap="wrap">
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">{t('rankTotal')}</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary" lineHeight={1}>#{myEntry.rank}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">{t('rankInSchool')}</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary" lineHeight={1}>#{myEntry.schoolRank}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">{t('score')}</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary" lineHeight={1}>{myEntry.totalScore}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">{t('awards')}</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary" lineHeight={1}>{myEntry.approvedAwards}</Typography>
                </Box>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Button
                  component={Link}
                  href={`/profile/${currentUser?.id}`}
                  variant="contained"
                  size="small"
                  startIcon={<EyeIcon />}
                >
                  {t('viewMore')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Filter + table */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <TextField
          select
          size="small"
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
          label={t('filterBySchool')}
          sx={{ minWidth: 240 }}
        >
          <MenuItem value="">{t('allSchools')}</MenuItem>
          {schoolsWithUsers.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#1e1b4b', px: 3, py: 2 }}>
          <Typography variant="h6" color="#fff" fontWeight={600}>
            {t('overallRankings')}
            {schoolFilter && (
              <Typography component="span" variant="body2" color="#a5b4fc" ml={1}>
                {schoolFilter}
              </Typography>
            )}
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: '#64748b', width: 70 }}>
                  {t('rankTotal')}
                </TableCell>
                {schoolFilter && (
                  <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: '#64748b', width: 90 }}>
                    {t('rankInSchool')}
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: '#64748b' }}>
                  {t('name')}
                </TableCell>
                {!schoolFilter && (
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: '#64748b' }}>
                    {t('school')}
                  </TableCell>
                )}
                <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: '#64748b', width: 80 }}>
                  {t('awards')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: '#64748b', width: 80 }}>
                  {t('score')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: '#64748b', width: 120 }}>
                  {t('viewMore')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((entry) => {
                const isCurrentUser = currentUser?.id === entry.userId;
                return (
                  <TableRow
                    key={entry.userId}
                    hover
                    sx={{
                      ...(entry.rank <= 3 && !schoolFilter && {
                        background: 'linear-gradient(90deg, #fefce8 0%, #fff 100%)',
                      }),
                      ...(isCurrentUser && { bgcolor: '#eef2ff !important' }),
                    }}
                  >
                    <TableCell align="center" sx={{ width: 70 }}>
                      <Box display="flex" alignItems="center" justifyContent="center" sx={{ minHeight: 32 }}>
                        {rankBadge(entry.rank)}
                      </Box>
                    </TableCell>
                    {schoolFilter && (
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                          #{entry.schoolRank}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: isCurrentUser ? '#4f46e5' : '#e0e7ff', color: isCurrentUser ? '#fff' : '#4338ca', fontWeight: 700, fontSize: 11 }}>
                          {MOCK_USERS.find((u) => u.id === entry.userId)?.avatarInitials}
                        </Avatar>
                        <Typography variant="body2" fontWeight={isCurrentUser ? 700 : 500}>
                          {entry.name}
                          {isCurrentUser && (
                            <Typography component="span" variant="caption" color="primary" ml={0.5}>(you)</Typography>
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    {!schoolFilter && (
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" fontSize="0.8rem">{entry.school}</Typography>
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Chip
                        icon={<MedalIcon sx={{ fontSize: 13 }} />}
                        label={entry.approvedAwards}
                        size="small"
                        sx={{ bgcolor: '#e0e7ff', color: '#4338ca', height: 22, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight={700} color="primary">
                        {entry.totalScore}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        component={Link}
                        href={`/profile/${entry.userId}`}
                        variant="contained"
                        size="small"
                        startIcon={<EyeIcon sx={{ fontSize: 13 }} />}
                        sx={{ fontSize: '0.75rem', px: 2, minWidth: 100 }}
                      >
                        {t('view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" py={2} borderTop="1px solid" borderColor="divider">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
              shape="rounded"
              size="small"
            />
          </Box>
        )}
      </Card>

      <Typography variant="caption" display="block" textAlign="center" color="text.disabled" mt={3}>
        {t('scoreRules')}
      </Typography>
    </Box>
  );
}
