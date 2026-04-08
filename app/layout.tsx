import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mars Mission Simulator',
  description: 'Realistic simulation of a crewed mission to Mars — fuel physics, risk modelling, live flight animation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
