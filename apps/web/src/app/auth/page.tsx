'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AuthDemo() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">✅ Logged In</h1>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-sm text-gray-400">Name</p>
              <p className="font-semibold">{session.user?.name}</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-semibold">{session.user?.email}</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-sm text-gray-400">Discord ID</p>
              <p className="font-semibold font-mono">{session.user?.discordId}</p>
            </div>
            
            {session.user?.image && (
              <div className="bg-gray-700 p-4 rounded text-center">
                <img 
                  src={session.user.image} 
                  alt="avatar"
                  className="w-16 h-16 rounded-full mx-auto"
                />
              </div>
            )}
          </div>

          <button
            onClick={() => signOut()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Sign Out
          </button>

          <Link href="/" className="block text-center text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">MCMarket Login</h1>
        
        <button
          onClick={() => signIn('discord', { redirect: false })}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-4 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1 .009-.119c.125-.093.25-.19.371-.287a.075.075 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 0 1 .079.009c.12.098.246.195.371.288a.072.072 0 0 1 .009.118a12.973 12.973 0 0 1-1.872.892a.07.07 0 0 0-.038.099a14.048 14.048 0 0 0 1.293 2.1a.078.078 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.761-.838-8.895-3.549-12.55a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419c0-1.333.975-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.974-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.419-2.157 2.419z"/>
          </svg>
          Sign in with Discord
        </button>

        <p className="text-center text-gray-400 text-sm">
          Test Discord OAuth integration
        </p>
      </div>
    </div>
  )
}
