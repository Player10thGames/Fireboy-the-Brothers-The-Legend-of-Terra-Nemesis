/**
 * Cutscene Overlay Component
 * RPG-style dialogue box with typewriter text effect
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CutsceneFrame } from '@/engine/Cutscene';

interface CutsceneOverlayProps {
  frames: CutsceneFrame[];
  onComplete: () => void;
}

export default function CutsceneOverlay({ frames, onComplete }: CutsceneOverlayProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  const currentFrame = frames[frameIndex];

  const advanceFrame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isTyping) {
      setDisplayedText(currentFrame.text);
      setIsTyping(false);
      return;
    }

    if (frameIndex < frames.length - 1) {
      setFrameIndex(prev => prev + 1);
      setDisplayedText('');
      setIsTyping(true);
      charIndexRef.current = 0;
    } else {
      onComplete();
    }
  }, [frameIndex, frames.length, isTyping, currentFrame, onComplete]);

  useEffect(() => {
    charIndexRef.current = 0;
    setDisplayedText('');
    setIsTyping(true);
  }, [frameIndex]);

  useEffect(() => {
    if (!currentFrame || !isTyping) return;

    const text = currentFrame.text;
    const typeChar = () => {
      if (charIndexRef.current < text.length) {
        charIndexRef.current++;
        setDisplayedText(text.slice(0, charIndexRef.current));
        timerRef.current = setTimeout(typeChar, 40);
      } else {
        setIsTyping(false);
      }
    };
    timerRef.current = setTimeout(typeChar, 40);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentFrame, isTyping]);

  useEffect(() => {
    if (!currentFrame || isTyping) return;
    timerRef.current = setTimeout(() => {
      if (frameIndex < frames.length - 1) {
        setFrameIndex(prev => prev + 1);
        charIndexRef.current = 0;
      } else {
        onComplete();
      }
    }, currentFrame.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentFrame, isTyping, frameIndex, frames.length, onComplete]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advanceFrame();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advanceFrame]);

  if (!currentFrame) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end"
      style={{ background: currentFrame.background || 'rgba(0,0,0,0.85)' }}
      onClick={advanceFrame}
    >
      <div
        className="mx-4 mb-4 p-4 rounded-lg border-2"
        style={{
          background: 'rgba(0,0,0,0.9)',
          borderColor: '#FFD700',
          minHeight: 100,
        }}
      >
        <div
          className="mb-2 font-bold"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(0.4rem, 1.2vw, 0.65rem)',
            color: '#FFD700',
          }}
        >
          {currentFrame.speaker}
        </div>
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(0.35rem, 1vw, 0.55rem)',
            color: '#FFFFFF',
            lineHeight: 1.8,
          }}
        >
          {displayedText}
          {isTyping && <span className="animate-pulse">▌</span>}
        </div>
      </div>
      <div
        className="text-center mb-2"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(0.25rem, 0.7vw, 0.4rem)',
          color: '#666',
        }}
      >
        {isTyping ? '' : 'TAP / ENTER TO CONTINUE'}
      </div>
    </div>
  );
}
