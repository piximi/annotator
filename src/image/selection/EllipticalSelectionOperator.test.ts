import { EllipticalSelectionOperator } from "./EllipticalSelectionOperator";
import { test } from "@jest/globals";

test("deselect", () => {
  const ellipticalSelectionOperator = new EllipticalSelectionOperator();

  ellipticalSelectionOperator.selected = true;

  ellipticalSelectionOperator.center = { x: 50, y: 50 };
  ellipticalSelectionOperator.origin = { x: 0, y: 0 };
  ellipticalSelectionOperator.radius = { x: 50, y: 50 };

  ellipticalSelectionOperator.deselect();

  expect(ellipticalSelectionOperator.selected).toBe(false);
  expect(ellipticalSelectionOperator.selecting).toBe(false);

  expect(ellipticalSelectionOperator.selection).toBe(undefined);

  expect(ellipticalSelectionOperator.center).toStrictEqual(undefined);
  expect(ellipticalSelectionOperator.origin).toStrictEqual(undefined);
  expect(ellipticalSelectionOperator.radius).toStrictEqual(undefined);
});

test("onMouseDown", () => {
  const ellipticalSelectionOperator = new EllipticalSelectionOperator();

  ellipticalSelectionOperator.onMouseDown({ x: 0, y: 0 });

  expect(ellipticalSelectionOperator.selected).toBe(false);
  expect(ellipticalSelectionOperator.selecting).toBe(true);

  expect(ellipticalSelectionOperator.selection).toBe(undefined);

  expect(ellipticalSelectionOperator.center).toStrictEqual(undefined);
  expect(ellipticalSelectionOperator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(ellipticalSelectionOperator.radius).toStrictEqual(undefined);
});

test("onMouseMove", () => {
  const ellipticalSelectionOperator = new EllipticalSelectionOperator();

  ellipticalSelectionOperator.selecting = true;

  ellipticalSelectionOperator.origin = { x: 0, y: 0 };

  ellipticalSelectionOperator.onMouseMove({ x: 100, y: 100 });

  expect(ellipticalSelectionOperator.selected).toBe(false);
  expect(ellipticalSelectionOperator.selecting).toBe(true);

  expect(ellipticalSelectionOperator.selection).toBe(undefined);

  expect(ellipticalSelectionOperator.center).toStrictEqual({ x: 50, y: 50 });
  expect(ellipticalSelectionOperator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(ellipticalSelectionOperator.radius).toStrictEqual({ x: 50, y: 50 });
});

test("onMouseUp", () => {
  const ellipticalSelectionOperator = new EllipticalSelectionOperator();

  ellipticalSelectionOperator.selecting = true;

  ellipticalSelectionOperator.origin = { x: 0, y: 0 };

  ellipticalSelectionOperator.onMouseUp({ x: 100, y: 100 });

  expect(ellipticalSelectionOperator.selected).toBe(true);
  expect(ellipticalSelectionOperator.selecting).toBe(false);

  expect(ellipticalSelectionOperator.selection).toBe(undefined);

  expect(ellipticalSelectionOperator.center).toStrictEqual({ x: 50, y: 50 });
  expect(ellipticalSelectionOperator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(ellipticalSelectionOperator.radius).toStrictEqual({ x: 50, y: 50 });
});

test("select", () => {
  const ellipticalSelectionOperator = new EllipticalSelectionOperator();

  ellipticalSelectionOperator.selected = true;

  ellipticalSelectionOperator.center = { x: 50, y: 50 };
  ellipticalSelectionOperator.origin = { x: 0, y: 0 };
  ellipticalSelectionOperator.radius = { x: 50, y: 50 };

  ellipticalSelectionOperator.select(0);

  expect(ellipticalSelectionOperator.selected).toBe(true);
  expect(ellipticalSelectionOperator.selecting).toBe(false);

  expect(ellipticalSelectionOperator.selection).toStrictEqual({
    boundingBox: [0, 0, 100, 100],
    categoryId: 0,
    mask: "mask",
  });

  expect(ellipticalSelectionOperator.boundingBox).toStrictEqual([
    0,
    0,
    100,
    100,
  ]);
  expect(ellipticalSelectionOperator.mask).toBe("mask");

  expect(ellipticalSelectionOperator.center).toStrictEqual({ x: 50, y: 50 });
  expect(ellipticalSelectionOperator.origin).toStrictEqual({ x: 0, y: 0 });
  expect(ellipticalSelectionOperator.radius).toStrictEqual({ x: 50, y: 50 });
});
