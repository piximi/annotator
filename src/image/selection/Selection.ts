import { ImageViewerSelection } from "../../types/ImageViewerSelection";

export abstract class Selection {
  selected: boolean = false;

  selecting: boolean = false;

  selection?: ImageViewerSelection;

  abstract get box(): [number, number, number, number] | undefined;

  abstract get mask(): string | undefined;

  abstract deselect(): void;

  abstract onMouseDown(position: { x: number; y: number }): void;

  abstract onMouseMove(position: { x: number; y: number }): void;

  abstract onMouseUp(position: { x: number; y: number }): void;

  abstract select(category: number): void;
}
