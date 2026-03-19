import { User, Award } from '@/types';

export const SCHOOLS = [
  'Greenwood High School',
  'Riverside Academy',
  'Sunset College',
  'Mountain View Institute',
  'Harbor International School',
  'Lakeside Secondary School',
  'Eastgate Academy',
  'Northbridge High',
  'Westfield College',
  'Pinecrest School',
];

export const CATEGORIES = [
  'Academic',
  'Sports',
  'Arts & Culture',
  'Science & Technology',
  'Community Service',
  'Leadership',
];

export const LEVELS = ['International', 'National', 'Regional', 'District', 'School'];

// Score points per level
export const LEVEL_SCORES: Record<string, number> = {
  International: 100,
  National: 70,
  Regional: 40,
  District: 20,
  School: 10,
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Zhang',
    email: 'admin@cms.edu',
    password: 'admin123',
    role: 'admin',
    school: 'Greenwood High School',
    avatarInitials: 'AZ',
  },
  {
    id: 'u2',
    name: 'Alice Chen',
    email: 'alice@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Riverside Academy',
    avatarInitials: 'AC',
  },
  {
    id: 'u3',
    name: 'Bob Smith',
    email: 'bob@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Greenwood High School',
    avatarInitials: 'BS',
  },
  {
    id: 'u4',
    name: 'Carmen Lee',
    email: 'carmen@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Sunset College',
    avatarInitials: 'CL',
  },
  {
    id: 'u5',
    name: 'David Tan',
    email: 'david@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Mountain View Institute',
    avatarInitials: 'DT',
  },
  {
    id: 'u6',
    name: 'Emma Wong',
    email: 'emma@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Harbor International School',
    avatarInitials: 'EW',
  },
  {
    id: 'u7',
    name: 'Frank Liu',
    email: 'frank@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Riverside Academy',
    avatarInitials: 'FL',
  },
  {
    id: 'u8',
    name: 'Grace Kim',
    email: 'grace@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Lakeside Secondary School',
    avatarInitials: 'GK',
  },
  {
    id: 'u9',
    name: 'Henry Ng',
    email: 'henry@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Eastgate Academy',
    avatarInitials: 'HN',
  },
  {
    id: 'u10',
    name: 'Irene Lim',
    email: 'irene@cms.edu',
    password: 'user123',
    role: 'user',
    school: 'Northbridge High',
    avatarInitials: 'IL',
  },
  // --- 15 additional users ---
  {
    id: 'u11', name: 'Jack Chen', email: 'jack@cms.edu', password: 'user123',
    role: 'user', school: 'Westfield College', avatarInitials: 'JC',
  },
  {
    id: 'u12', name: 'Kate Wang', email: 'kate@cms.edu', password: 'user123',
    role: 'user', school: 'Pinecrest School', avatarInitials: 'KW',
  },
  {
    id: 'u13', name: 'Leo Park', email: 'leo@cms.edu', password: 'user123',
    role: 'user', school: 'Greenwood High School', avatarInitials: 'LP',
  },
  {
    id: 'u14', name: 'Mia Johnson', email: 'mia@cms.edu', password: 'user123',
    role: 'user', school: 'Riverside Academy', avatarInitials: 'MJ',
  },
  {
    id: 'u15', name: 'Nick Brown', email: 'nick@cms.edu', password: 'user123',
    role: 'user', school: 'Sunset College', avatarInitials: 'NB',
  },
  {
    id: 'u16', name: 'Olivia Lee', email: 'olivia@cms.edu', password: 'user123',
    role: 'user', school: 'Mountain View Institute', avatarInitials: 'OL',
  },
  {
    id: 'u17', name: 'Peter Zhang', email: 'peter@cms.edu', password: 'user123',
    role: 'user', school: 'Harbor International School', avatarInitials: 'PZ',
  },
  {
    id: 'u18', name: 'Quinn Taylor', email: 'quinn@cms.edu', password: 'user123',
    role: 'user', school: 'Lakeside Secondary School', avatarInitials: 'QT',
  },
  {
    id: 'u19', name: 'Rachel Ng', email: 'rachel@cms.edu', password: 'user123',
    role: 'user', school: 'Eastgate Academy', avatarInitials: 'RN',
  },
  {
    id: 'u20', name: 'Sam Wilson', email: 'sam@cms.edu', password: 'user123',
    role: 'user', school: 'Northbridge High', avatarInitials: 'SW',
  },
  {
    id: 'u21', name: 'Tina Kim', email: 'tina@cms.edu', password: 'user123',
    role: 'user', school: 'Westfield College', avatarInitials: 'TK',
  },
  {
    id: 'u22', name: 'Uma Patel', email: 'uma@cms.edu', password: 'user123',
    role: 'user', school: 'Pinecrest School', avatarInitials: 'UP',
  },
  {
    id: 'u23', name: 'Victor Liu', email: 'victor@cms.edu', password: 'user123',
    role: 'user', school: 'Greenwood High School', avatarInitials: 'VL',
  },
  {
    id: 'u24', name: 'Wendy Ho', email: 'wendy@cms.edu', password: 'user123',
    role: 'user', school: 'Riverside Academy', avatarInitials: 'WH',
  },
  {
    id: 'u25', name: 'Xavier Lim', email: 'xavier@cms.edu', password: 'user123',
    role: 'user', school: 'Sunset College', avatarInitials: 'XL',
  },
];

