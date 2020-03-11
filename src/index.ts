/**
 * Query the togglet that `handle` controls.
 *
 * @export
 * @param {Element} handle
 * @returns {Element}
 */
export function queryToggletByHandle(handle: Element): Element {
  const id = handle.getAttribute("data-togglet-id");
  if (id) {
    return document.getElementById(id);
  }
  return handle.closest("[data-togglet]");
}

/**
 * Query all handles that control `togglet`.
 *
 * @export
 * @param {Element} togglet
 * @returns {Element[]}
 */
export function queryHandleByTogglet(togglet: Element): Element[] {
  return [].slice
    .call(document.querySelectorAll("[data-togglet-handle]"))
    .filter((handle: Element) => {
      return queryToggletByHandle(handle) === togglet;
    });
}

/**
 * Change `togglet` state to "open", notify handles and dispatch event.
 *
 * @export
 * @param {Element} togglet
 */
export function openTogglet(togglet: Element): void {
  togglet.setAttribute("data-togglet", "open");
  queryHandleByTogglet(togglet).forEach(handle => {
    if (handle.hasAttribute("aria-expanded")) {
      handle.setAttribute("aria-expanded", "true");
    }
  });
  togglet.dispatchEvent(new CustomEvent("togglet:open", { bubbles: true }));
}

/**
 * Change `togglet` state to "closed", notify handles and dispatch event.
 *
 * @export
 * @param {Element} togglet
 */
export function closeTogglet(togglet: Element): void {
  togglet.setAttribute("data-togglet", "closed");
  queryHandleByTogglet(togglet).forEach(handle => {
    if (handle.hasAttribute("aria-expanded")) {
      handle.setAttribute("aria-expanded", "false");
    }
  });
  togglet.dispatchEvent(new CustomEvent("togglet:close", { bubbles: true }));
}

/**
 * Toggle `togglet` state between "open" and "close", notify handles and dispatch event.
 *
 * @export
 * @param {Element} togglet
 */
export function toggleTogglet(togglet: Element): void {
  const state = togglet.getAttribute("data-togglet");
  if (state === "closed") {
    openTogglet(togglet);
  } else {
    closeTogglet(togglet);
  }
}

/**
 * Query `togglet` ancestry stack.
 *
 * @param {Element} [togglet]
 * @returns {Element[]}
 */
function getToggletStack(togglet?: Element): Element[] {
  const stack = [];
  let next = togglet;
  while (next && next.parentElement) {
    stack.push(next);
    next = next.parentElement.closest("[data-togglet]");
  }
  return stack;
}

/**
 * Close all open togglets that are not `togglet` or in its stack.
 *
 * @param {Element} [togglet]
 */
function closeAllOtherTogglet(togglet?: Element): void {
  const stack = getToggletStack(togglet);
  [].forEach.call(
    document.querySelectorAll("[data-togglet=open]"),
    (togglet: Element) => {
      if (
        stack.includes(togglet) ||
        togglet.hasAttribute("data-togglet-pinned")
      ) {
        return;
      }
      closeTogglet(togglet);
    }
  );
}

/**
 * Triggers togglet handle.
 *
 * @param {Element} handle
 */
function activateHandle(handle: Element): void {
  const togglet = queryToggletByHandle(handle);
  const mode = handle.getAttribute("data-togglet-handle");
  if (mode === "toggle") {
    toggleTogglet(togglet);
  } else if (mode === "close") {
    closeTogglet(togglet);
  } else {
    openTogglet(togglet);
  }
}

/**
 * Intercept clicks inside togglets and togglet handles.
 */
document.addEventListener("click", e => {
  const target = e.target as Element;

  const togglet = target.closest("[data-togglet]");
  if (togglet) {
    closeAllOtherTogglet(togglet);
  }

  const handle = target.closest("[data-togglet-handle]");
  if (handle) {
    activateHandle(handle);
  }
});

/**
 * Close open togglets when Escape is pressed.
 */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeAllOtherTogglet();
  }
});
