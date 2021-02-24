import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import { test } from "@jest/globals";
import { Category } from "../../types/Category";
import * as ImageJS from "image-js";

test("deselect", () => {
  const image = new ImageJS.Image(224, 224);

  const selectionOperator = new RectangularSelectionOperator(image);

  selectionOperator.selected = true;

  selectionOperator.origin = { x: 0, y: 0 };

  selectionOperator.width = 100;
  selectionOperator.height = 100;

  selectionOperator.deselect();

  expect(selectionOperator.selected).toBe(false);
  expect(selectionOperator.selecting).toBe(false);

  expect(selectionOperator.selection).toBe(undefined);

  expect(selectionOperator.origin).toStrictEqual(undefined);

  expect(selectionOperator.width).toBe(undefined);
  expect(selectionOperator.height).toBe(undefined);
});

test("onMouseDown", () => {
  const image = new ImageJS.Image(224, 224);

  const selectionOperator = new RectangularSelectionOperator(image);

  selectionOperator.onMouseDown({ x: 0, y: 0 });

  expect(selectionOperator.selected).toBe(false);
  expect(selectionOperator.selecting).toBe(true);

  expect(selectionOperator.selection).toBe(undefined);

  expect(selectionOperator.origin).toStrictEqual({ x: 0, y: 0 });

  expect(selectionOperator.width).toBe(undefined);
  expect(selectionOperator.height).toBe(undefined);
});

test("onMouseMove", () => {
  const image = new ImageJS.Image(224, 224);

  const selectionOperator = new RectangularSelectionOperator(image);

  selectionOperator.selecting = true;

  selectionOperator.origin = { x: 0, y: 0 };

  selectionOperator.onMouseMove({ x: 100, y: 100 });

  expect(selectionOperator.selected).toBe(false);
  expect(selectionOperator.selecting).toBe(true);

  expect(selectionOperator.selection).toBe(undefined);

  expect(selectionOperator.origin).toStrictEqual({ x: 0, y: 0 });

  expect(selectionOperator.width).toBe(100);
  expect(selectionOperator.height).toBe(100);
});

test("onMouseUp", () => {
  const image = new ImageJS.Image(224, 224);

  const selectionOperator = new RectangularSelectionOperator(image);

  selectionOperator.selecting = true;

  selectionOperator.origin = { x: 0, y: 0 };

  selectionOperator.onMouseUp({ x: 100, y: 100 });

  expect(selectionOperator.selected).toBe(true);
  expect(selectionOperator.selecting).toBe(false);

  expect(selectionOperator.selection).toBe(undefined);

  expect(selectionOperator.origin).toStrictEqual({ x: 0, y: 0 });

  expect(selectionOperator.width).toBe(100);
  expect(selectionOperator.height).toBe(100);
});

test("select", () => {
  const image = new ImageJS.Image(224, 224);

  const selectionOperator = new RectangularSelectionOperator(image);

  selectionOperator.selected = true;

  selectionOperator.origin = { x: 0, y: 0 };

  selectionOperator.width = 100;
  selectionOperator.height = 100;

  const category: Category = {
    color: "#0000FF",
    id: "5ed3511d-1223-4bba-a0c2-2b3897232d98",
    name: "foo",
    visible: true,
  };
  selectionOperator.select(category);

  expect(selectionOperator.selected).toBe(true);
  expect(selectionOperator.selecting).toBe(false);

  expect(selectionOperator.selection).toStrictEqual({
    boundingBox: [0, 0, 100, 100],
    categoryId: "5ed3511d-1223-4bba-a0c2-2b3897232d98",
    mask: "mask",
  });

  expect(selectionOperator.boundingBox).toStrictEqual([0, 0, 100, 100]);
  expect(selectionOperator.mask).toBe("mask");

  expect(selectionOperator.origin).toStrictEqual({ x: 0, y: 0 });

  expect(selectionOperator.width).toBe(100);
  expect(selectionOperator.height).toBe(100);
});
