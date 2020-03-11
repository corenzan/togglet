import { queryToggletByHandle, queryHandleByTogglet } from "./index";

describe("togglet", () => {
  const togglet = document.createElement("div");
  togglet.id = "togglet";
  togglet.dataset.togglet = "closed";
  document.body.appendChild(togglet);

  const handle = document.createElement("button");
  handle.dataset.toggletId = togglet.id;
  handle.dataset.toggletHandle = "";
  document.body.appendChild(handle);

  test("queryToggletByHandle", () => {
    expect(queryToggletByHandle(handle)).toBe(togglet);
  });

  test("queryHandleByTogglet", () => {
    expect(queryHandleByTogglet(togglet)).toContain(handle);
  });
});
