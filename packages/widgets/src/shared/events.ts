/* eslint @typescript-eslint/no-explicit-any:0 */
const NAMESPACE = `lasuite-widget`;

export const triggerEvent = (
  widgetName: string,
  eventName: string,
  detail?: Record<string, any>,
  root?: Window | Document | HTMLElement | null,
) => {
  return (root || document).dispatchEvent(
    new CustomEvent(`${NAMESPACE}-${widgetName}-${eventName}`, detail ? { detail } : undefined),
  );
};

export const listenEvent = (
  widgetName: string,
  eventName: string,
  root: Window | Document | HTMLElement | null,
  once: boolean,
  callback: (data: any) => void,
) => {
  const cb = (e: any) => callback(e.detail);
  const eventFullName = widgetName ? `${NAMESPACE}-${widgetName}-${eventName}` : eventName;
  (root || document).addEventListener(eventFullName, cb, once ? { once: true } : undefined);
  return () =>
    (root || document).removeEventListener(
      eventFullName,
      cb,
      once ? ({ once: true } as EventListenerOptions) : undefined,
    );
};
