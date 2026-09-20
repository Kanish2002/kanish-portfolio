export type Link = {
	label: string;
	href: string;
};

export type Snapshot = {
	value: string;
	label: string;
};

export type Role = {
	title: string;
	period: string;
	location: string;
	points: string[];
};

export type Experience = {
	company: string;
	kind?: string;
	roles: Role[];
};

export type CaseStudy = {
	index: string;
	title: string;
	domain: string;
	summary: string;
	capabilities: string[];
	outcome?: string;
	professional?: boolean;
};

export type SkillGroup = {
	name: string;
	items: string[];
};

export type Achievement = {
	title: string;
	detail: string;
};

export const links = {
	email: 'mailto:kanish.sridhar.dev@gmail.com',
	github: 'https://github.com/Kanish2002',
	linkedin: 'https://www.linkedin.com/in/kanish-sridhar',
	leetcode: 'https://leetcode.com/u/kanish2208',
	resume: '/Kanish_S_Resume.pdf'
} as const;

export const navigation = [
	{ label: 'About', href: '#about' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'Engineering Work', href: '#work' },
	{ label: 'Expertise', href: '#expertise' },
	{ label: 'Achievements', href: '#achievements' },
	{ label: 'Education', href: '#education' },
	{ label: 'Contact', href: '#contact' }
] satisfies Link[];

export const snapshots: Snapshot[] = [
	{ value: '3+ years', label: 'Backend engineering experience' },
	{ value: '35–50%', label: 'API latency reduction' },
	{ value: '~600 ticks/sec', label: 'Market-data ingestion' },
	{ value: '9.48/10', label: 'B.Tech CGPA' },
	{ value: 'Trading + Banking', label: 'Financial-domain experience' },
	{ value: 'Java + Kafka', label: 'Backend specialization' }
];

export const about = [
	'I am a backend engineer specializing in distributed, event-driven financial systems. I started with real-time computer vision and backend development, then moved into production trading platforms, order-management systems, market-data pipelines, and digital-wallet services.',
	'At Zentropy Technologies, I progressed from Software Engineering Intern to Member Technical and then Senior Member Technical. I worked across trading microservices, paper-trading infrastructure, order lifecycles, algorithmic workflows, performance optimization, system design, mentoring, and code reviews.',
	'I later worked at Barq Technology Lab on core-banking and digital-wallet workflows spanning payment, wallet, accounting, and settlement services.'
];

