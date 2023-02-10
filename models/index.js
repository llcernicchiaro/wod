// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const WodType = {
  "FORTIME": "FORTIME",
  "AMRAP": "AMRAP",
  "HEAVYDAY": "HEAVYDAY",
  "ONOFF": "ONOFF",
  "EVERYXMIN": "EVERYXMIN",
  "FAMOUS": "FAMOUS",
  "CUSTOM": "CUSTOM"
};

const ModalityWeighted = {
  "GYMNASTICS": "GYMNASTICS",
  "MONOSTRUCTURAL": "MONOSTRUCTURAL",
  "WEIGHTLIFTINGLIGHT": "WEIGHTLIFTINGLIGHT",
  "WEIGHTLIFTINGMEDIUM": "WEIGHTLIFTINGMEDIUM",
  "WEIGHTLIFTINGHEAVY": "WEIGHTLIFTINGHEAVY"
};

const Priority = {
  "TASK": "TASK",
  "TIME": "TIME",
  "WEIGHT": "WEIGHT"
};

const Scheme = {
  "SINGLE": "SINGLE",
  "COUPLET": "COUPLET",
  "TRIPLET": "TRIPLET",
  "PLUS4_MOVES": "PLUS4MOVES"
};

const Group = {
  "SOLO": "SOLO",
  "INPAIRS": "INPAIRS",
  "INTEAMSOF3": "INTEAMSOF3",
  "INTEAMSOF4": "INTEAMSOF4"
};

const Modality = {
  "GYMNASTICS": "GYMNASTICS",
  "MONOSTRUCTURAL": "MONOSTRUCTURAL",
  "WEIGHTLIFTING": "WEIGHTLIFTING"
};

const { WorkoutSession, Wod, MoveVariation, Move, Movement } = initSchema(schema);

export {
  WorkoutSession,
  Wod,
  MoveVariation,
  Move,
  WodType,
  ModalityWeighted,
  Priority,
  Scheme,
  Group,
  Modality,
  Movement
};