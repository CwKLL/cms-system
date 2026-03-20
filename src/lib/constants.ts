import { CheckCircle as CheckIcon, AccessTime as ClockIcon, Cancel as XIcon } from '@mui/icons-material';

/** Shared colour map for award competition levels */
export const level_color: Record<string, string> = {
  International: '#7c3aed',
  National:      '#2563eb',
  Regional:      '#0891b2',
  District:      '#0d9488',
  School:        '#64748b',
};

/** Status chip configuration: icon component, MUI chip colour, and i18n key */
export const status_config = {
  approved: { labelKey: 'statusApproved', color: 'success' as const, Icon: CheckIcon },
  pending:  { labelKey: 'statusPending',  color: 'warning' as const, Icon: ClockIcon },
  rejected: { labelKey: 'statusRejected', color: 'error'   as const, Icon: XIcon },
};
