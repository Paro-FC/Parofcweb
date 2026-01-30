export const metadata = {
  title: 'Paro FC Studio',
  description: 'Content management for Paro FC website',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ margin: 0, height: '100vh' }}>
      {children}
    </div>
  )
}

