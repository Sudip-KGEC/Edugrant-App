import React from 'react'
import { GraduationCap , Search,FileText,CheckCircle} from 'lucide-react'

const Home = ({t,setView,handleLoginStart,currentUser}) => {

    
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center space-y-8 pb-12">
         <div className="relative">
           <div className="absolute -inset-1 rounded-full bg-teal-400 blur opacity-20 animate-pulse"></div>
           <GraduationCap className="w-32 h-32 text-teal-600 dark:text-teal-400 relative z-10 animate-float" />
         </div>
         <h1 className="text-5xl font-bold text-teal-900 dark:text-teal-400 tracking-tight">{t.heroTitle}</h1>
         <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl">{t.heroDesc}</p>
   
         <div className="flex gap-4">
           <button
             onClick={() => setView('browse')}
             className="bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl"
           >
             {t.browse}
           </button>
           {!currentUser && (
             <button
               onClick={handleLoginStart}
               className="bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 border-2 border-teal-600 dark:border-teal-500 px-8 py-3 rounded-full text-lg font-medium hover:bg-teal-50 dark:hover:bg-slate-800 transition-all"
             >
               {t.login}
             </button>
           )}
         </div>
   
         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <Search className="w-10 h-10 text-teal-500 mb-4 mx-auto" />
             <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">{t.featureSearchTitle}</h3>
             <p className="text-slate-500 dark:text-slate-400">{t.featureSearchDesc}</p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <FileText className="w-10 h-10 text-teal-500 mb-4 mx-auto" />
             <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">{t.featureApplyTitle}</h3>
             <p className="text-slate-500 dark:text-slate-400">{t.featureApplyDesc}</p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <CheckCircle className="w-10 h-10 text-teal-500 mb-4 mx-auto" />
             <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">{t.featureTrackTitle}</h3>
             <p className="text-slate-500 dark:text-slate-400">{t.featureTrackDesc}</p>
           </div>
         </div>
       </div>
  )
}

export default Home