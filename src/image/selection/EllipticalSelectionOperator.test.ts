import { EllipticalSelectionOperator } from "./EllipticalSelectionOperator";
import { test } from "@jest/globals";

test("deselect", () => {
  const operator = new EllipticalSelectionOperator();

  operator.selected = true;

  operator.center = { x: 50, y: 50 };
  operator.origin = { x: 0, y: 0 };
  operator.radius = { x: 50, y: 50 };

  operator.deselect();

  expect(operator.selected).toBe(false);
  expect(operator.selecting).toBe(false);

  expect(operator.selection).toBe(undefined);

  expect(operator.center).toStrictEqual(undefined);
  expect(operator.origin).toStrictEqual(undefined);
  expect(operator.radius).toStrictEqual(undefined);
});

test("onMouseDown", () => {
  const operator = new EllipticalSelectionOperator();

  operator.onMouseDown({ x: 0, y: 0 });

  expect(operator.selected).toBe(false);
  expect(operator.selecting).toBe(true);

  expect(operator.selection).toBe(undefined);

  expect(operator.center).toStrictEqual(undefined);
  expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(operator.radius).toStrictEqual(undefined);
});

test("onMouseMove", () => {
  const operator = new EllipticalSelectionOperator();

  operator.selecting = true;

  operator.origin = { x: 0, y: 0 };

  operator.onMouseMove({ x: 100, y: 100 });

  expect(operator.selected).toBe(false);
  expect(operator.selecting).toBe(true);

  expect(operator.selection).toBe(undefined);

  expect(operator.center).toStrictEqual({ x: 50, y: 50 });
  expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(operator.radius).toStrictEqual({ x: 50, y: 50 });
});

test("onMouseUp", () => {
  const operator = new EllipticalSelectionOperator();

  operator.selecting = true;

  operator.origin = { x: 0, y: 0 };

  operator.onMouseUp({ x: 100, y: 100 });

  expect(operator.selected).toBe(true);
  expect(operator.selecting).toBe(false);

  expect(operator.selection).toBe(undefined);

  expect(operator.center).toStrictEqual({ x: 50, y: 50 });
  expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(operator.radius).toStrictEqual({ x: 50, y: 50 });
});

test("select", () => {
  const operator = new EllipticalSelectionOperator();

  operator.selected = true;

  operator.center = { x: 50, y: 50 };
  operator.origin = { x: 0, y: 0 };
  operator.radius = { x: 50, y: 50 };

  operator.select(0);

  expect(operator.selected).toBe(true);
  expect(operator.selecting).toBe(false);

  expect(operator.selection).toStrictEqual({
    boundingBox: [0, 0, 100, 100],
    categoryId: 0,
    mask: "mask",
  });

  expect(operator.boundingBox).toStrictEqual([0, 0, 100, 100]);
  expect(operator.mask).toBe("mask");

  expect(operator.center).toStrictEqual({ x: 50, y: 50 });
  expect(operator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(operator.radius).toStrictEqual({ x: 50, y: 50 });
});
