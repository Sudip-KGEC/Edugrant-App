import React from 'react'

const MobileNavLink = ({onClick, icon, label, active}) => {
  return (
    <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
      active 
      ? 'bg-teal-500/10 text-teal-400' 
      : 'text-slate-300 hover:bg-slate-800'
    }`}
  >
    {icon}
    <span className="font-semibold uppercase tracking-wider text-xs">{label}</span>
  </button>
  )
}

export default MobileNavLink