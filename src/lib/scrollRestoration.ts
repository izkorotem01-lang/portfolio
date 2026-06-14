const STORAGE_KEY = "rizz:scroll";

type ScrollState = {
  path: string;
  x: number;
  y: number;
};

const scrollPath = () => `${window.location.pathname}${window.location.hash}`;

export const saveScrollPosition = () => {
  const state: ScrollState = {
    path: scrollPath(),
    x: window.scrollX,
    y: window.scrollY,
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const restoreScrollPosition = (): boolean => {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) {
    const target = document.getElementById(hash);
    if (target) {
      target.scrollIntoView({ block: "start" });
      return true;
    }
  }

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const state = JSON.parse(raw) as ScrollState;
    if (state.path !== scrollPath()) return false;
    window.scrollTo(state.x, state.y);
    return true;
  } catch {
    return false;
  }
};
