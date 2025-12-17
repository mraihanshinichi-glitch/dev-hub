export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  notes: TemplateNote[]
  features: TemplateFeature[]
  releases?: TemplateRelease[]
}

export interface TemplateNote {
  title: string
  category: string
  content: any // TipTap JSON content
}

export interface TemplateFeature {
  title: string
  description: string
  category: string
  status: 'planned' | 'in-progress' | 'done'
}

export interface TemplateRelease {
  version: string
  notes: string
  category: string
  status: 'planned' | 'upcoming' | 'released'
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Template untuk membuat aplikasi web modern dengan React/Next.js',
    category: 'Web Development',
    icon: '🌐',
    notes: [
      {
        title: 'Panduan Setup Project',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Setup Project Web Application' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Panduan lengkap untuk memulai development web application:' }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: '1. Setup Environment' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Install Node.js (versi 18+)' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Setup package manager (npm/yarn/pnpm)' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Install code editor (VS Code recommended)' }]
                    }
                  ]
                }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: '2. Initialize Project' }]
            },
            {
              type: 'codeBlock',
              attrs: { language: 'bash' },
              content: [
                {
                  type: 'text',
                  text: 'npx create-next-app@latest my-web-app\ncd my-web-app\nnpm run dev'
                }
              ]
            }
          ]
        }
      },
      {
        title: 'Tech Stack Recommendations',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Tech Stack untuk Web Application' }]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Frontend' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Next.js 14+' },
                        { type: 'text', text: ' - React framework dengan App Router' }
                      ]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'TypeScript' },
                        { type: 'text', text: ' - Type safety dan better DX' }
                      ]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Tailwind CSS' },
                        { type: 'text', text: ' - Utility-first CSS framework' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Backend & Database' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Supabase' },
                        { type: 'text', text: ' - PostgreSQL database dengan auth' }
                      ]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Prisma' },
                        { type: 'text', text: ' - ORM untuk database management' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        title: 'Development Workflow',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Development Workflow' }]
            },
            {
              type: 'orderedList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Planning' },
                        { type: 'text', text: ' - Buat wireframe dan user stories' }
                      ]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Design' },
                        { type: 'text', text: ' - Buat UI/UX design dan component library' }
                      ]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Development' },
                        { type: 'text', text: ' - Implement features step by step' }
                      ]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Testing' },
                        { type: 'text', text: ' - Unit tests dan integration tests' }
                      ]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Deployment' },
                        { type: 'text', text: ' - Deploy ke Vercel atau platform lain' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    features: [
      {
        title: 'Setup Project Structure',
        description: 'Inisialisasi project dengan Next.js dan setup folder structure',
        category: 'setup',
        status: 'planned'
      },
      {
        title: 'Authentication System',
        description: 'Implement user registration, login, dan session management',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Database Schema',
        description: 'Design dan implement database schema dengan Supabase/Prisma',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'UI Component Library',
        description: 'Buat reusable components dengan Tailwind CSS',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'API Routes',
        description: 'Implement REST API endpoints untuk CRUD operations',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'State Management',
        description: 'Setup state management dengan Zustand atau Redux',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Form Handling',
        description: 'Implement form validation dengan React Hook Form',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Error Handling',
        description: 'Global error handling dan user feedback system',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Responsive Design',
        description: 'Ensure aplikasi responsive di semua device',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'SEO Optimization',
        description: 'Implement meta tags, sitemap, dan SEO best practices',
        category: 'enhancement',
        status: 'planned'
      }
    ],
    releases: [
      {
        version: '0.1.0',
        notes: 'Initial setup dan basic structure',
        category: 'minor',
        status: 'planned'
      },
      {
        version: '0.2.0',
        notes: 'Authentication dan database integration',
        category: 'minor',
        status: 'planned'
      },
      {
        version: '1.0.0',
        notes: 'MVP release dengan core features',
        category: 'major',
        status: 'planned'
      }
    ]
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application',
    description: 'Template untuk membuat aplikasi mobile dengan React Native',
    category: 'Mobile Development',
    icon: '📱',
    notes: [
      {
        title: 'Setup React Native Environment',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Setup React Native Development' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Panduan setup environment untuk React Native development:' }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Prerequisites' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Node.js 18+' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Android Studio (untuk Android development)' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Xcode (untuk iOS development - Mac only)' }]
                    }
                  ]
                }
              ]
            },
            {
              type: 'codeBlock',
              attrs: { language: 'bash' },
              content: [
                {
                  type: 'text',
                  text: 'npx create-expo-app@latest MyMobileApp\ncd MyMobileApp\nnpx expo start'
                }
              ]
            }
          ]
        }
      }
    ],
    features: [
      {
        title: 'Project Setup',
        description: 'Initialize React Native project dengan Expo',
        category: 'setup',
        status: 'planned'
      },
      {
        title: 'Navigation System',
        description: 'Setup React Navigation untuk screen navigation',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Authentication',
        description: 'User authentication dengan biometric support',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Local Storage',
        description: 'Implement AsyncStorage untuk data persistence',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Push Notifications',
        description: 'Setup push notifications dengan Expo Notifications',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Camera Integration',
        description: 'Camera functionality untuk photo capture',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Offline Support',
        description: 'Offline functionality dengan data sync',
        category: 'enhancement',
        status: 'planned'
      }
    ]
  },
  {
    id: 'api-backend',
    name: 'REST API Backend',
    description: 'Template untuk membuat REST API dengan Node.js/Express',
    category: 'Backend Development',
    icon: '🔧',
    notes: [
      {
        title: 'API Architecture Guide',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'REST API Architecture' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Panduan untuk membangun REST API yang scalable dan maintainable:' }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Project Structure' }]
            },
            {
              type: 'codeBlock',
              attrs: { language: 'text' },
              content: [
                {
                  type: 'text',
                  text: 'src/\n├── controllers/\n├── models/\n├── routes/\n├── middleware/\n├── utils/\n└── config/'
                }
              ]
            }
          ]
        }
      }
    ],
    features: [
      {
        title: 'Express Server Setup',
        description: 'Initialize Express.js server dengan basic middleware',
        category: 'setup',
        status: 'planned'
      },
      {
        title: 'Database Integration',
        description: 'Setup database connection dengan ORM/ODM',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Authentication Middleware',
        description: 'JWT-based authentication system',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'CRUD Operations',
        description: 'Basic CRUD endpoints untuk main entities',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Input Validation',
        description: 'Request validation dengan Joi atau Yup',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Error Handling',
        description: 'Global error handling middleware',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'API Documentation',
        description: 'Swagger/OpenAPI documentation',
        category: 'documentation',
        status: 'planned'
      },
      {
        title: 'Rate Limiting',
        description: 'API rate limiting untuk security',
        category: 'security',
        status: 'planned'
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Platform',
    description: 'Template untuk membuat platform e-commerce lengkap',
    category: 'E-Commerce',
    icon: '🛒',
    notes: [
      {
        title: 'E-Commerce Development Plan',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'E-Commerce Platform Development' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Roadmap lengkap untuk membangun platform e-commerce:' }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Core Features' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Product catalog dengan search dan filter' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Shopping cart dan checkout process' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Payment gateway integration' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Order management system' }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    features: [
      {
        title: 'Product Catalog',
        description: 'Product listing dengan search, filter, dan pagination',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Shopping Cart',
        description: 'Add to cart, quantity management, dan cart persistence',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'User Authentication',
        description: 'Customer registration, login, dan profile management',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Payment Integration',
        description: 'Payment gateway integration (Stripe, PayPal, etc.)',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Order Management',
        description: 'Order tracking, status updates, dan history',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Admin Dashboard',
        description: 'Admin panel untuk product dan order management',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Inventory Management',
        description: 'Stock tracking dan low stock alerts',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Reviews & Ratings',
        description: 'Customer reviews dan rating system',
        category: 'feature',
        status: 'planned'
      }
    ]
  },
  {
    id: 'saas-app',
    name: 'SaaS Application',
    description: 'Template untuk membuat aplikasi SaaS dengan subscription',
    category: 'SaaS',
    icon: '💰',
    notes: [
      {
        title: 'SaaS Development Strategy',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'SaaS Application Development' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Panduan membangun aplikasi SaaS yang scalable dan profitable:' }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Core Components' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Multi-tenant architecture' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Subscription management' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Usage analytics dan billing' }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    features: [
      {
        title: 'Multi-tenant Setup',
        description: 'Setup database dan architecture untuk multi-tenant',
        category: 'setup',
        status: 'planned'
      },
      {
        title: 'Subscription Management',
        description: 'Stripe integration untuk subscription billing',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'User Dashboard',
        description: 'Dashboard untuk user dengan usage metrics',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Admin Panel',
        description: 'Admin panel untuk manage users dan subscriptions',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'API Rate Limiting',
        description: 'Rate limiting berdasarkan subscription tier',
        category: 'feature',
        status: 'planned'
      }
    ]
  },
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    description: 'Template untuk membuat website portfolio personal',
    category: 'Portfolio',
    icon: '💼',
    notes: [
      {
        title: 'Portfolio Design Guidelines',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Portfolio Website Guidelines' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Tips untuk membuat portfolio yang menarik dan profesional:' }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Essential Sections' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Hero section dengan personal branding' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'About section dengan background dan skills' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Projects showcase dengan case studies' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Contact information dan social links' }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    features: [
      {
        title: 'Landing Page Design',
        description: 'Hero section dengan personal branding dan CTA',
        category: 'design',
        status: 'planned'
      },
      {
        title: 'About Section',
        description: 'Personal story, skills, dan experience timeline',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Projects Showcase',
        description: 'Portfolio projects dengan case studies detail',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Contact Form',
        description: 'Contact form dengan email integration',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Blog Section',
        description: 'Personal blog untuk sharing knowledge',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'SEO Optimization',
        description: 'Meta tags, structured data, dan sitemap',
        category: 'enhancement',
        status: 'planned'
      },
      {
        title: 'Analytics Integration',
        description: 'Google Analytics untuk tracking visitors',
        category: 'enhancement',
        status: 'planned'
      }
    ]
  },
  {
    id: 'blog',
    name: 'Blog Website',
    description: 'Template untuk membuat blog atau website konten',
    category: 'Content',
    icon: '📝',
    notes: [
      {
        title: 'Blog Setup Guide',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Blog Website Development' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Panduan membuat blog yang SEO-friendly dan engaging:' }
              ]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Content management system' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'SEO optimization' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Social media integration' }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    features: [
      {
        title: 'Content Management',
        description: 'CMS untuk create, edit, dan publish artikel',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Rich Text Editor',
        description: 'WYSIWYG editor untuk menulis artikel',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Categories & Tags',
        description: 'Sistem kategorisasi dan tagging artikel',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Comment System',
        description: 'Sistem komentar untuk engagement',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'SEO Features',
        description: 'Meta tags, sitemap, dan SEO optimization',
        category: 'enhancement',
        status: 'planned'
      },
      {
        title: 'Newsletter',
        description: 'Email subscription untuk newsletter',
        category: 'feature',
        status: 'planned'
      }
    ]
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    description: 'Template untuk membuat admin dashboard dengan analytics',
    category: 'Dashboard',
    icon: '📊',
    notes: [
      {
        title: 'Dashboard Architecture',
        category: 'documentation',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Admin Dashboard Development' }]
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Panduan membangun dashboard yang informatif dan user-friendly:' }
              ]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Data visualization dengan charts' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Real-time data updates' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Role-based access control' }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    features: [
      {
        title: 'Analytics Dashboard',
        description: 'Overview dashboard dengan key metrics',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Data Visualization',
        description: 'Charts dan graphs untuk data visualization',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'User Management',
        description: 'CRUD operations untuk user management',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Role & Permissions',
        description: 'Role-based access control system',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Reports Generation',
        description: 'Generate dan export reports (PDF, Excel)',
        category: 'feature',
        status: 'planned'
      },
      {
        title: 'Real-time Updates',
        description: 'WebSocket untuk real-time data updates',
        category: 'enhancement',
        status: 'planned'
      }
    ]
  }
]