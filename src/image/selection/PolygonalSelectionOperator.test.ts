import { test } from "@jest/globals";
import { PolygonalSelectionOperator } from "./PolygonalSelectionOperator";

// test("deselect", () => {
//   const operator = new PolygonalSelectionOperator();
//
//   operator.selected = true;
//
//   operator.origin = { x: 0, y: 0 };
//
//   operator.width = 100;
//   operator.height = 100;
//
//   operator.deselect();
//
//   expect(operator.selected).toBe(false);
//   expect(operator.selecting).toBe(false);
//
//   expect(operator.selection).toBe(undefined);
//
//   expect(operator.origin).toStrictEqual(undefined);
//
//   expect(operator.width).toBe(undefined);
//   expect(operator.height).toBe(undefined);
// });

test("onMouseDown", () => {
  const operator = new PolygonalSelectionOperator();

  operator.onMouseDown({ x: 0, y: 0 });

  expect(operator.selected).toBe(false);
  expect(operator.selecting).toBe(true);

  expect(operator.selection).toBe(undefined);

  expect(operator.anchor).toStrictEqual(undefined);
  expect(operator.buffer).toStrictEqual([]);
  expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(operator.points).toStrictEqual([]);
});

test("onMouseDown (subsequent, unconnected)", () => {
  const operator = new PolygonalSelectionOperator();

  operator.origin = { x: 0, y: 0 };

  operator.onMouseDown({ x: 100, y: 0 });

  expect(operator.selected).toBe(false);
  expect(operator.selecting).toBe(true);

  expect(operator.selection).toBe(undefined);

  expect(operator.anchor).toStrictEqual(undefined);
  expect(operator.buffer).toStrictEqual([]);
  expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(operator.points).toStrictEqual([]);
});

test("onMouseDown (subsequent, connected)", () => {
  const operator = new PolygonalSelectionOperator();

  operator.anchor = { x: 0, y: 100 };
  operator.buffer = [0, 0, 100, 0, 100, 100, 0, 100];
  operator.origin = { x: 0, y: 0 };

  operator.onMouseDown({ x: 1, y: 1 });

  expect(operator.selected).toBe(true);
  expect(operator.selecting).toBe(false);

  expect(operator.selection).toBe(undefined);

  expect(operator.anchor).toStrictEqual(undefined);
  expect(operator.buffer).toStrictEqual([]);
  expect(operator.origin).toStrictEqual(undefined);
  expect(operator.points).toStrictEqual([0, 0, 100, 0, 100, 100, 0, 100]);
});

// test("onMouseMove", () => {
//   const operator = new PolygonalSelectionOperator();
//
//   operator.selecting = true;
//
//   operator.origin = { x: 0, y: 0 };
//
//   operator.onMouseMove({ x: 100, y: 100 });
//
//   expect(operator.selected).toBe(false);
//   expect(operator.selecting).toBe(true);
//
//   expect(operator.selection).toBe(undefined);
//
//   expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
//
//   expect(operator.width).toBe(100);
//   expect(operator.height).toBe(100);
// });
//
// test("onMouseUp", () => {
//   const operator = new PolygonalSelectionOperator();
//
//   operator.selecting = true;
//
//   operator.origin = { x: 0, y: 0 };
//
//   operator.onMouseUp({ x: 100, y: 100 });
//
//   expect(operator.selected).toBe(true);
//   expect(operator.selecting).toBe(false);
//
//   expect(operator.selection).toBe(undefined);
//
//   expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
//
//   expect(operator.width).toBe(100);
//   expect(operator.height).toBe(100);
// });
//
// test("select", () => {
//   const operator = new PolygonalSelectionOperator();
//
//   operator.selected = true;
//
//   operator.origin = { x: 0, y: 0 };
//
//   operator.width = 100;
//   operator.height = 100;
//
//   operator.select(0);
//
//   expect(operator.selected).toBe(true);
//   expect(operator.selecting).toBe(false);
//
//   expect(operator.selection).toStrictEqual({
//     boundingBox: [0, 0, 100, 100],
//     categoryId: 0,
//     mask: "mask",
//   });
//
//   expect(operator.boundingBox).toStrictEqual([0, 0, 100, 100]);
//   expect(operator.mask).toBe("mask");
//
//   expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
//
//   expect(operator.width).toBe(100);
//   expect(operator.height).toBe(100);
// });
