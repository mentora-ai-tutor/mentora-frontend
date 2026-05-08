"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import GithubLinkCard, { GitHubIcon } from "@/components/onboarding/GithubLinkCard";
import { useAuth } from "@/contexts/AuthContext";
import { githubApi } from "@/lib/api/github";

interface GitHubStatusControlProps {
  sidebarOpen: boolean;
}

export default function GitHubStatusControl({ sidebarOpen }: GitHubStatusControlProps) {
  const { user, refreshUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptMode, setPromptMode] = useState<"connect" | "change">("connect");
  const [checking, setChecking] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  if (!user) return null;

  const githubLinked = user.github?.linked === true;
  const githubLogin = user.github?.gh_login;

  const closeMenu = () => setMenuOpen(false);

  const openConnectPrompt = () => {
    closeMenu();
    setPromptMode("connect");
    setPromptOpen(true);
  };

  const openChangePrompt = () => {
    closeMenu();
    setPromptMode("change");
    setPromptOpen(true);
  };

  const handleStatusClick = () => {
    if (!githubLinked) {
      openConnectPrompt();
      return;
    }

    setMenuOpen((open) => !open);
  };

  const handleRefreshStatus = async () => {
    setChecking(true);
    closeMenu();

    try {
      const status = await githubApi.getStatus();
      await refreshUser();
      toast.success(
        status.linked
          ? `GitHub connected${status.gh_login ? ` as @${status.gh_login}` : ""}`
          : "GitHub is not connected",
      );
    } catch {
      toast.error("Could not refresh GitHub status");
    } finally {
      setChecking(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    closeMenu();

    try {
      await githubApi.unlink();
      await refreshUser();
      toast.success("GitHub disconnected");
    } catch {
      toast.error("Could not disconnect GitHub");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="relative">
      {menuOpen && githubLinked && (
        <>
          <button
            type="button"
            aria-label="Close GitHub account menu"
            className="fixed inset-0 z-30 cursor-default"
            onClick={closeMenu}
          />
          <div
            className={`absolute z-40 rounded-xl border border-white/10 bg-[#111827] p-2 shadow-2xl ${
              sidebarOpen
                ? "bottom-full left-0 right-0 mb-2"
                : "bottom-0 left-full ml-2 w-64"
            }`}
          >
            <div className="px-3 py-2 border-b border-white/10">
              <p className="text-xs font-semibold text-white">GitHub account</p>
              <p className="truncate text-[10px] uppercase tracking-widest text-teal-300">
                {githubLogin ? `@${githubLogin}` : "Connected"}
              </p>
            </div>
            <button
              type="button"
              onClick={openChangePrompt}
              className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-white/80 transition-colors hover:bg-teal-500/10 hover:text-teal-200"
            >
              Change account
            </button>
            <button
              type="button"
              onClick={handleRefreshStatus}
              disabled={checking}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
              Check status
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-300/80 transition-colors hover:bg-red-500/10 hover:text-red-200 disabled:cursor-wait disabled:opacity-60"
            >
              {disconnecting ? "Disconnecting..." : "Disconnect account"}
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={handleStatusClick}
        className={`relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 transition-all group ${
          githubLinked
            ? "border-teal-500/20 bg-teal-500/10 text-teal-200 hover:bg-teal-500/15"
            : "border-amber-500/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15"
        }`}
        title={
          githubLinked
            ? `GitHub connected${githubLogin ? ` as @${githubLogin}` : ""}`
            : "Connect GitHub"
        }
        aria-label={
          githubLinked
            ? `GitHub connected${githubLogin ? ` as ${githubLogin}` : ""}. Open account options.`
            : "GitHub not connected. Connect GitHub."
        }
      >
        <GitHubIcon className="h-5 w-5 shrink-0" />
        <span className={`min-w-0 flex-1 text-left ${!sidebarOpen && "lg:hidden"}`}>
          <span className="block text-sm font-semibold leading-tight">
            {githubLinked ? "GitHub connected" : "Connect GitHub"}
          </span>
          <span className="block truncate pt-0.5 text-[10px] uppercase tracking-widest text-white/45">
            {githubLinked
              ? githubLogin
                ? `@${githubLogin}`
                : "Linked"
              : "Not linked"}
          </span>
        </span>
        {githubLinked ? (
          <CheckCircle2 className={`h-4 w-4 text-teal-300 ${!sidebarOpen && "lg:hidden"}`} />
        ) : (
          <AlertCircle className={`h-4 w-4 text-amber-300 ${!sidebarOpen && "lg:hidden"}`} />
        )}
        <span
          className={`absolute right-2 top-2 h-2 w-2 rounded-full ${sidebarOpen ? "hidden" : "block"} ${
            githubLinked ? "bg-teal-300" : "bg-amber-300"
          }`}
        />
      </button>

      {promptOpen && typeof document !== "undefined" && createPortal(
        <GithubLinkCard
          mode={promptMode}
          previousLogin={githubLogin}
          previousLinkedAt={user.github?.linked_at}
          onDismiss={() => setPromptOpen(false)}
          onLinked={() => setPromptOpen(false)}
        />,
        document.body,
      )}
    </div>
  );
}
