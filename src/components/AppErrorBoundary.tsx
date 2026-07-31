import React from "react";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error.message || String(this.state.error);

    return (
      <div className="min-h-screen bg-[#030712] text-[#F5F7FA] flex items-center justify-center p-6">
        <div className="w-full max-w-2xl rounded-2xl border border-[#1D2B3E] bg-[#0A1018] p-6">
          <h1 className="text-xl font-semibold mb-2">Missing required Sanity content</h1>
          <p className="text-sm text-[#A7B0C0] mb-5">
            This site is configured with <strong>no fallbacks</strong>. It will not render until
            required documents exist in Sanity for both <strong>en</strong> and <strong>hb</strong>.
          </p>
          <pre className="whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-xs text-[#A7B0C0] border border-[#1D2B3E]">
            {message}
          </pre>
          <div className="mt-5 text-sm text-[#A7B0C0] space-y-2">
            <p className="font-semibold text-[#F5F7FA]">Fix:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Deploy the updated Studio schema (<code>localeString/localeText</code> now uses{" "}
                <code>hb</code>).
              </li>
              <li>Create the <code>rizzPage</code> document (id: <code>rizzPage</code>).</li>
              <li>
                Ensure proof cards / reviews / portfolio have required localized fields for{" "}
                <code>en</code> + <code>hb</code>.
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

