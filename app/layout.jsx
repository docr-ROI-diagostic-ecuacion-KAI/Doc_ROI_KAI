import './globals.css';

export const metadata = {
  title: 'Doc ROI · KAI Diagnosis System',
  description: 'Executive KAI ROI diagnosis for Customer Equity and data monetization.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