export const experience: Experience[] = [
	{
		company: 'Barq Technology Lab',
		roles: [
			{
				title: 'Software Development Engineer – I',
				period: 'April 2026 – July 2026',
				location: 'Bengaluru, India',
				points: [
					'Developed scalable digital-wallet microservices using Java, Spring Boot, and Kafka.',
					'Contributed to Cash-In, Cash-Out, Refund, Rollback, and peer-to-peer transaction workflows.',
					'Worked across Payments, Wallet, Accounting, and Settlement services with a focus on transactional consistency and reliability.',
					'Built backend APIs and integrated Retool applications for Finance and Operations workflows, including accounting, refunds, rollbacks, and transaction monitoring.'
				]
			}
		]
	},
	{
		company: 'Zentropy Technologies',
		roles: [
			{
				title: 'Senior Member Technical',
				period: 'April 2025 – February 2026',
				location: 'Chennai, India',
				points: [
					'Built a low-latency, highly available trading Order Management System for NSE and BSE, covering end-to-end order lifecycle and algorithmic workflows.',
					'Applied concurrency control and Neo4j-based graph workflow storage, and contributed to high-level and low-level system design.',
					'Implemented and enhanced proprietary order types with production safety and compliance in mind.',
					'Led code reviews for performance-sensitive microservices and mentored junior engineers and interns.',
					'Reduced API latency by approximately 35–50% using Redis caching and response compression.'
				]
			},
			{
				title: 'Member Technical',
				period: 'May 2023 – March 2025',
				location: 'Chennai, India',
				points: [
					'Designed and developed a paper-trading broker platform using Java, Kotlin, and Spring Boot.',
					'Built microservices and APIs for trading, order simulation, and market-data processing.',
					'Worked with AWS and DigitalOcean infrastructure across storage, compute, and serverless components.',
					'Automated tick-level market-data ingestion at approximately 600 ticks per second, with retry and backpressure handling.'
				]
			},
			{
				title: 'Software Engineering Intern',
				period: 'November 2022 – April 2023',
				location: 'Chennai, India',
				points: [
					'Supported backend development for trading-related services using Spring Boot and REST APIs.',
					'Assisted with microservice components and internal tooling.',
					'Built production experience in debugging, Linux, Git, testing, and deployments.'
				]
			}
		]
	},
	{
		company: 'Sona College of Technology',
		kind: 'Part-time academic research',
		roles: [
			{
				title: 'Research Intern',
				period: 'December 2020 – April 2023',
				location: 'Salem, India',
				points: [
					'Developed an Augmented Reality Sandbox using Azure Kinect DK and Python.',
					'Implemented real-time depth sensing, motion tracking, terrain visualization, and sensor-data processing with pyKinectAzure and computer-vision libraries.',
					'Conducted experimentation in real-time computer vision and depth processing.'
				]
			}
		]
	},
	{
		company: 'Vee Technologies',
		kind: 'Additional experience',
		roles: [
			{
				title: 'Software Engineering Intern',
				period: 'March 2021 – June 2021',
				location: 'Salem, India',
				points: [
					'Contributed to a web-based code editor and simulator supporting HTML, CSS, JavaScript, and React applications.',
					'Worked on frontend development, debugging, feature improvements, usability, and platform stability.'
				]
			}
		]
	}
];

export const caseStudies: CaseStudy[] = [
	{
		index: '01',
		title: 'Trading Order Management System',
		domain: 'Capital markets & algorithmic trading',
		summary: 'A low-latency, highly available OMS for NSE and BSE, built around safe order-state transitions and distributed execution workflows.',
		capabilities: ['Distributed microservices', 'Order lifecycle', 'Algorithmic workflows', 'Proprietary order types', 'Concurrency control', 'Kafka', 'Redis', 'PostgreSQL', 'Neo4j', 'HLD + LLD', 'Code reviews', 'Mentoring'],
		outcome: 'Reduced API latency by approximately 35–50% using Redis caching and response compression.',
		professional: true
	},
	{
		index: '02',
		title: 'Paper Trading Broker Platform',
		domain: 'Trading simulation',
		summary: 'Backend services for simulated order execution, trading APIs, and market-data processing across cloud infrastructure.',
		capabilities: ['Java', 'Kotlin', 'Spring Boot', 'Microservices', 'Order simulation', 'Trading APIs', 'Market data', 'AWS', 'DigitalOcean', 'Storage + compute', 'Serverless'],
		professional: true
	},
	{
		index: '03',
		title: 'Real-Time Market Data Pipeline',
		domain: 'Event-driven data processing',
		summary: 'A fault-aware ingestion path for tick-level market data with explicit pressure and recovery behavior.',
		capabilities: ['~600 ticks/sec', 'Kafka', 'Event-driven processing', 'Retry strategies', 'Backpressure', 'Fault tolerance', 'Reliability'],
		outcome: 'Automated tick-level market-data ingestion handling approximately 600 ticks per second.',
		professional: true
	},
	{
		index: '04',
		title: 'Core Banking & Digital Wallet Platform',
		domain: 'Banking, payments & settlement',
		summary: 'Transaction workflows spanning money movement, ledger effects, operational controls, and settlement responsibilities.',
		capabilities: ['Cash-In', 'Cash-Out', 'Refunds', 'Rollbacks', 'P2P transactions', 'Payments', 'Wallet', 'Accounting', 'Settlement', 'Transactional consistency', 'Retool integrations'],
		professional: true
	},
	{
		index: '05',
		title: 'Augmented Reality Sandbox',
		domain: 'Academic research & computer vision',
		summary: 'An interactive terrain-visualization system that transformed live depth and motion input into responsive projected visuals.',
		capabilities: ['Azure Kinect DK', 'Python', 'pyKinectAzure', 'Computer vision', 'Depth tracking', 'Motion tracking', 'Terrain visualization', 'Sensor processing']
	}
];

