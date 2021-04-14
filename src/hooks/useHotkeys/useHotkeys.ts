import hotkeys, { HotkeysEvent, KeyHandler } from "hotkeys-js";
import React, { useCallback, useEffect, useRef } from "react";

type AvailableTags = "INPUT" | "TEXTAREA" | "SELECT";

// We implement our own custom filter system.
hotkeys.filter = () => true;

const tagFilter = (
  { target }: KeyboardEvent,
  enableOnTags?: AvailableTags[]
) => {
  const targetTagName = target && (target as HTMLElement).tagName;

  return Boolean(
    targetTagName &&
      enableOnTags &&
      enableOnTags.includes(targetTagName as AvailableTags)
  );
};

const isKeyboardEventTriggeredByInput = (event: KeyboardEvent) => {
  return tagFilter(event, ["INPUT", "TEXTAREA", "SELECT"]);
};

export type Options = {
  enabled?: boolean;
  filter?: typeof hotkeys.filter;
  filterPreventDefault?: boolean;
  enableOnTags?: AvailableTags[];
  splitKey?: string;
  scope?: string;
  keyup?: boolean;
  keydown?: boolean;
};

export function useHotkeys<T extends Element>(
  keys: string,
  callback: KeyHandler,
  options?: Options
): React.MutableRefObject<T | null>;
export function useHotkeys<T extends Element>(
  keys: string,
  callback: KeyHandler,
  deps?: any[]
): React.MutableRefObject<T | null>;
export function useHotkeys<T extends Element>(
  keys: string,
  callback: KeyHandler,
  options?: Options,
  deps?: any[]
): React.MutableRefObject<T | null>;
export function useHotkeys<T extends Element>(
  keys: string,
  callback: KeyHandler,
  options?: any[] | Options,
  deps?: any[]
): React.MutableRefObject<T | null> {
  if (options instanceof Array) {
    deps = options;
    options = undefined;
  }

  const {
    enableOnTags,
    filter,
    keyup,
    keydown,
    filterPreventDefault = true,
    enabled = true,
  } = (options as Options) || {};
  const ref = useRef<T | null>(null);

  const memoisedCallback = useCallback(
    (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
      if (filter && !filter(keyboardEvent)) {
        return !filterPreventDefault;
      }

      if (
        (isKeyboardEventTriggeredByInput(keyboardEvent) &&
          !tagFilter(keyboardEvent, enableOnTags)) ||
        (keyboardEvent.target as HTMLElement)?.isContentEditable
      ) {
        return true;
      }

      if (ref.current === null || document.activeElement === ref.current) {
        callback(keyboardEvent, hotkeysEvent);
        return true;
      }

      return false;
    },
    deps ? [ref, enableOnTags, filter, ...deps] : [ref, enableOnTags, filter]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (keyup && keydown !== true) {
      (options as Options).keydown = false;
    }

    hotkeys(keys, (options as Options) || {}, memoisedCallback);

    return () => hotkeys.unbind(keys, memoisedCallback);
  }, [memoisedCallback, options, keys, enabled]);

  return ref;
}
