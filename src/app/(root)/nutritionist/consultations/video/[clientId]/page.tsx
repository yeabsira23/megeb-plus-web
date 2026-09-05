
"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserRound, Video } from "lucide-react";
import { useMemo } from "react";

export default function VideoConsultationPage() {
  const params = useParams();
  const router = useRouter();

  const clientId = params.clientId as string;

  /*
   * The client API is not ready yet.
   * The client ID comes directly from the URL.
   */
  const clientName = `Client ${clientId}`;

  /*
   * Each client gets their own consultation room.
   *
   * Example:
   * /nutritionist/consultations/video/1
   * -> megeb-consultation-1
   */
  const roomName = useMemo(
    () => `megeb-consultation-${clientId}`,
    [clientId]
  );

  function goBack() {
    router.push(
      `/nutritionist/consultations?clientId=${clientId}`
    );
  }

  return (
    <main className="min-h-screen bg-[#1F2522] text-white">
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#252C28] px-5 sm:px-7">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Back to consultations"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Video
                size={15}
                className="text-[#8FC5A8]"
              />

              <h1 className="font-display text-[16px]">
                Video Consultation
              </h1>
            </div>

            <p className="font-body mt-0.5 text-[9px] text-white/40">
              Secure online consultation
            </p>
          </div>
        </div>

        {/* Consultation Info */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
            <UserRound size={15} />
          </div>

          <div>
            <p className="font-body text-[10px] font-semibold text-white">
              {clientName}
            </p>

            <p className="font-body text-[8px] text-white/40">
              Consultation room
            </p>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <div className="flex min-h-[calc(100vh-64px)] flex-col">
        <div className="flex flex-1 items-center justify-center p-3 sm:p-5">
          <div className="h-[calc(100vh-90px)] min-h-[520px] w-full max-w-7xl overflow-hidden rounded-2xl bg-[#151A18] shadow-2xl">
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={roomName}
              userInfo={{
                displayName: "Megeb+ Nutritionist",
                email: "nutritionist@megebplus.com",
              }}
              configOverwrite={{
                startWithAudioMuted: false,
                startWithVideoMuted: false,

                prejoinConfig: {
                  enabled: true,
                },

                disableModeratorIndicator: true,
                enableEmailInStats: false,
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                MOBILE_APP_PROMO: false,
                TILE_VIEW_MAX_COLUMNS: 2,
              }}
              onReadyToClose={() => {
                goBack();
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.width = "100%";
                iframeRef.style.height = "100%";
                iframeRef.style.border = "0";
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

