import './globals.css'

export const metadata = {
  title: 'AUDAX Dashboard',
  description: 'Agency Dashboard by AUDAX',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