export const MOCK_AWARDS: Award[] = [
  // Alice Chen (u2) — Riverside Academy
  {
    id: 'a1', userId: 'u2', userName: 'Alice Chen', school: 'Riverside Academy',
    title: 'International Math Olympiad – Silver Medal',
    description: 'Achieved Silver Medal at the IMO 2025, competing against 600 students worldwide.',
    category: 'Academic', level: 'International', status: 'approved', score: 100,
    submittedAt: '2025-10-01', approvedAt: '2025-10-03', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a2', userId: 'u2', userName: 'Alice Chen', school: 'Riverside Academy',
    title: 'National Science Fair – 1st Place',
    description: 'First place in biology category at the National Science Fair.',
    category: 'Science & Technology', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-08-15', approvedAt: '2025-08-18', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a3', userId: 'u2', userName: 'Alice Chen', school: 'Riverside Academy',
    title: 'Regional Debate Championship – Champion',
    description: 'Won the Regional Debate Championship representing Riverside Academy.',
    category: 'Leadership', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-06-10', approvedAt: '2025-06-12', approvedBy: 'Admin Zhang',
  },
  // Bob Smith (u3) — Greenwood High
  {
    id: 'a4', userId: 'u3', userName: 'Bob Smith', school: 'Greenwood High School',
    title: 'National Swimming Championship – Bronze',
    description: 'Bronze medal, 100m freestyle, National Championship 2025.',
    category: 'Sports', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-09-05', approvedAt: '2025-09-08', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a5', userId: 'u3', userName: 'Bob Smith', school: 'Greenwood High School',
    title: 'Regional Art Exhibition – Best in Show',
    description: 'Digital painting selected as Best in Show at the Regional Art Exhibition.',
    category: 'Arts & Culture', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-07-22', approvedAt: '2025-07-25', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a6', userId: 'u3', userName: 'Bob Smith', school: 'Greenwood High School',
    title: 'District Coding Hackathon – 2nd Place',
    description: '2nd place in the 24-hour District Coding Hackathon.',
    category: 'Science & Technology', level: 'District', status: 'pending', score: 0,
    submittedAt: '2026-01-14',
  },
  // Carmen Lee (u4) — Sunset College
  {
    id: 'a7', userId: 'u4', userName: 'Carmen Lee', school: 'Sunset College',
    title: 'National Piano Competition – 1st Place',
    description: 'First place at the National Piano Competition, Classical category.',
    category: 'Arts & Culture', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-11-01', approvedAt: '2025-11-03', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a8', userId: 'u4', userName: 'Carmen Lee', school: 'Sunset College',
    title: 'Regional Volunteer Award',
    description: 'Recognised for outstanding community service, 200+ volunteer hours.',
    category: 'Community Service', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-09-20', approvedAt: '2025-09-22', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a9', userId: 'u4', userName: 'Carmen Lee', school: 'Sunset College',
    title: 'International Youth Leadership Summit – Speaker',
    description: 'Invited speaker at the International Youth Leadership Summit, Singapore.',
    category: 'Leadership', level: 'International', status: 'pending', score: 0,
    submittedAt: '2026-02-01',
  },
  // David Tan (u5) — Mountain View Institute
  {
    id: 'a10', userId: 'u5', userName: 'David Tan', school: 'Mountain View Institute',
    title: 'National Robotics Competition – Champion',
    description: 'Led team to championship at the National Robotics Competition 2025.',
    category: 'Science & Technology', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-10-12', approvedAt: '2025-10-15', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a11', userId: 'u5', userName: 'David Tan', school: 'Mountain View Institute',
    title: 'District Sports Day – 3 Gold Medals',
    description: 'Won 3 gold medals (100m, 200m, long jump) at District Sports Day.',
    category: 'Sports', level: 'District', status: 'approved', score: 20,
    submittedAt: '2025-05-18', approvedAt: '2025-05-20', approvedBy: 'Admin Zhang',
  },
  // Emma Wong (u6) — Harbor International
  {
    id: 'a12', userId: 'u6', userName: 'Emma Wong', school: 'Harbor International School',
    title: 'International Science Olympiad – Bronze',
    description: 'Bronze medal at the International Science Olympiad, Chemistry.',
    category: 'Academic', level: 'International', status: 'approved', score: 100,
    submittedAt: '2025-08-30', approvedAt: '2025-09-02', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a13', userId: 'u6', userName: 'Emma Wong', school: 'Harbor International School',
    title: 'School Innovation Award',
    description: 'Developed a water purification prototype, won the School Innovation Award.',
    category: 'Science & Technology', level: 'School', status: 'rejected', score: 0,
    submittedAt: '2025-12-01',
  },
  // Frank Liu (u7) — Riverside Academy
  {
    id: 'a14', userId: 'u7', userName: 'Frank Liu', school: 'Riverside Academy',
    title: 'National Basketball Championship – MVP',
    description: 'Named Most Valuable Player at the National Basketball Championship.',
    category: 'Sports', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-11-20', approvedAt: '2025-11-22', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a15', userId: 'u7', userName: 'Frank Liu', school: 'Riverside Academy',
    title: 'Regional Photography Contest – 1st Place',
    description: 'First place in the Regional Photography Contest, Nature category.',
    category: 'Arts & Culture', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-07-05', approvedAt: '2025-07-07', approvedBy: 'Admin Zhang',
  },
  // Grace Kim (u8) — Lakeside Secondary
  {
    id: 'a16', userId: 'u8', userName: 'Grace Kim', school: 'Lakeside Secondary School',
    title: 'District Essay Competition – Champion',
    description: 'Won the District Essay Competition on the topic of Climate Change.',
    category: 'Academic', level: 'District', status: 'approved', score: 20,
    submittedAt: '2025-09-15', approvedAt: '2025-09-17', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a17', userId: 'u8', userName: 'Grace Kim', school: 'Lakeside Secondary School',
    title: 'National Dance Festival – Best Performance',
    description: 'Awarded Best Performance at the National Dance Festival 2025.',
    category: 'Arts & Culture', level: 'National', status: 'pending', score: 0,
    submittedAt: '2026-01-28',
  },
  // Henry Ng (u9) — Eastgate Academy
  {
    id: 'a18', userId: 'u9', userName: 'Henry Ng', school: 'Eastgate Academy',
    title: 'Regional Badminton Tournament – Runner-up',
    description: 'Runner-up in the Regional Badminton Tournament, Singles.',
    category: 'Sports', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-10-28', approvedAt: '2025-10-30', approvedBy: 'Admin Zhang',
  },
  // Irene Lim (u10) — Northbridge High
  {
    id: 'a19', userId: 'u10', userName: 'Irene Lim', school: 'Northbridge High',
    title: 'School Science Fair – 1st Place',
    description: 'First place at Northbridge High Annual Science Fair.',
    category: 'Science & Technology', level: 'School', status: 'approved', score: 10,
    submittedAt: '2025-12-10', approvedAt: '2025-12-12', approvedBy: 'Admin Zhang',
  },
  // Admin Zhang (u1)
  {
    id: 'a20', userId: 'u1', userName: 'Admin Zhang', school: 'Greenwood High School',
    title: 'National Teacher Leadership Award',
    description: 'Recognised for outstanding leadership in education at the national level.',
    category: 'Leadership', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-12-20', approvedAt: '2025-12-22', approvedBy: 'Admin Zhang',
  },
  // --- Awards for new users (u11–u25) ---
  // Jack Chen (u11) — Westfield College
  {
    id: 'a21', userId: 'u11', userName: 'Jack Chen', school: 'Westfield College',
    title: 'National Science Competition – 3rd Place',
    description: 'Third place in physics category at the National Science Competition.',
    category: 'Science & Technology', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-11-10', approvedAt: '2025-11-12', approvedBy: 'Admin Zhang',
  },
  // Kate Wang (u12) — Pinecrest School
  {
    id: 'a22', userId: 'u12', userName: 'Kate Wang', school: 'Pinecrest School',
    title: 'International Music Festival – Gold Award',
    description: 'Gold Award in piano performance at the International Music Festival, Vienna.',
    category: 'Arts & Culture', level: 'International', status: 'approved', score: 100,
    submittedAt: '2025-07-18', approvedAt: '2025-07-20', approvedBy: 'Admin Zhang',
  },
  // Leo Park (u13) — Greenwood High School
  {
    id: 'a23', userId: 'u13', userName: 'Leo Park', school: 'Greenwood High School',
    title: 'District Athletics Champion – Sprint',
    description: 'Champion in 100m and 200m sprint at the District Athletics Championship.',
    category: 'Sports', level: 'District', status: 'approved', score: 20,
    submittedAt: '2025-05-30', approvedAt: '2025-06-01', approvedBy: 'Admin Zhang',
  },
  // Mia Johnson (u14) — Riverside Academy
  {
    id: 'a24', userId: 'u14', userName: 'Mia Johnson', school: 'Riverside Academy',
    title: 'National Essay Competition – 1st Place',
    description: 'First place at the National Essay Competition on sustainability and innovation.',
    category: 'Academic', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-09-25', approvedAt: '2025-09-27', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a25', userId: 'u14', userName: 'Mia Johnson', school: 'Riverside Academy',
    title: 'National Debate Competition – Champion',
    description: 'Led her team to the championship at the National Debate Competition.',
    category: 'Leadership', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-11-05', approvedAt: '2025-11-07', approvedBy: 'Admin Zhang',
  },
  // Nick Brown (u15) — Sunset College
  {
    id: 'a26', userId: 'u15', userName: 'Nick Brown', school: 'Sunset College',
    title: 'Regional Math Olympiad – 2nd Place',
    description: 'Runner-up at the Regional Math Olympiad, Algebra category.',
    category: 'Academic', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-08-01', approvedAt: '2025-08-03', approvedBy: 'Admin Zhang',
  },
  // Olivia Lee (u16) — Mountain View Institute
  {
    id: 'a27', userId: 'u16', userName: 'Olivia Lee', school: 'Mountain View Institute',
    title: 'National Chemistry Olympiad – Top 10',
    description: 'Ranked 8th nationally at the National Chemistry Olympiad 2025.',
    category: 'Science & Technology', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-10-22', approvedAt: '2025-10-24', approvedBy: 'Admin Zhang',
  },
  // Peter Zhang (u17) — Harbor International School
  {
    id: 'a28', userId: 'u17', userName: 'Peter Zhang', school: 'Harbor International School',
    title: 'International Coding Competition – Silver Medal',
    description: 'Silver medal at the International Competitive Programming Championship.',
    category: 'Science & Technology', level: 'International', status: 'approved', score: 100,
    submittedAt: '2025-08-20', approvedAt: '2025-08-22', approvedBy: 'Admin Zhang',
  },
  // Quinn Taylor (u18) — Lakeside Secondary School
  {
    id: 'a29', userId: 'u18', userName: 'Quinn Taylor', school: 'Lakeside Secondary School',
    title: 'Regional Art Competition – 1st Place',
    description: 'First place in the sculpture category at the Regional Art Competition.',
    category: 'Arts & Culture', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-06-15', approvedAt: '2025-06-17', approvedBy: 'Admin Zhang',
  },
  // Rachel Ng (u19) — Eastgate Academy
  {
    id: 'a30', userId: 'u19', userName: 'Rachel Ng', school: 'Eastgate Academy',
    title: 'National Girls\' Basketball Tournament – MVP',
    description: 'Named Most Valuable Player at the National Girls\' Basketball Tournament.',
    category: 'Sports', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-11-28', approvedAt: '2025-11-30', approvedBy: 'Admin Zhang',
  },
  // Sam Wilson (u20) — Northbridge High
  {
    id: 'a31', userId: 'u20', userName: 'Sam Wilson', school: 'Northbridge High',
    title: 'School Innovation Fair – 1st Place',
    description: 'First place for designing an IoT-based campus energy saving system.',
    category: 'Science & Technology', level: 'School', status: 'approved', score: 10,
    submittedAt: '2025-12-05', approvedAt: '2025-12-07', approvedBy: 'Admin Zhang',
  },
  // Tina Kim (u21) — Westfield College
  {
    id: 'a32', userId: 'u21', userName: 'Tina Kim', school: 'Westfield College',
    title: 'National Film Festival – Best Short Film',
    description: 'Awarded Best Short Film at the National Youth Film Festival 2025.',
    category: 'Arts & Culture', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-10-08', approvedAt: '2025-10-10', approvedBy: 'Admin Zhang',
  },
  // Uma Patel (u22) — Pinecrest School
  {
    id: 'a33', userId: 'u22', userName: 'Uma Patel', school: 'Pinecrest School',
    title: 'Regional Debate Championship – Runner-up',
    description: 'Runner-up at the Regional Debate Championship, Policy category.',
    category: 'Leadership', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-09-12', approvedAt: '2025-09-14', approvedBy: 'Admin Zhang',
  },
  // Victor Liu (u23) — Greenwood High School
  {
    id: 'a34', userId: 'u23', userName: 'Victor Liu', school: 'Greenwood High School',
    title: 'National Chess Championship – 2nd Place',
    description: 'Runner-up at the National Chess Championship, Open category.',
    category: 'Academic', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-11-15', approvedAt: '2025-11-17', approvedBy: 'Admin Zhang',
  },
  // Wendy Ho (u24) — Riverside Academy
  {
    id: 'a35', userId: 'u24', userName: 'Wendy Ho', school: 'Riverside Academy',
    title: 'International Science Olympiad – Gold Medal',
    description: 'Gold medal in the Biology section of the International Science Olympiad.',
    category: 'Academic', level: 'International', status: 'approved', score: 100,
    submittedAt: '2025-08-10', approvedAt: '2025-08-12', approvedBy: 'Admin Zhang',
  },
  {
    id: 'a36', userId: 'u24', userName: 'Wendy Ho', school: 'Riverside Academy',
    title: 'National Physics Competition – 1st Place',
    description: 'First place at the National Physics Competition, Mechanics category.',
    category: 'Science & Technology', level: 'National', status: 'approved', score: 70,
    submittedAt: '2025-10-30', approvedAt: '2025-11-01', approvedBy: 'Admin Zhang',
  },
  // Xavier Lim (u25) — Sunset College
  {
    id: 'a37', userId: 'u25', userName: 'Xavier Lim', school: 'Sunset College',
    title: 'Regional Swimming Meet – 1st Place',
    description: 'First place in backstroke and butterfly events at the Regional Swimming Meet.',
    category: 'Sports', level: 'Regional', status: 'approved', score: 40,
    submittedAt: '2025-07-30', approvedAt: '2025-08-01', approvedBy: 'Admin Zhang',
  },
];
