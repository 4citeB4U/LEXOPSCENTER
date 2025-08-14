// Modern Icon Library for LEX Ops Center
// All icons are from Lucide React - modern, beautiful, and consistent

export {
  // Navigation Icons
  Activity,           // The Pulse
  FileText,           // The Magna Carta
  CheckSquare,        // The Grind
  FlaskConical,       // The Lab
  Scan,               // The Analyzer
  Search,             // The Intel
  GraduationCap,      // The Campus
  Settings,           // The Garage
  HelpCircle,         // The Playbook
  BookOpen,           // App Logo
  
  // Action Icons
  Plus,
  Trash2,
  Archive,
  Mic,
  Send,
  Link,
  ExternalLink,
  Eye,
  Download,
  X,
  Smartphone,
  
  // View Icons
  List,               // Lineup view
  Columns3,           // Lanes view
  Calendar,           // Horizon view
  Grid3X3,            // Matrix view
  Clock,
  StickyNote,
  Target,
  
  // Feature Icons
  Upload,
  Camera,
  Brain,
  Check,
  Image,
  MessageSquare,
  Menu,
  
  // Utility Icons
  Save,
} from 'lucide-react';

// Icon size constants for consistency
export const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
} as const;

// Icon color variants
export const ICON_COLORS = {
  primary: 'text-primary-blue',
  accent: 'text-accent-fuchsia',
  success: 'text-positive-green',
  warning: 'text-warning-red',
  light: 'text-text-light',
  dark: 'text-text-dark',
  white: 'text-white',
  current: 'text-current',
} as const;

// Helper function to create consistent icons
export const createIcon = (
  IconComponent: React.ComponentType<{ className?: string }>,
  size: keyof typeof ICON_SIZES = 'md',
  color: keyof typeof ICON_COLORS = 'current'
) => {
  return <IconComponent className={`${ICON_SIZES[size]} ${ICON_COLORS[color]}`} />;
};
