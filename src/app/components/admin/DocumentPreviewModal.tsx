'use client';

import { X, FileText, Image as ImageIcon, ExternalLink, AlertCircle } from 'lucide-react';

export type SubmittedDocument = {
  label: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileUrl: string; // Empty until the backend serves real uploaded files.
  uploadedDate: string;
};

type DocumentPreviewModalProps = {
  document: SubmittedDocument | null;
  onClose: () => void;
};

export default function DocumentPreviewModal({ document, onClose }: DocumentPreviewModalProps) {
  if (!document) return null;

  const hasRealFile = document.fileUrl.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D312E]/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#3D5A4C]">
              {document.fileType === 'pdf' ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#2D312E]">{document.label}</p>
              <p className="text-[10.5px] text-[#2D312E]/45">{document.fileName} · Uploaded {document.uploadedDate}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#2D312E]/40 hover:bg-[#FAF9F6] hover:text-[#2D312E]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-[#FAF9F6] p-4">
          {!hasRealFile ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#2D312E]/15 text-center">
              <AlertCircle className="h-6 w-6 text-[#2D312E]/30" />
              <p className="text-[12px] font-medium text-[#2D312E]/50">
                Document preview unavailable
              </p>
              <p className="max-w-xs text-[11px] text-[#2D312E]/35">
                Backend API will serve the real uploaded file here later.
                This applicant's actual submission isn't connected yet.
              </p>
            </div>
          ) : document.fileType === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={document.fileUrl} alt={document.label} className="mx-auto max-h-[65vh] rounded-lg" />
          ) : (
            <iframe src={document.fileUrl} title={document.label} className="h-[65vh] w-full rounded-lg border-0" />
          )}
        </div>

        {hasRealFile && (
          <div className="border-t border-[#2D312E]/[0.06] px-5 py-3">
            
              <a href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4E876E] hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
}