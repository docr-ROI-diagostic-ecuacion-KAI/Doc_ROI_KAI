import RadarUxTuning from './RadarUxTuning';
import IdentityUxTuning from './IdentityUxTuning';

export default function DiagnosisLayout({ children }) {
  return (
    <>
      <IdentityUxTuning />
      <RadarUxTuning />
      {children}
    </>
  );
}
