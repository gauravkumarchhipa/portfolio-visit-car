export type TechItem = { name: string; icon: string; color: string };

export type Project = {
    num: string;
    title: string;
    desc: string;
    details: string;
    features: string[];
    tags: string[];
    tech: TechItem[];
    color: string;
    accent: string;
    code: string;
    image: string;
    link: string;
    github: string;
    showGithub: boolean;
    role: string;
    duration: string;
};
export const PROJECTS: Project[] = [
    {
        num: '01', title: 'Zyapaar — B2B Business Platform',
        desc: 'Full-stack B2B marketplace like IndiaMART built with Next.js and Node.js.',
        details: 'A comprehensive B2B business platform enabling companies to list products, manage leads, and connect with buyers across India. Built with microservices architecture for scalability, featuring real-time inquiry management, advanced search with filters, business verification system, and SEO-optimized product catalogs.',
        features: ['Business listing & product catalog management', 'Lead generation & inquiry system', 'Advanced search with category filters', 'User authentication & business verification', 'SEO-optimized pages with SSR', 'Admin dashboard for analytics', 'Email & SMS notification system', 'Responsive design for all devices'],
        tags: ['Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Microservices', 'REST API'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'Node.js', icon: 'logos:nodejs-icon', color: '#68A063' }, { name: 'Express', icon: 'simple-icons:express', color: '#fff' }, { name: 'MongoDB', icon: 'logos:mongodb-icon', color: '#00ED64' }, { name: 'Redis', icon: 'logos:redis', color: '#DC382D' }, { name: 'Docker', icon: 'logos:docker-icon', color: '#2496ED' }],
        color: '#00E5FF', accent: '#003A4D', image: '/projects/zyapaar.png', code: `// B2B Microservices Architecture\nAPI Gateway (Express.js)\n├── Auth Service     :4001\n├── Listing Service  :4002\n├── Inquiry Service  :4003\n├── Search Service   :4004\n├── Notification     :4005\n└── MongoDB + Redis`,
        link: 'https://zyapaar.com/', github: '#', showGithub: false, role: 'Full-Stack Developer', duration: '6+ months',
    },
    {
        num: '02', title: "Let's Talk Business — B2B Platform",
        desc: 'Full-stack B2B marketplace with admin panel, Ionic & React Native mobile apps.',
        details: 'A complete B2B business platform with web application, admin panel, and cross-platform mobile apps. Mobile apps built in both Ionic and React Native deliver native-like B2B marketplace experiences on iOS and Android with push notifications, real-time chat, and offline support.',
        features: ['B2B marketplace with product listings & inquiries', 'Admin panel for user & content management', 'Ionic mobile app (iOS & Android)', 'React Native mobile app with native features', 'Push notifications & real-time chat', 'Order management & invoicing system', 'Analytics dashboard & reporting', 'Role-based access control'],
        tags: ['Next.js', 'React Native', 'Ionic', 'Node.js', 'MongoDB', 'Admin Panel'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'React Native', icon: 'logos:react', color: '#61DAFB' }, { name: 'Ionic', icon: 'logos:ionic-icon', color: '#3880FF' }, { name: 'Node.js', icon: 'logos:nodejs-icon', color: '#68A063' }, { name: 'MongoDB', icon: 'logos:mongodb-icon', color: '#00ED64' }, { name: 'Express', icon: 'simple-icons:express', color: '#fff' }],
        color: '#EC4899', accent: '#2A0015', image: '/projects/zyapaar2.png', code: `// React Native mobile app\n<NavigationContainer>\n  <Stack.Navigator>\n    <Stack.Screen name="Home"\n      component={Marketplace} />\n    <Stack.Screen name="Chat"\n      component={RealtimeChat} />\n  </Stack.Navigator>\n</NavigationContainer>`,
        link: '#', github: '#', showGithub: false, role: 'Full-Stack & Mobile Developer', duration: '8+ months',
    },
    {
        num: '03', title: 'QeDigital Gulf Website',
        desc: 'Cinematic marketing website for a UAE AI company with GSAP, Three.js & Framer Motion.',
        details: 'A high-performance cinematic marketing website for a UAE-based AI and digital transformation company. Built with Next.js, Three.js for 3D visuals, GSAP ScrollTrigger for scroll-driven animations, and Framer Motion for smooth page transitions. Features bilingual Arabic/English internationalization with RTL support.',
        features: ['Three.js 3D interactive visuals', 'GSAP ScrollTrigger cinematic animations', 'Framer Motion page transitions', 'Bilingual Arabic/English with RTL support', 'Horizontal scroll project carousel', 'Contact form with email integration', 'SEO optimized with Next.js SSG', 'Custom cursor interactions'],
        tags: ['Next.js', 'Three.js', 'GSAP', 'Framer Motion', 'TypeScript', 'Tailwind'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'Three.js', icon: 'logos:threejs', color: '#049EF4' }, { name: 'GSAP', icon: 'simple-icons:greensock', color: '#88CE02' }, { name: 'Framer', icon: 'logos:framer', color: '#E836EB' }, { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' }, { name: 'Tailwind', icon: 'logos:tailwindcss-icon', color: '#06B6D4' }],
        color: '#8B5CF6', accent: '#1A0040', image: '/projects/qedigital.png', code: `// 3D + GSAP scroll experience\n<Canvas>\n  <OrbitControls />\n  <Model />\n</Canvas>\n\ngsap.to(".hero", {\n  scrollTrigger: {\n    trigger: ".hero",\n    scrub: 1,\n  },\n  y: -200, opacity: 0,\n})`,
        link: 'https://qedigitalgulf.com/', github: '#', showGithub: false, role: 'Frontend Developer', duration: '3 months',
    },
    {
        num: '04', title: 'AIMS — Cybersecurity Questionnaire',
        desc: 'Cybersecurity assessment platform with questionnaire quiz, company management & bilingual i18n.',
        details: 'A comprehensive cybersecurity assessment platform for Atlantic Re, Morocco. Features a multi-step questionnaire system for evaluating company security posture, company details management, and bilingual French/English internationalization.',
        features: ['Cybersecurity questionnaire & quiz system', 'Company details & profile management', 'French/English bilingual i18n translation', 'React Hook Form with validation', 'Server-side & client-side API handling', 'Next.js 15 App Router with SSR', 'Secure authentication with sign-in flow', 'Responsive UI with Tailwind CSS'],
        tags: ['Next.js 15', 'Tailwind CSS', 'React Hook Form', 'i18n', 'TypeScript', 'REST API'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'Tailwind', icon: 'logos:tailwindcss-icon', color: '#06B6D4' }, { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' }, { name: 'i18next', icon: 'lucide:globe', color: '#26A69A' }, { name: 'React HF', icon: 'lucide:clipboard-list', color: '#EC5990' }, { name: 'REST API', icon: 'lucide:zap', color: '#FF6B35' }],
        color: '#00FFB3', accent: '#003322', image: '/projects/atlantic.png', code: `// Cybersecurity Assessment Flow\nconst { t } = useTranslation()\nconst { register, handleSubmit }\n  = useForm<QuestionnaireData>()\n\n<I18nProvider locale={locale}>\n  <QuestionnaireWizard />\n</I18nProvider>`,
        link: 'https://aims.atlanticre.ma/signin', github: '#', showGithub: false, role: 'Lead Frontend Developer', duration: '4 months',
    },
    {
        num: '05', title: 'GuestPostLinks — Digital Marketing',
        desc: 'Performance-based digital marketing agency platform with admin panel & content management.',
        details: 'A full-featured digital marketing platform for AMRYTT MEDIA — a performance-based agency specializing in Content Marketing, PPC, Display Advertising, Social Media Marketing, and SEO.',
        features: ['Guest post marketplace with listing management', 'Admin panel for content & campaign management', 'SEO-optimized blog & service pages', 'Lead capture & inquiry forms', 'Client account & order management', 'Dynamic pricing & package builder', 'Analytics dashboard for campaign tracking', 'Responsive design with fast page loads'],
        tags: ['Next.js', 'Node.js', 'Admin Panel', 'MongoDB', 'Tailwind CSS', 'REST API'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'Node.js', icon: 'logos:nodejs-icon', color: '#68A063' }, { name: 'MongoDB', icon: 'logos:mongodb-icon', color: '#00ED64' }, { name: 'Tailwind', icon: 'logos:tailwindcss-icon', color: '#06B6D4' }, { name: 'REST API', icon: 'lucide:zap', color: '#FF6B35' }, { name: 'Admin', icon: 'lucide:settings', color: '#F59E0B' }],
        color: '#FF6B35', accent: '#3A1000', image: '/projects/guestpostlink.png', code: `// Digital Marketing Platform\nexport async function generateStaticParams() {\n  const services = await getServices()\n  return services.map(s => ({\n    slug: s.slug\n  }))\n}\n\n<AdminLayout>\n  <CampaignMetrics />\n  <GuestPostManager />\n  <LeadTracker />\n</AdminLayout>`,
        link: 'https://guestpostlinks.net/', github: '#', showGithub: false, role: 'Full-Stack Developer', duration: '5 months',
    },
    {
        num: '06', title: 'Pannobaa — Tax & Business Advisory',
        desc: 'Static business website for a tax advisory firm built with Next.js & Tailwind CSS.',
        details: 'A clean, professional static website for Pannobaa Advisers — a firm offering accounting, taxation, and business advisory services. Features a streamlined 5-step work process section and core services showcase.',
        features: ['5-step work process flow visualization', 'Core services showcase with detailed pages', 'Consultation & contact forms', 'WhatsApp integration for quick connect', 'SEO-optimized static pages with SSG', 'Mobile-first responsive design', 'Fast loading with Next.js static export', 'Service categories: ITR, GST, Bookkeeping, Registration'],
        tags: ['Next.js', 'Tailwind CSS', 'Static Site', 'SSG', 'SEO', 'Responsive'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'Tailwind', icon: 'logos:tailwindcss-icon', color: '#06B6D4' }, { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' }, { name: 'SSG', icon: 'lucide:zap', color: '#00FFB3' }, { name: 'SEO', icon: 'lucide:search', color: '#F59E0B' }, { name: 'Vercel', icon: 'logos:vercel-icon', color: '#fff' }],
        color: '#F59E0B', accent: '#2A1500', image: '/projects/pannobaa.png', code: `// Static Site Generation\nexport async function generateStaticParams() {\n  return services.map(s => ({\n    slug: s.slug,\n  }))\n}\n\n<ServiceHero />\n<WorkProcess steps={5} />\n<CoreServices />\n<ConsultationForm />`,
        link: 'https://www.pannobaa.com/', github: '#', showGithub: false, role: 'Frontend Developer', duration: '2 months',
    },
    {
        num: '07', title: 'Car Rental — AI Analytics Platform',
        desc: 'AI-powered car rental platform with fleet insights, revenue analytics & demand forecasting.',
        details: 'A comprehensive car rental industry platform with AI intelligence for dynamic pricing and business analytics. Features fleet performance insights, revenue & cost analytics, market comparison, and predictive forecasting.',
        features: ['Fleet performance insights & utilization tracking', 'Revenue & cost analytics per car/branch', 'Market & competitor comparison dashboard', 'AI forecasting & business intelligence', 'Dynamic pricing with surge management', 'Mileage efficiency & downtime monitoring', 'Seasonal trend prediction & demand forecasting', 'Secure authentication & role-based access'],
        tags: ['Next.js', 'AI/ML', 'Analytics', 'TypeScript', 'Dashboard', 'REST API'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'AI/ML', icon: 'lucide:bot', color: '#8B5CF6' }, { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' }, { name: 'Charts', icon: 'lucide:bar-chart-3', color: '#AA344D' }, { name: 'Node.js', icon: 'logos:nodejs-icon', color: '#68A063' }, { name: 'REST API', icon: 'lucide:zap', color: '#FF6B35' }],
        color: '#8B5CF6', accent: '#1A0040', image: '/projects/carrental.png', code: `// Car Rental AI Analytics\n<FleetPerformance>\n  <Utilization />\n  <Downtime />\n  <MileageEfficiency />\n</FleetPerformance>\n\n<Forecasting>\n  <DemandPrediction />\n  <SeasonalTrends />\n  <RevenueGrowth />\n</Forecasting>`,
        link: 'http://120.72.91.106:9040/signin', github: '#', showGithub: false, role: 'Frontend Developer', duration: '4 months',
    },
    {
        num: '08', title: 'LeadFlow — Social Media Chat',
        desc: 'Unified social media inbox with WhatsApp, Facebook, LinkedIn, Instagram & chatbot.',
        details: 'A real-time social media communication platform that unifies WhatsApp, Facebook, LinkedIn, and Instagram conversations into a single inbox with AI-powered chatbot for automated responses.',
        features: ['Unified inbox for WhatsApp, Facebook, LinkedIn & Instagram', 'Real-time chat with Socket.IO', 'AI chatbot for automated responses', 'Lead capture & tracking from social channels', 'Conversation assignment to team members', 'Chat history & conversation search', 'Response time & engagement analytics', 'Multi-channel notification system'],
        tags: ['React.js', 'Socket.IO', 'WhatsApp API', 'Chatbot', 'Node.js', 'MongoDB'],
        tech: [{ name: 'React', icon: 'logos:react', color: '#61DAFB' }, { name: 'Socket.IO', icon: 'lucide:plug', color: '#010101' }, { name: 'Node.js', icon: 'logos:nodejs-icon', color: '#68A063' }, { name: 'MongoDB', icon: 'logos:mongodb-icon', color: '#00ED64' }, { name: 'Chatbot', icon: 'lucide:bot', color: '#8B5CF6' }, { name: 'REST API', icon: 'lucide:zap', color: '#FF6B35' }],
        color: '#00E5FF', accent: '#003A4D', image: '/projects/leadflow.png', code: `// Real-time Social Media Chat\nimport { io } from 'socket.io-client'\nconst socket = io(CHAT_SERVER)\n\nsocket.on('new_message', (msg) => {\n  dispatch(addMessage(msg))\n})\n\n<ChatInbox>\n  <WhatsAppChannel />\n  <FacebookMessenger />\n  <LinkedInChat />\n  <InstagramDM />\n</ChatInbox>`,
        link: 'https://leadflow-bay.vercel.app/login', github: '#', showGithub: false, role: 'Frontend Developer', duration: '3 months',
    },
    {
        num: '09', title: 'Hospital Learn — Medical Training',
        desc: 'Hospital learning platform with compliance tracking, user management & audit reports.',
        details: 'A comprehensive medical training and compliance platform for hospitals. Features a Super Admin dashboard with real-time stats, compliance heatmap, user management with role-based access, and audit reports.',
        features: ['Super Admin dashboard with KPI metrics', 'Compliance heatmap by department', 'User management with role-based access', 'Video upload & certification tracking', 'Content flagging & moderation system', 'Audit report generation & export', 'Platform settings & configuration', 'Department-wise analytics & reporting'],
        tags: ['Next.js', 'Dashboard', 'Analytics', 'TypeScript', 'Tailwind CSS', 'REST API'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' }, { name: 'Tailwind', icon: 'logos:tailwindcss-icon', color: '#06B6D4' }, { name: 'Charts', icon: 'lucide:bar-chart-3', color: '#AA344D' }, { name: 'Node.js', icon: 'logos:nodejs-icon', color: '#68A063' }, { name: 'REST API', icon: 'lucide:zap', color: '#FF6B35' }],
        color: '#00FFB3', accent: '#003322', image: '/projects/hospitallearn.png', code: `// Hospital Training Dashboard\n<SuperAdminDashboard>\n  <KPICards>\n    <TotalUsers count={2847} />\n    <VideosUploaded count={1234} />\n    <CertificationRate pct={87} />\n  </KPICards>\n\n  <ComplianceHeatmap />\n  <UserManagement roles={roles} />\n  <AuditReports exportable />\n</SuperAdminDashboard>`,
        link: 'https://hostpital-learn.vercel.app/', github: '#', showGithub: false, role: 'Frontend Developer', duration: '3 months',
    },
    {
        num: '10', title: 'Dubai Hospitality — AI Revenue',
        desc: 'AI-powered hotel revenue management dashboard with predictive & seasonal analytics.',
        details: 'An AI intelligence-driven hospitality management platform for Dubai hotels. Features comprehensive revenue analysis with daily, seasonal, and predictive analytics dashboards.',
        features: ['AI-powered revenue analysis & optimization', 'Seasonal analysis with peak/off-peak trends', 'Daily performance analytics & breakdowns', 'Predictive analysis with ML forecasting', 'Interactive chart dashboards', 'Occupancy rate & demand prediction', 'Competitor benchmarking & pricing insights', 'Real-time KPI tracking & reporting'],
        tags: ['Next.js', 'AI/ML', 'Tailwind CSS', 'Charts', 'TypeScript', 'Analytics'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'AI/ML', icon: 'lucide:bot', color: '#8B5CF6' }, { name: 'Tailwind', icon: 'logos:tailwindcss-icon', color: '#06B6D4' }, { name: 'Charts', icon: 'lucide:bar-chart-3', color: '#AA344D' }, { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' }, { name: 'REST API', icon: 'lucide:zap', color: '#FF6B35' }],
        color: '#F59E0B', accent: '#2A1500', image: '/projects/hospitality.png', code: `// AI Hospitality Revenue Dashboard\n<RevenueDashboard>\n  <DailyAnalysis date={today}>\n    <RevenueChart />\n    <OccupancyRate />\n  </DailyAnalysis>\n\n  <PredictiveAnalysis>\n    <DemandForecast days={90} />\n    <PricingOptimizer />\n  </PredictiveAnalysis>\n</RevenueDashboard>`,
        link: 'https://hospitality-demo.vercel.app/', github: '#', showGithub: false, role: 'Frontend Developer', duration: '3 months',
    },
    {
        num: '11', title: 'AI Voice Bot — Agentic Calls',
        desc: 'AI-powered voice bot dashboard with call analytics, bot configuration & booking integration.',
        details: 'An AI-Agentic voice bot platform that handles inbound and outbound calls autonomously. Features a dashboard with real-time KPIs, call volume charts, top intents analysis, and bot configuration.',
        features: ['AI voice bot with autonomous call handling', 'Real-time dashboard with call KPIs', 'Daily call volume & escalation charts', 'Top intents analysis (Booking, Availability, etc.)', 'Bot configuration & conversation flow builder', 'Booking integration with external systems', 'Escalation rules & routing engine', 'Customer profiles & call history'],
        tags: ['Next.js', 'AI/ML', 'Voice Bot', 'Dashboard', 'TypeScript', 'Tailwind CSS'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'AI/ML', icon: 'lucide:bot', color: '#8B5CF6' }, { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' }, { name: 'Tailwind', icon: 'logos:tailwindcss-icon', color: '#06B6D4' }, { name: 'Charts', icon: 'lucide:bar-chart-3', color: '#AA344D' }, { name: 'REST API', icon: 'lucide:zap', color: '#FF6B35' }],
        color: '#EC4899', accent: '#2A0015', image: '/projects/aivoicebot.png', code: `// AI Voice Bot Dashboard\n<BotDashboard>\n  <KPICards>\n    <TotalCalls count={127} />\n    <AvgCallTime time="3:06" />\n    <BotHandled pct={78} />\n  </KPICards>\n\n  <TopIntents data={[\n    'Room Booking',\n    'Check Availability',\n  ]} />\n  <BotConfiguration />\n  <BookingIntegration />\n</BotDashboard>`,
        link: 'https://aivoice-bot.vercel.app/dashboard', github: '#', showGithub: false, role: 'Frontend Developer', duration: '3 months',
    },
    {
        num: '12', title: 'ZeroZone CRA — AI Support Tickets',
        desc: 'WhatsApp & email AI support system with chatbot, instant replies & ticket management.',
        details: 'An AI-powered customer support platform for ZeroZone with WhatsApp and email integration. Features an intelligent chatbot that provides instant replies, automated ticket creation, and full support workflow.',
        features: ['WhatsApp AI chatbot with instant replies', 'Email support integration & auto-responses', 'Automated ticket creation from conversations', 'Ticket categorization & priority assignment', 'Support ticket lifecycle management', 'AI-driven reply suggestions', 'SLA tracking & escalation rules', 'Team assignment & workload distribution'],
        tags: ['Next.js', 'WhatsApp API', 'AI Chatbot', 'Tickets', 'Node.js', 'MongoDB'],
        tech: [{ name: 'Next.js', icon: 'logos:nextjs-icon', color: '#fff' }, { name: 'WhatsApp', icon: 'logos:whatsapp-icon', color: '#25D366' }, { name: 'AI/ML', icon: 'lucide:bot', color: '#8B5CF6' }, { name: 'Node.js', icon: 'logos:nodejs-icon', color: '#68A063' }, { name: 'MongoDB', icon: 'logos:mongodb-icon', color: '#00ED64' }, { name: 'REST API', icon: 'lucide:zap', color: '#FF6B35' }],
        color: '#25D366', accent: '#002A10', image: '/projects/zerozone.png', code: `// AI Support Ticket System\n<SupportDashboard>\n  <WhatsAppInbox>\n    <AIAutoReply intent={detected} />\n    <ConversationToTicket />\n  </WhatsAppInbox>\n\n  <TicketManager>\n    <PriorityQueue />\n    <TeamAssignment />\n    <SLATracker />\n  </TicketManager>\n</SupportDashboard>`,
        link: 'https://cra.zerozone.com/', github: '#', showGithub: false, role: 'Full-Stack Developer', duration: '4 months',
    },
];
