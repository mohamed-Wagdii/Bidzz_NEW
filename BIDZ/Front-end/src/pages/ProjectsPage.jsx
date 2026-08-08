import React, { useState } from 'react';
import EasoLogo from '../components/shared/EasoLogo';
import { FiSearch, FiBell, FiPlus, FiMoreHorizontal, FiCalendar, FiClock } from 'react-icons/fi';

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('active');

  const projects = [
    {
      id: 1,
      title: "Website Redesign",
      client: "TechVision Inc.",
      progress: 75,
      status: "In Progress",
      deadline: "Oct 24, 2026",
      team: ["https://i.pravatar.cc/150?img=11", "https://i.pravatar.cc/150?img=12", "https://i.pravatar.cc/150?img=13"],
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      title: "Mobile App Development",
      client: "FitnessPlus",
      progress: 30,
      status: "At Risk",
      deadline: "Nov 02, 2026",
      team: ["https://i.pravatar.cc/150?img=32", "https://i.pravatar.cc/150?img=33"],
      color: "from-rose-500 to-orange-400"
    },
    {
      id: 3,
      title: "Marketing Campaign Q4",
      client: "Global Retail",
      progress: 90,
      status: "On Track",
      deadline: "Oct 15, 2026",
      team: ["https://i.pravatar.cc/150?img=41", "https://i.pravatar.cc/150?img=42", "https://i.pravatar.cc/150?img=43", "https://i.pravatar.cc/150?img=44"],
      color: "from-emerald-500 to-teal-400"
    },
    {
      id: 4,
      title: "Cloud Infrastructure Setup",
      client: "DataCore Systems",
      progress: 10,
      status: "Planning",
      deadline: "Dec 10, 2026",
      team: ["https://i.pravatar.cc/150?img=51"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F16] text-white font-sans flex overflow-hidden">
      
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#121A25] border-r border-white/5 flex flex-col relative z-20">
        <div className="p-6">
          <div className="bg-white/95 rounded-xl p-3 shadow-lg shadow-black/20 transform transition-transform hover:scale-105">
            <EasoLogo className="w-full h-auto" />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {['Dashboard', 'Projects', 'Tasks', 'Team', 'Analytics', 'Settings'].map((item) => (
            <button 
              key={item}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                item === 'Projects' 
                  ? 'bg-gradient-to-r from-[#103F46] to-[#1A5C66] text-white shadow-lg shadow-[#103F46]/30 font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${item === 'Projects' ? 'bg-[#D29944]' : 'bg-transparent'}`} />
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#103F46]/20 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#D29944]/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />

        {/* Header */}
        <header className="h-24 px-10 flex items-center justify-between border-b border-white/5 bg-[#0A0F16]/50 backdrop-blur-md z-10">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Projects Overview</h1>
            <p className="text-gray-400 text-sm mt-1">Manage and track your active initiatives</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D29944] transition-colors" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-[#121A25] border border-white/10 rounded-full py-2.5 pl-11 pr-6 focus:outline-none focus:border-[#D29944]/50 focus:ring-1 focus:ring-[#D29944]/50 text-sm w-64 transition-all"
              />
            </div>
            
            <button className="relative p-2.5 rounded-full bg-[#121A25] border border-white/10 hover:border-white/20 transition-colors">
              <FiBell className="text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#D29944] rounded-full border border-[#121A25]" />
            </button>
            
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#103F46] to-[#D29944] p-0.5 cursor-pointer hover:scale-105 transition-transform">
              <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="w-full h-full rounded-full border-2 border-[#121A25]" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 flex-1 overflow-y-auto z-10">
          
          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex bg-[#121A25] p-1 rounded-xl border border-white/5">
              {['Active', 'Completed', 'Archived'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.toLowerCase() 
                      ? 'bg-white/10 text-white shadow-sm' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <button className="flex items-center gap-2 bg-[#D29944] hover:bg-[#c08b3c] text-[#0A0F16] px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#D29944]/20 hover:shadow-[#D29944]/40 hover:-translate-y-0.5">
              <FiPlus /> New Project
            </button>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div 
                key={project.id} 
                className="group relative bg-[#121A25]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Top color accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${project.color}`} />
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${project.color} bg-opacity-10 text-white/90 shadow-inner`}>
                    {project.status}
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <FiMoreHorizontal size={20} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold mb-1 group-hover:text-[#D29944] transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{project.client}</p>
                
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-medium mb-2 text-gray-300">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${project.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Footer details */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex -space-x-3">
                    {project.team.map((avatar, idx) => (
                      <img 
                        key={idx} 
                        src={avatar} 
                        alt="Team member" 
                        className="w-8 h-8 rounded-full border-2 border-[#121A25] z-10 transition-transform hover:scale-110 hover:z-20 cursor-pointer"
                      />
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#121A25] bg-[#103F46] flex items-center justify-center text-xs font-bold z-10">
                        +2
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg">
                    <FiClock className={project.status === "At Risk" ? "text-rose-400" : "text-[#D29944]"} />
                    <span>{project.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
}
