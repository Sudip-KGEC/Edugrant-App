import React from 'react'

const DetailBox = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
      {icon} {label}
    </span>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-37">
      {value}
    </span>
  </div>
);

export default DetailBox