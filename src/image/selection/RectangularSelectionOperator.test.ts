import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import { test } from "@jest/globals";

test("onMouseDown", () => {
  const selectionOperator = new RectangularSelectionOperator();

  selectionOperator.onMouseDown({ x: 0, y: 0 });

  expect(selectionOperator.selected).toBe(false);
  expect(selectionOperator.selecting).toBe(true);

  expect(selectionOperator.origin).toStrictEqual({ x: 0, y: 0 });

  expect(selectionOperator.width).toBe(undefined);
  expect(selectionOperator.height).toBe(undefined);
});

test("onMouseMove", () => {
  const selectionOperator = new RectangularSelectionOperator();

  selectionOperator.selecting = true;

  selectionOperator.origin = { x: 0, y: 0 };

  selectionOperator.onMouseMove({ x: 100, y: 100 });

  expect(selectionOperator.selected).toBe(false);
  expect(selectionOperator.selecting).toBe(true);

  expect(selectionOperator.origin).toStrictEqual({ x: 0, y: 0 });

  expect(selectionOperator.width).toBe(100);
  expect(selectionOperator.height).toBe(100);
});

test("onMouseUp", () => {
  const selectionOperator = new RectangularSelectionOperator();

  selectionOperator.selecting = true;

  selectionOperator.origin = { x: 0, y: 0 };

  selectionOperator.onMouseUp({ x: 100, y: 100 });

  expect(selectionOperator.selected).toBe(true);
  expect(selectionOperator.selecting).toBe(false);

  expect(selectionOperator.origin).toStrictEqual({ x: 0, y: 0 });

  expect(selectionOperator.width).toBe(100);
  expect(selectionOperator.height).toBe(100);
});
