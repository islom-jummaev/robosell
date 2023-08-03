const nativeMax = Math.max;
const nativeMin = Math.min;
const FUNC_ERROR_TEXT = "FUNC_ERROR_TEXT";

export function debounce(func: any, wait: any, options?: any): any {
  let lastArgs: any,
    lastThis: any,
    maxWait: any,
    result: any,
    timerId: any,
    lastCallTime: any,
    lastInvokeTime = 0,
    leading = false,
    maxing = false,
    trailing = true;
  if (typeof func !== "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = Number(wait) || 0;
  if (typeof options === "object") {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(Number(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  // @ts-ignore
  function invokeFunc(time) {
    // @ts-ignore
    const args = lastArgs,
      thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  // @ts-ignore
  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    // @ts-ignore
    return leading ? invokeFunc(time) : result;
  }

  // @ts-ignore
  function remainingWait(time) {
    // @ts-ignore
    const timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime,
      result = wait - timeSinceLastCall;
    console.log("remainingWait");
    // @ts-ignore
    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  // @ts-ignore
  function shouldInvoke(time) {
    // @ts-ignore
    const timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime;
    // Either this is the first call, activity has stopped and we're at the trailing
    // edge, the system time has gone backwards and we're treating it as the
    // trailing edge, or we've hit the `maxWait` limit.
    return (
      // @ts-ignore
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  // @ts-ignore
  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been debounced at
    // least once.
    // @ts-ignore
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    // @ts-ignore
    return result;
  }

  function cancel() {
    // @ts-ignore
    if (timerId !== undefined) {
      // @ts-ignore
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    // @ts-ignore
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced() {
    const time = Date.now(),
      isInvoking = shouldInvoke(time);
    // eslint-disable-next-line prefer-rest-params
    lastArgs = arguments;
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      // @ts-ignore
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    // @ts-ignore
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    // @ts-ignore
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
