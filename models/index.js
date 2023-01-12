// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Modality = {
  "GYMNASTICS": "GYMNASTICS",
  "MONOSTRUCTURAL": "MONOSTRUCTURAL",
  "WEIGHTLIFTING": "WEIGHTLIFTING"
};

const ModalityWeighted = {
  "GYMNASTICS": "GYMNASTICS",
  "MONOSTRUCTURAL": "MONOSTRUCTURAL",
  "WEIGHTLIFTINGLIGHT": "WEIGHTLIFTINGLIGHT",
  "WEIGHTLIFTINGMEDIUM": "WEIGHTLIFTINGMEDIUM",
  "WEIGHTLIFTINGHEAVY": "WEIGHTLIFTINGHEAVY"
};

const Group = {
  "SOLO": "SOLO",
  "INPAIRS": "INPAIRS",
  "INTEAMSOF3": "INTEAMSOF3",
  "INTEAMSOF4": "INTEAMSOF4"
};

const Scheme = {
  "SINGLE": "SINGLE",
  "COUPLET": "COUPLET",
  "TRIPLET": "TRIPLET",
  "PLUS4_MOVES": "PLUS4MOVES"
};

const Priority = {
  "TASK": "TASK",
  "TIME": "TIME",
  "WEIGHT": "WEIGHT"
};

const { MoveVariation, Move, Wod, Movement } = initSchema(schema);

export {
  MoveVariation,
  Move,
  Wod,
  Modality,
  ModalityWeighted,
  Group,
  Scheme,
  Priority,
  Movement
};