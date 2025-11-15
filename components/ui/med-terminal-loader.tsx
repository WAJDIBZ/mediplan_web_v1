export function MedTerminalLoader({ message = "🔄 Initialisation..." }: { message?: string }) {
  return (
    <div className="med-terminal-loader">
      <div className="med-terminal-header">
        <div className="med-terminal-title">🩺 MediPlan System</div>
        <div className="med-terminal-controls">
          <div className="med-control close" />
          <div className="med-control minimize" />
          <div className="med-control maximize" />
        </div>
      </div>
      <div className="med-terminal-text">{message}</div>
    </div>
  );
}
