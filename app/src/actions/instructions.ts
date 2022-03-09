
export enum ARSign {
  uTurn = -98,
  leftUTurn = -8,
  keepLeft = -7,
  leaveRoundAbout = -6,
  turnSharpLeft = -3,
  turnLeft = -2,
  turnSlightLeft = -1,
  continue = 0,
  turnSlightRight = 1,
  turnRight = 2,
  turnSharpRight = 3,
  finishInstructionBeforeLastPoint = 4,
  instructionBeforeAViaPoint = 5,
  instructionBeforeEnteringARoundAbout = 6,
  keepRight = 7,
  rightUTurn = 8,
}

export const signIcons: {
  [key in ARSign]?: string;
} = {
  [ARSign.uTurn]: require('../assets/navigation/south.png'),
  [ARSign.leftUTurn]: require('../assets/navigation/u_turn_left.png'),
  [ARSign.turnSharpLeft]: require('../assets/navigation/turn_sharp_left.png'),
  [ARSign.turnLeft]: require('../assets/navigation/turn_left.png'),
  [ARSign.turnSlightLeft]: require('../assets/navigation/turn_slight_left.png'),
  [ARSign.continue]: require('../assets/navigation/straight.png'),
  [ARSign.turnSlightRight]: require('../assets/navigation/turn_slight_right.png'),
  [ARSign.turnRight]: require('../assets/navigation/turn_right.png'),
  [ARSign.turnSharpRight]: require('../assets/navigation/turn_sharp_right.png'),
  [ARSign.rightUTurn]: require('../assets/navigation/u_turn_right.png'),
  [ARSign.keepRight]: require('../assets/navigation/east.png'),
  [ARSign.keepLeft]: require('../assets/navigation/west.png'),
  [ARSign.leaveRoundAbout]: require('../assets/navigation/straight.png'),
  [ARSign.instructionBeforeEnteringARoundAbout]: require('../assets/navigation/roundabout.png'),
  [ARSign.finishInstructionBeforeLastPoint]: require('../assets/navigation/straight.png'),
  [ARSign.instructionBeforeAViaPoint]: require('../assets/navigation/straight.png'),
};

export interface ARInstruction {
  text: string; // A description what the user has to do in order to follow the route. The language depends on the locale parameter.
  street_name: string; // The name of the street to turn onto in order to follow the route.
  distance: number; // The distance for this instruction, in meters.
  interval: number[]; // Two indices into points, referring to the beginning and the end of the segment of the route this instruction refers to.
  time: number; // The duration for this instruction, in milliseconds.
  sign: ARSign; // A number which specifies the sign to show:
  exit_number: number; // Only available for roundabout instructions (sign is 6). The count of exits at which the route leaves the roundabout.
  turn_angle: number; // Only available for roundabout instructions (sign is 6). The radian of the route within the roundabout 0 < r < 2*PI for clockwise and -2*PI < r < 0 for counterclockwise turns.
}
