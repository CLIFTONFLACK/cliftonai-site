import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// No DOM library is installed, so the component's handlers are exercised by
// calling MascotVideo as a plain function with React's useRef replaced by a
// fake that hands out our own dialog and video stand-ins (first call = dialog
// ref, second call = video ref, the order the component declares them). The
// returned element tree carries the real onClick/onCancel/onClose closures.
// This file mocks "react", so it must not render with react-dom.

type AnyEl = { type: unknown; props: Record<string, unknown> };
type Handler = (e?: unknown) => void;

type Fakes = {
  calls: string[];
  dialog: { showModal: () => void; close: () => void };
  video: { play: () => Promise<void>; pause: () => void; currentTime: number };
  tree: AnyEl;
};

let MascotVideo: (props: { className?: string; children: unknown }) => AnyEl;
let dialogStub: Fakes["dialog"];
let videoStub: Fakes["video"];
let refCalls = 0;
let playImpl: () => Promise<void>;
let calls: string[];

test.before(async () => {
  // Everything else in react stays real: the JSX runtime reads its internals.
  const realReact = createRequire(import.meta.url)("react");
  const fakeUseRef = () => {
    refCalls += 1;
    // Declaration order: dialog, video, then the press-began-on-backdrop flag.
    const slot = refCalls % 3;
    return { current: slot === 1 ? dialogStub : slot === 2 ? videoStub : false };
  };
  mock.module("react", {
    exports: { ...realReact, useRef: fakeUseRef, default: { ...realReact, useRef: fakeUseRef } },
  });
  ({ MascotVideo } = (await import("../mascot-video.tsx")) as never);
});

function setup(opts: { play?: () => Promise<void> } = {}): Fakes {
  calls = [];
  refCalls = 0;
  playImpl = opts.play ?? (() => Promise.resolve());
  dialogStub = {
    showModal: () => calls.push("showModal"),
    close: () => calls.push("close"),
  };
  videoStub = {
    play: () => {
      calls.push("play");
      return playImpl();
    },
    pause: () => calls.push("pause"),
    currentTime: 42,
  };
  const tree = MascotVideo({ children: "kid" });
  return { calls, dialog: dialogStub, video: videoStub, tree };
}

function parts(tree: AnyEl) {
  const [trigger, dialog] = (tree.props as { children: AnyEl[] }).children;
  const [video, closeBtn] = (dialog.props as { children: AnyEl[] }).children;
  return { trigger, dialog, video, closeBtn };
}
const on = (el: AnyEl, name: string) => el.props[name] as Handler;

test("clicking the trigger opens the modal dialog and starts the video", () => {
  const { tree } = setup();

  on(parts(tree).trigger, "onClick")();

  assert.deepEqual(calls, ["showModal", "play"]);
});

test("a rejected play() is swallowed, leaving the controls to start it", async () => {
  const { tree } = setup({ play: () => Promise.reject(new Error("NotAllowedError")) });

  on(parts(tree).trigger, "onClick")();
  await new Promise((r) => setImmediate(r));

  assert.deepEqual(calls, ["showModal", "play"]);
});

test("the close button closes the dialog, pauses and rewinds to zero", () => {
  const { tree, video } = setup();

  on(parts(tree).closeBtn, "onClick")();

  assert.deepEqual(calls, ["close", "pause"]);
  assert.equal(video.currentTime, 0);
});

test("clicking the backdrop (target is the dialog itself) closes, pauses and rewinds", () => {
  const { tree, video } = setup();
  const self = {};

  on(parts(tree).dialog, "onPointerDown")({ target: self, currentTarget: self });
  on(parts(tree).dialog, "onClick")({ target: self, currentTarget: self });

  assert.deepEqual(calls, ["close", "pause"]);
  assert.equal(video.currentTime, 0);
});

test("a press that began on the video and was released on the backdrop does not close", () => {
  const { tree, video } = setup();
  const self = {};

  // mousedown on the seek bar (a child), mouseup outside: the click lands on the dialog.
  on(parts(tree).dialog, "onPointerDown")({ target: {}, currentTarget: self });
  on(parts(tree).dialog, "onClick")({ target: self, currentTarget: self });

  assert.deepEqual(calls, []);
  assert.equal(video.currentTime, 42);
});

test("a click on the backdrop with no recorded press does not close", () => {
  const { tree } = setup();
  const self = {};

  on(parts(tree).dialog, "onClick")({ target: self, currentTarget: self });

  assert.deepEqual(calls, []);
});

test("clicking inside the dialog (target is a child) does not close or pause", () => {
  const { tree, video } = setup();

  on(parts(tree).dialog, "onClick")({ target: {}, currentTarget: {} });

  assert.deepEqual(calls, []);
  assert.equal(video.currentTime, 42);
});

test("Escape (onCancel) pauses and rewinds without calling close again", () => {
  const { tree, video } = setup();

  on(parts(tree).dialog, "onCancel")();

  assert.deepEqual(calls, ["pause"]);
  assert.equal(video.currentTime, 0);
});

test("the dialog close event (onClose) pauses and rewinds", () => {
  const { tree, video } = setup();

  on(parts(tree).dialog, "onClose")();

  assert.deepEqual(calls, ["pause"]);
  assert.equal(video.currentTime, 0);
});

test("stopping before the refs are attached does not throw", () => {
  const { tree } = setup();
  dialogStub = undefined as never;
  videoStub = undefined as never;
  refCalls = 0;
  const bare = MascotVideo({ children: "kid" });

  assert.doesNotThrow(() => on(parts(bare).trigger, "onClick")());
  assert.doesNotThrow(() => on(parts(bare).closeBtn, "onClick")());
  assert.doesNotThrow(() => on(parts(bare).dialog, "onClose")());
  assert.ok(tree);
});
