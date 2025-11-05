import React, { useState } from 'react';
import SectionNav from './components/SectionNav';
import Plantation from './pages/Plantation';
import Factory from './pages/Factory';
import Company from './pages/Company';

export default function App() {
  const [section, setSection] = useState('plantation');
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Palm Oil Ops Dashboard</h1>
        <SectionNav section={section} setSection={setSection} />
      </header>
      {section === 'plantation' && <Plantation/>}
      {section === 'factory' && <Factory/>}
      {section === 'company' && <Company/>}
    </div>
  );
}
