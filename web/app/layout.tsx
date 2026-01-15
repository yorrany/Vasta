import "./globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "Vasta",
  description: "Hub de presença digital monetizável"
}

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pt-BR">
      <body className="bg-vasta-bg text-vasta-text antialiased">
        {children}
      </body>
    </html>
  )
}

