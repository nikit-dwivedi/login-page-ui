import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import ThemeRegistry from '@/components/ThemeRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FinCoopers - Secure Financial Solutions',
  description: 'FinCoopers provides innovative financial solutions for individuals and businesses.',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
