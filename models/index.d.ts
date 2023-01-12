import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

export enum Modality {
  GYMNASTICS = "GYMNASTICS",
  MONOSTRUCTURAL = "MONOSTRUCTURAL",
  WEIGHTLIFTING = "WEIGHTLIFTING"
}

export enum ModalityWeighted {
  GYMNASTICS = "GYMNASTICS",
  MONOSTRUCTURAL = "MONOSTRUCTURAL",
  WEIGHTLIFTINGLIGHT = "WEIGHTLIFTINGLIGHT",
  WEIGHTLIFTINGMEDIUM = "WEIGHTLIFTINGMEDIUM",
  WEIGHTLIFTINGHEAVY = "WEIGHTLIFTINGHEAVY"
}

export enum Group {
  SOLO = "SOLO",
  INPAIRS = "INPAIRS",
  INTEAMSOF3 = "INTEAMSOF3",
  INTEAMSOF4 = "INTEAMSOF4"
}

export enum Scheme {
  SINGLE = "SINGLE",
  COUPLET = "COUPLET",
  TRIPLET = "TRIPLET",
  PLUS4_MOVES = "PLUS4MOVES"
}

export enum Priority {
  TASK = "TASK",
  TIME = "TIME",
  WEIGHT = "WEIGHT"
}

type EagerMovement = {
  readonly repetitions?: string | null;
  readonly weight?: string | null;
  readonly modality?: ModalityWeighted | keyof typeof ModalityWeighted | null;
  readonly time?: string | null;
}

type LazyMovement = {
  readonly repetitions?: string | null;
  readonly weight?: string | null;
  readonly modality?: ModalityWeighted | keyof typeof ModalityWeighted | null;
  readonly time?: string | null;
}

export declare type Movement = LazyLoading extends LazyLoadingDisabled ? EagerMovement : LazyMovement

export declare const Movement: (new (init: ModelInit<Movement>) => Movement)

type EagerMoveVariation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MoveVariation, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly moveID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMoveVariation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MoveVariation, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly moveID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MoveVariation = LazyLoading extends LazyLoadingDisabled ? EagerMoveVariation : LazyMoveVariation

export declare const MoveVariation: (new (init: ModelInit<MoveVariation>) => MoveVariation) & {
  copyOf(source: MoveVariation, mutator: (draft: MutableModel<MoveVariation>) => MutableModel<MoveVariation> | void): MoveVariation;
}

type EagerMove = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Move, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly variation?: string | null;
  readonly video?: string | null;
  readonly modality?: Modality | keyof typeof Modality | null;
  readonly MoveVariations?: (MoveVariation | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMove = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Move, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly variation?: string | null;
  readonly video?: string | null;
  readonly modality?: Modality | keyof typeof Modality | null;
  readonly MoveVariations: AsyncCollection<MoveVariation>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Move = LazyLoading extends LazyLoadingDisabled ? EagerMove : LazyMove

export declare const Move: (new (init: ModelInit<Move>) => Move) & {
  copyOf(source: Move, mutator: (draft: MutableModel<Move>) => MutableModel<Move> | void): Move;
}

type EagerWod = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Wod, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly date?: string | null;
  readonly movements?: (Movement | null)[] | null;
  readonly time?: string | null;
  readonly modalities?: (ModalityWeighted | null)[] | keyof typeof ModalityWeighted | null;
  readonly totalReps?: number | null;
  readonly priority?: Priority | keyof typeof Priority | null;
  readonly scheme?: Scheme | keyof typeof Scheme | null;
  readonly group?: Group | keyof typeof Group | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWod = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Wod, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly date?: string | null;
  readonly movements?: (Movement | null)[] | null;
  readonly time?: string | null;
  readonly modalities?: (ModalityWeighted | null)[] | keyof typeof ModalityWeighted | null;
  readonly totalReps?: number | null;
  readonly priority?: Priority | keyof typeof Priority | null;
  readonly scheme?: Scheme | keyof typeof Scheme | null;
  readonly group?: Group | keyof typeof Group | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Wod = LazyLoading extends LazyLoadingDisabled ? EagerWod : LazyWod

export declare const Wod: (new (init: ModelInit<Wod>) => Wod) & {
  copyOf(source: Wod, mutator: (draft: MutableModel<Wod>) => MutableModel<Wod> | void): Wod;
}