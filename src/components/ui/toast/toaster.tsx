import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import type { SileoOptions, SileoPosition, SileoItem, SileoState } from "./types";
import { Toast } from "./Toast";

/* ------------------------------ Global State ------------------------------ */

type SileoListener = (toasts: SileoItem[]) => void;

const store = {
  toasts: [] as SileoItem[],
  listeners: new Set<SileoListener>(),
  position: "top-right" as SileoPosition,
  options: undefined as Partial<SileoOptions> | undefined,

  emit() {
    for (const fn of this.listeners) fn(this.toasts);
  },

  update(fn: (prev: SileoItem[]) => SileoItem[]) {
    this.toasts = fn(this.toasts);
    this.emit();
  },
};

let idCounter = 0;
const generateId = () => `${++idCounter}-${Date.now().toString(36)}`;

const DEFAULT_TOAST_DURATION = 4000;
const EXIT_DURATION = 300;

const dismissToast = (id: string) => {
  const item = store.toasts.find((t) => t.id === id);
  if (!item || item.exiting) return;

  store.update((prev) =>
    prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
  );

  setTimeout(
    () => store.update((prev) => prev.filter((t) => t.id !== id)),
    EXIT_DURATION,
  );
};

const createToast = (options: SileoOptions & { state?: SileoState; id?: string }) => {
  const merged = { ...store.options, ...options };
  const id = merged.id ?? `sileo-${generateId()}`;
  
  const item: SileoItem = {
    ...merged,
    id,
    instanceId: generateId(),
    position: merged.position ?? store.position,
  };

  store.update((p) => [...p.filter((t) => t.id !== id), item]);
  return { id, duration: merged.duration ?? DEFAULT_TOAST_DURATION };
};

const updateToast = (id: string, options: SileoOptions & { state?: SileoState; id?: string }) => {
  const existing = store.toasts.find((t) => t.id === id);
  if (!existing) return;

  const item: SileoItem = { ...existing, ...options, id, instanceId: generateId() };
  store.update((prev) => prev.map((t) => (t.id === id ? item : t)));
};

export interface SileoPromiseOptions<T = unknown> {
  loading: SileoOptions;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((err: unknown) => SileoOptions);
  action?: SileoOptions | ((data: T) => SileoOptions);
  position?: SileoPosition;
}

const parseOpts = (titleOrOpts: string | SileoOptions, opts?: SileoOptions): SileoOptions => {
  if (typeof titleOrOpts === 'string') {
    return { title: titleOrOpts, ...opts };
  }
  return titleOrOpts;
};

export const sileo = {
  show: (opts: string | SileoOptions, additionalOpts?: SileoOptions) => {
    const parsed = parseOpts(opts, additionalOpts);
    return createToast({ ...parsed, state: parsed.type }).id;
  },
  success: (opts: string | SileoOptions, additionalOpts?: SileoOptions) => createToast({ ...parseOpts(opts, additionalOpts), state: "success" }).id,
  error: (opts: string | SileoOptions, additionalOpts?: SileoOptions) => createToast({ ...parseOpts(opts, additionalOpts), state: "error" }).id,
  warning: (opts: string | SileoOptions, additionalOpts?: SileoOptions) => createToast({ ...parseOpts(opts, additionalOpts), state: "warning" }).id,
  info: (opts: string | SileoOptions, additionalOpts?: SileoOptions) => createToast({ ...parseOpts(opts, additionalOpts), state: "info" }).id,
  action: (opts: string | SileoOptions, additionalOpts?: SileoOptions) => createToast({ ...parseOpts(opts, additionalOpts), state: "action" }).id,

  promise: <T,>(
    promise: Promise<T> | (() => Promise<T>),
    opts: SileoPromiseOptions<T>,
  ): Promise<T> => {
    const { id } = createToast({
      ...opts.loading,
      state: "loading",
      duration: null,
      position: opts.position,
    });

    const p = typeof promise === "function" ? promise() : promise;

    p.then((data) => {
      if (opts.action) {
        const actionOpts = typeof opts.action === "function" ? opts.action(data) : opts.action;
        updateToast(id, { ...actionOpts, state: "action", id, duration: DEFAULT_TOAST_DURATION });
      } else {
        const successOpts = typeof opts.success === "function" ? opts.success(data) : opts.success;
        updateToast(id, { ...successOpts, state: "success", id, duration: DEFAULT_TOAST_DURATION });
      }
    }).catch((err) => {
      const errorOpts = typeof opts.error === "function" ? opts.error(err) : opts.error;
      updateToast(id, { ...errorOpts, state: "error", id, duration: DEFAULT_TOAST_DURATION });
    });

    return p;
  },

  dismiss: dismissToast,

  clear: (position?: SileoPosition) =>
    store.update((prev) => (position ? prev.filter((t) => t.position !== position) : [])),
};

/* ------------------------------ Toaster Component ------------------------- */

export interface SileoToasterProps {
  position?: SileoPosition;
  options?: Partial<SileoOptions>;
}

export function Toaster({ position = "bottom-right", options }: SileoToasterProps) {
  const [toasts, setToasts] = useState<SileoItem[]>(store.toasts);

  useEffect(() => {
    store.position = position;
    store.options = options;
  }, [position, options]);

  useEffect(() => {
    const listener: SileoListener = (next) => setToasts(next);
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
    };
  }, []);

  // Handle auto dismiss based on duration
  useEffect(() => {
    const timeouts = new Set<number>();
    
    for (const toast of toasts) {
      if (toast.exiting || toast.duration === null) continue;
      
      const dur = toast.duration ?? DEFAULT_TOAST_DURATION;
      if (dur <= 0) continue;
      
      const timeoutId = window.setTimeout(() => {
        dismissToast(toast.id);
      }, dur);
      
      timeouts.add(timeoutId);
    }
    
    return () => {
      for (const id of timeouts) clearTimeout(id);
    };
  }, [toasts]);

  const activePositions = useMemo(() => {
    const map = new Map<SileoPosition, SileoItem[]>();
    for (const t of toasts) {
      if (t.exiting) continue; // let AnimatePresence handle exit visually
      const pos = t.position ?? position;
      const arr = map.get(pos);
      if (arr) {
        arr.push(t);
      } else {
        map.set(pos, [t]);
      }
    }
    return map;
  }, [toasts, position]);

  return (
    <>
      {Array.from(activePositions.entries()).map(([pos, items]) => {
        const isTop = pos.startsWith("top");
        const isLeft = pos.endsWith("left");
        const isRight = pos.endsWith("right");
        
        const positionClasses = [
          "fixed z-[9999] flex w-full flex-col gap-3 px-4 sm:px-6 pointer-events-none max-w-[380px]",
          isTop ? "top-4 sm:top-6" : "bottom-4 sm:bottom-6",
          isLeft ? "left-0 items-start" : isRight ? "right-0 items-end" : "left-1/2 -translate-x-1/2 items-center"
        ].join(" ");

        return (
          <div key={pos} className={positionClasses}>
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <Toast key={item.id} item={item} onDismiss={dismissToast} />
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}
