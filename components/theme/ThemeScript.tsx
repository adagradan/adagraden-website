/**
 * Applies a saved theme choice before first paint, so a returning visitor in
 * dark mode never sees a white flash. No saved choice → the CSS follows the
 * operating-system setting.
 */
const script = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}})();`;

export function ThemeScript() {
  return (
    <script
      // text/plain on the client so React doesn't re-run or warn on soft navigations
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
