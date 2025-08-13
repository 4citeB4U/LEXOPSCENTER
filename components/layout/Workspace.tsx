
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Dashboard from '../views/Dashboard';
import ResearchAgent from '../views/ResearchAgent';
import Notes from '../views/Notes';
import SchoolExplorer from '../views/SchoolExplorer';
import Settings from '../views/Settings';
import MagnaCarta from '../views/MagnaCarta';
import Assignments from '../views/Assignments';
import Analyzer from '../views/Analyzer';
import HelpGuide from '../views/HelpGuide';

const Workspace: React.FC = () => {
  const { currentView } = useAppContext();

  const renderView = () => {
    switch (currentView) {
      case 'pulse':
        return <Dashboard />;
      case 'intel':
        return <ResearchAgent />;
      case 'magna_carta':
        return <MagnaCarta />;
      case 'grind':
        return <Assignments />;
      case 'lab':
        return <Notes />;
      case 'analyzer':
        return <Analyzer />;
      case 'campus':
        return <SchoolExplorer />;
      case 'garage':
        return <Settings />;
       case 'playbook':
        return <HelpGuide />;
      default:
        return <Dashboard />;
    }
  };

  return <main className="workspace flex-grow h-full overflow-hidden bg-bg-main">{renderView()}</main>;
};

export default Workspace;