export const skillGroups: SkillGroup[] = [
	{ name: 'Languages', items: ['Java', 'Kotlin', 'Python', 'C', 'C++'] },
	{ name: 'Backend & APIs', items: ['Spring Boot', 'Spring Web', 'Spring WebFlux', 'Spring Security', 'Spring Data JPA', 'Spring Data Redis', 'Spring AI', 'REST APIs', 'gRPC', 'Microservices'] },
	{ name: 'Distributed systems & messaging', items: ['Apache Kafka', 'Kafka Streams', 'RabbitMQ', 'Event-driven architecture', 'Low-latency systems', 'High-availability systems'] },
	{ name: 'Databases & caching', items: ['PostgreSQL', 'Redis', 'Neo4j', 'RocksDB', 'pgvector'] },
	{ name: 'Cloud & infrastructure', items: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'AWS EBS', 'AWS ECR', 'DigitalOcean', 'Docker', 'Kubernetes'] },
	{ name: 'Build & tooling', items: ['Gradle', 'Maven', 'Protobuf', 'Flyway', 'Git', 'Linux'] },
	{ name: 'Data processing', items: ['Pandas', 'Dask', 'Kotlin DataFrame', 'Apache Arrow'] },
	{ name: 'Testing', items: ['JUnit', 'Mockito', 'MockK'] },
	{ name: 'AI & LLM engineering', items: ['Retrieval-Augmented Generation', 'LLM integrations', 'Prompt engineering', 'Spring AI', 'Vector databases', 'ChatGPT Codex', 'Claude Code'] },
	{ name: 'Reliability & security', items: ['Vulnerability assessment', 'Dependency risk analysis', 'Secure system design', 'Retry and backpressure handling', 'Transactional consistency', 'Performance optimization'] }
];

export const approach = [
	'Understand the business and transaction workflow',
	'Define service boundaries and data ownership',
	'Choose synchronous and asynchronous communication',
	'Design for consistency, concurrency, retries, and failure',
	'Measure latency, throughput, and production behavior',
	'Test, deploy, observe, and improve'
];

export const achievements: Achievement[] = [
	{ title: 'Dr. APJ Abdul Kalam Award', detail: 'Best Engineering College Student' },
	{ title: 'IEI Best Student Award', detail: 'Recognized for student achievement' },
	{ title: 'ISTE Best Student Award', detail: 'Recognized for student achievement' },
	{ title: 'Best Outgoing Student', detail: 'Department recognition' },
	{ title: 'Chairman', detail: 'Sona Programming Club' },
	{ title: 'Technical leadership', detail: 'Led technical initiatives, mentored peers, and contributed to funded academic projects' }
];

export const publicActivity = [
	{
		label: 'Spring Data Neo4j',
		detail: 'Graph modeling and persistence questions',
		href: 'https://github.com/spring-projects/spring-data-neo4j/issues/2739'
	},
	{
		label: 'Kotlin DataFrame',
		detail: 'Time-series resampling and rolling calculations',
		href: 'https://github.com/Kotlin/dataframe/issues/335'
	},
	{
		label: 'Azure Kinect Sensor SDK',
		detail: 'Depth-sensor workflows for AR sandbox research',
		href: 'https://github.com/microsoft/Azure-Kinect-Sensor-SDK/issues/1885'
	}
];

export const seo = {
	title: 'Kanish S | Java Backend Engineer',
	description: 'Java Backend Engineer with 3+ years of experience building low-latency trading, banking, payment, and distributed systems using Java, Kotlin, Spring Boot, Kafka, Redis, PostgreSQL, Docker, Kubernetes, and AWS.'
} as const;
