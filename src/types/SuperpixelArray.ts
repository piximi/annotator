export type SuperpixelArray = {
  [pixel: number]: {
    count: number;
    mask: {
      background: number;
      foreground: number;
    };
    mp: [number, number, number];
    role: {
      background: boolean;
      background_and_foreground: boolean;
      foreground: boolean;
      unknown: boolean;
    };
  };
};
