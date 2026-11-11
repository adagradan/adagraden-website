/**
 * Runs synchronously before first paint (see Next "Preventing flash before
 * hydration" guide). Turns motion on only when the user allows it, so content
 * is never hidden for reduced-motion users or if JS fails: a watchdog turns
 * motion back off if <MotionProvider/> hasn't mounted within 3s.
 */
const script = `(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.dataset.motion='on';setTimeout(function(){if(!window.__motionReady){delete d.dataset.motion}},3000)}catch(e){}})();`;

export function MotionScript() {
  return (
    <script
      // text/plain on the client so React doesn't re-run or warn on soft navigations
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
