import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Button, TextField, Stack } from '@mui/material';
import { LazyMove, Move, Movement, MoveVariation } from '../models';
import { DataStore, SortDirection } from 'aws-amplify';

type Props = {
  moves: Move[];
  move?: Movement;
  onChangeMove: (
    value: LazyMove | string | string[],
    field: string,
    index: number
  ) => void;
  index: number;
  // isSequence: boolean;
  isHeavyDay: boolean;
  onAddMoreMoves: () => void;
  itsLast: boolean;
};

export const MoveSelect = ({
  move,
  moves,
  onChangeMove,
  index,
  // isSequence,
  isHeavyDay,
  itsLast,
  onAddMoreMoves
}: Props) => {
  const [variationOptions, setVariationOptions] = useState<MoveVariation[]>([]);

  const sequenceArray = useMemo(() => {
    const startingArray = ['', '', '', '', '', '', '', '', '', ''];
    if (move && move.sequence && move.sequence?.length > 0) {
      return startingArray.map((_, i) => move.sequence![i]?.toString() || '');
    }
    return startingArray;
  }, [move]);

  useEffect(() => {
    const getVariants = async () => {
      if (move) {
        const variants = await DataStore.query(
          MoveVariation,
          (m) => m.moveID.eq(move.moveId!),
          {
            sort: (m) => m.name(SortDirection.ASCENDING)
          }
        );
        if (!!variants) setVariationOptions(variants);
      }
    };

    getVariants();
  }, [move]);

  const onChangeSequenceValue = (value: string, i: number) => {
    sequenceArray[i] = value;
    onChangeMove(sequenceArray, 'sequence', index);
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={4} direction="row">
        {!isHeavyDay && (
          <TextField
            variant="standard"
            label="Reps/Distance"
            placeholder="Reps/Distance"
            value={move?.repetitions || ''}
            onChange={(e) => onChangeMove(e.target.value, 'repetitions', index)}
            sx={{ width: 100 }}
          />
        )}
        <Autocomplete
          disableClearable
          getOptionLabel={(option) => option.name || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={
            isHeavyDay
              ? moves.filter((m) => m.modality === 'WEIGHTLIFTING')
              : moves
          }
          sx={{ minWidth: 200 }}
          value={moves.find((m) => m.id === move?.moveId) || null}
          groupBy={(option) => option.modality as string}
          onChange={(_e, newValue) => onChangeMove(newValue!, 'moveId', index)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Movement"
              label="Movement"
            />
          )}
        />
        {variationOptions.length > 0 && (
          <Autocomplete
            disableClearable
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={variationOptions}
            sx={{ minWidth: 200 }}
            value={
              variationOptions.find((v) => v.id === move?.variationId) || null
            }
            onChange={(_e, newValue) =>
              onChangeMove(newValue?.id!, 'variationId', index)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Variant"
                label="Variant"
              />
            )}
          />
        )}
        {move?.modality === 'WEIGHTLIFTING' && !isHeavyDay && (
          <>
            <TextField
              variant="standard"
              type="number"
              placeholder="Men(or General) Weight"
              label="Men(or General) Weight"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
              sx={{ width: 200 }}
              value={move?.menWeight || null}
              onChange={(e) => onChangeMove(e.target.value, 'menWeight', index)}
            />
            <TextField
              variant="standard"
              type="number"
              placeholder="Women Weight"
              label="Women Weight"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
              sx={{ width: 150 }}
              value={move?.womenWeight || null}
              onChange={(e) =>
                onChangeMove(e.target.value, 'womenWeight', index)
              }
            />
          </>
        )}
      </Stack>
      {isHeavyDay && (
        <Stack direction="row" spacing={2}>
          {sequenceArray.map((s, i) => (
            <>
              <TextField
                variant="standard"
                type="number"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ width: 60 }}
                value={s}
                onChange={(e) => onChangeSequenceValue(e.target.value, i)}
                key={i}
              />
              {i < 9 && <span> - </span>}
            </>
          ))}
        </Stack>
      )}
      {itsLast && (
        <Button
          variant="contained"
          onClick={onAddMoreMoves}
          sx={{ width: 160 }}
        >
          Add more moves
        </Button>
      )}
    </Stack>
  );
};
