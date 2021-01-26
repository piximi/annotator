export abstract class Selection {
  public selected: boolean = false;

  public selecting: boolean = false;

  public abstract deselect(): void;

  public abstract onMouseDown(position: { x: number; y: number }): void;

  public abstract onMouseMove(position: { x: number; y: number }): void;

  public abstract onMouseUp(position: { x: number; y: number }): void;
}
