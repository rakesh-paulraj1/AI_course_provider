import { Layout } from '@/components/Layout'
import React from 'react'

const Dashboard = () => {
  return (
   <Layout>
    <div className="h-screen w-full flex justify-center items-center">
      <div className="h-[390px] w-[360px] bg-neutral-950 rounded-lg shadow-slate-800 shadow-[0_0_10px_2px_rgb(148,163,184)] flex flex-col items-center p-4">
        <div className="font-bold text-4xl p-4 text-neutral-400">
          Dashboard
        </div>
      </div>
    </div>
   </Layout>
  )
}

export default Dashboard