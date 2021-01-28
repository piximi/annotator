import { EllipticalSelectionOperator } from "./EllipticalSelectionOperator";
import { test } from "@jest/globals";

// test("deselect", () => {
//   const selectionOperator = new EllipticalSelectionOperator();
//
//   selectionOperator.selected = true;
//
//   selectionOperator.origin = { x: 0, y: 0 };
//
//   selectionOperator.width = 100;
//   selectionOperator.height = 100;
//
//   selectionOperator.deselect();
//
//   expect(selectionOperator.selected).toBe(false);
//   expect(selectionOperator.selecting).toBe(false);
//
//   expect(selectionOperator.selection).toBe(undefined);
//
//   expect(selectionOperator.origin).toStrictEqual(undefined);
//
//   expect(selectionOperator.width).toBe(undefined);
//   expect(selectionOperator.height).toBe(undefined);
// });

test("onMouseDown", () => {
  const ellipticalSelectionOperator = new EllipticalSelectionOperator();

  ellipticalSelectionOperator.onMouseDown({ x: 0, y: 0 });

  expect(ellipticalSelectionOperator.selected).toBe(false);
  expect(ellipticalSelectionOperator.selecting).toBe(true);

  expect(ellipticalSelectionOperator.selection).toBe(undefined);

  expect(ellipticalSelectionOperator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(ellipticalSelectionOperator.radius).toStrictEqual(undefined);
  expect(ellipticalSelectionOperator.center).toStrictEqual(undefined);
});

test("onMouseMove", () => {
  const ellipticalSelectionOperator = new EllipticalSelectionOperator();

  ellipticalSelectionOperator.selecting = true;

  ellipticalSelectionOperator.origin = { x: 0, y: 0 };

  ellipticalSelectionOperator.onMouseMove({ x: 100, y: 100 });

  expect(ellipticalSelectionOperator.selected).toBe(false);
  expect(ellipticalSelectionOperator.selecting).toBe(true);

  expect(ellipticalSelectionOperator.selection).toBe(undefined);

  expect(ellipticalSelectionOperator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(ellipticalSelectionOperator.radius).toStrictEqual({ x: 50, y: 50 });
  expect(ellipticalSelectionOperator.center).toStrictEqual({ x: 50, y: 50 });
});

test("onMouseUp", () => {
  const ellipticalSelectionOperator = new EllipticalSelectionOperator();

  ellipticalSelectionOperator.selecting = true;

  ellipticalSelectionOperator.origin = { x: 0, y: 0 };

  ellipticalSelectionOperator.onMouseUp({ x: 100, y: 100 });

  expect(ellipticalSelectionOperator.selected).toBe(true);
  expect(ellipticalSelectionOperator.selecting).toBe(false);

  expect(ellipticalSelectionOperator.selection).toBe(undefined);

  expect(ellipticalSelectionOperator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(ellipticalSelectionOperator.radius).toStrictEqual({ x: 50, y: 50 });
  expect(ellipticalSelectionOperator.center).toStrictEqual({ x: 50, y: 50 });
});

// test("select", () => {
//   const selectionOperator = new EllipticalSelectionOperator();
//
//   selectionOperator.selected = true;
//
//   selectionOperator.origin = { x: 0, y: 0 };
//
//   selectionOperator.width = 100;
//   selectionOperator.height = 100;
//
//   selectionOperator.select(0);
//
//   expect(selectionOperator.selected).toBe(true);
//   expect(selectionOperator.selecting).toBe(false);
//
//   expect(selectionOperator.selection).toStrictEqual({
//     box: [0, 0, 100, 100],
//     category: 0,
//     mask: "mask",
//   });
//
//   expect(selectionOperator.boundingBox).toStrictEqual([0, 0, 100, 100]);
//   expect(selectionOperator.mask).toBe("mask");
//
//   expect(selectionOperator.origin).toStrictEqual({ x: 0, y: 0 });
//
//   expect(selectionOperator.width).toBe(100);
//   expect(selectionOperator.height).toBe(100);
// });
