'use client';

import { ArrowRight } from 'lucide-react';
import type { StudentAnalysisDocument } from '@/lib/api/peerLearning';
import type { PeerSessionData } from '@/components/peer-learning/PeerMatchSection';
import type { User as AuthUser } from '@/lib/api/auth';

interface AiAssistantSectionProps {
  analysis: StudentAnalysisDocument | null;
  user?: AuthUser | null;
  onStartSession: (data: PeerSessionData) => void;
}

export default function AiAssistantSection({ analysis, user, onStartSession }: AiAssistantSectionProps) {
  const firstGap = analysis?.mastery_profile.knowledge_gaps[0];
  const gapTopic = firstGap?.topic || 'Java Programming';
  const weakSubskill = firstGap?.weak_subskills[0]?.subskill || 'General Concepts';

  const handleConnect = () => {
    const studentId = user?.student_id || user?._id || 'unknown';
    const roomId = `room_${studentId}_ai_${Date.now()}`;
    onStartSession({
      roomId,
      peerId: 'ai_teacher',
      peerName: 'Java AI Assistant Teacher',
      topic: gapTopic,
      topicId: firstGap?.topic_id || '',
      baselineScore: firstGap?.mastery_score || 0,
      knowledgeGap: gapTopic,
      weakSubskill,
      matchScore: 0,
      isAiSession: true,
    });
  };

  return (
    <button
      onClick={handleConnect}
      className="w-full min-h-12 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
    >
      Connect with AI Assistant Teacher
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
