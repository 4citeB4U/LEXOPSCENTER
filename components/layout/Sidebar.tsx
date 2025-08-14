
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import CUE from '../../services/cueRuntime';
import { View } from '../../types';
import LexAvatar from '../voice/LexAvatar';
import LexWaveEmitter from '../voice/LexWaveEmitter';
import { 
  Activity, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  FlaskConical, 
  Scan, 
  Search, 
  GraduationCap, 
  Settings, 
  HelpCircle,
  Brain
} from 'lucide-react';

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="w-5 h-5 mr-3 shrink-0 text-current">{children}</div>;

// Modern, beautiful navigation icons
const PulseIcon = () => <Icon><Activity className="w-5 h-5" /></Icon>;
const MagnaCartaIcon = () => <Icon><FileText className="w-5 h-5" /></Icon>;
const GrindIcon = () => <Icon><CheckSquare className="w-5 h-5" /></Icon>;
const LabIcon = () => <Icon><FlaskConical className="w-5 h-5" /></Icon>;
const AnalyzerIcon = () => <Icon><Scan className="w-5 h-5" /></Icon>;
const IntelIcon = () => <Icon><Search className="w-5 h-5" /></Icon>;
const CampusIcon = () => <Icon><GraduationCap className="w-5 h-5" /></Icon>;
const GarageIcon = () => <Icon><Settings className="w-5 h-5" /></Icon>;
const PlaybookIcon = () => <Icon><HelpCircle className="w-5 h-5" /></Icon>;
const BookOpenIcon: React.FC = () => <BookOpen className="w-6 h-6" />;

const navItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: 'pulse', label: 'The Pulse', icon: PulseIcon },
  { view: 'magna_carta', label: 'The Magna Carta', icon: MagnaCartaIcon },
  { view: 'grind', label: 'The Grind', icon: GrindIcon },
  { view: 'lab', label: 'The Lab', icon: LabIcon },
  { view: 'analyzer', label: 'The Analyzer', icon: AnalyzerIcon },
  { view: 'intel', label: 'The Intel', icon: IntelIcon },
  { view: 'campus', label: 'The Campus', icon: CampusIcon },
];

const bottomNavItems: { view: View; label: string; icon: React.ElementType }[] = [
    { view: 'playbook', label: 'The Playbook', icon: PlaybookIcon },
    { view: 'garage', label: 'The Garage', icon: GarageIcon },
];

const Sidebar: React.FC = () => {
  const { currentView, highlightedNavItem, closeSidebars, isSidebarOpen } = useAppContext();

  const handleNav = (view: View) => {
    CUE.page({ to: view });
    closeSidebars();
  };

  const NavButton: React.FC<{view: View, label: string, icon: React.ElementType}> = ({view, label, icon: NavIcon}) => {
    const isHighlighted = highlightedNavItem === view;
    const isActive = currentView === view;
    return (
        <li className="mb-1">
            <button
                onClick={() => handleNav(view)}
                className={`w-full flex items-center p-2.5 rounded-lg text-left text-base transition-all duration-200 group
                ${isActive ? 'bg-primary-blue text-white font-semibold' : 'text-text-dark hover:bg-bg-surface hover:text-text-light'}
                ${isHighlighted ? 'ring-2 ring-offset-2 ring-offset-bg-main ring-accent-fuchsia' : ''}`}
            >
                <NavIcon/>
                <span className="group-hover:translate-x-1 transition-transform duration-200">{label}</span>
            </button>
        </li>
    );
  }

  const sidebarClasses = [
    'sidebar',
    'w-64',
    'bg-gray-900',
    'p-4',
    'flex',
    'flex-col',
    'h-full',
    'border-r',
    'border-border-color',
    'shrink-0',
    'overflow-y-auto',
    isSidebarOpen ? 'sidebar-open' : ''
  ].join(' ');

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center mb-4 pl-1">
        <div className="bg-primary-blue p-2 rounded-lg mr-3 text-white">
            <BookOpenIcon />
        </div>
        <h1 className="text-xl font-bold text-white">LΞX Ops Center</h1>
      </div>
      
      <div className="flex-grow flex flex-col overflow-y-auto">
        <nav className="mb-4">
          <ul>
            {navItems.map((item) => <NavButton key={item.view} {...item} />)}
          </ul>
        </nav>

        <div className="mt-auto">
           <div className="px-1 space-y-3 mb-4">
              <LexAvatar />
              <LexWaveEmitter />
           </div>
           <nav>
             <ul>
                {bottomNavItems.map((item) => <NavButton key={item.view} {...item} />)}
             </ul>
           </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
