import {
  ArrowLeftIcon,
  Code2Icon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  GlobeIcon,
  Loader2Icon,
} from "lucide-react";

const BuilderHeader = ({
  projectName,
  version,
  showCode,
  publishing,
  onToggleShowCode,
  onOpenPreview,
  onPublish,
  onDownload,
  onBack,
  onLogout,
}) => {
  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-3 border-b border-zinc-200 bg-white">
      {/* Left Section */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 cursor-pointer transition-colors shrink-0"
        >
          <ArrowLeftIcon size={16} />
        </button>

        <img src="/logo.svg" alt="" className="invert size-5 shrink-0" />

        <span className="text-sm font-semibold truncate max-w-38 md:max-w-50">
          {projectName}
        </span>

        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 font-medium shrink-0">
          v{version}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleShowCode}
          className={`h-8 inline-flex items-center justify-center gap-1.5 px-2.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white transition-colors ${
            showCode ? "bg-zinc-100 text-zinc-900" : ""
          }`}
        >
          {showCode ? (
            <>
              <EyeIcon size={12} />
              <span>Preview</span>
            </>
          ) : (
            <>
              <Code2Icon size={12} />
              <span>Code</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenPreview}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-2.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white transition-colors"
        >
          <ExternalLinkIcon size={12} />
          <span>Open Preview</span>
        </button>

        <button
          onClick={onPublish}
          disabled={publishing}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-2.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {publishing ? (
            <Loader2Icon size={12} className="animate-spin" />
          ) : (
            <GlobeIcon size={12} />
          )}
          <span>Publish</span>
        </button>

        <button
          onClick={onDownload}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-2.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white transition-colors"
        >
          <DownloadIcon size={12} />
          <span>Export</span>
        </button>

        <button
          onClick={onLogout}
          className="h-8 inline-flex items-center justify-center px-2.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium rounded-lg cursor-pointer bg-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default BuilderHeader;
