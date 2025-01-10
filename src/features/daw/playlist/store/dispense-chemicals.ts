import {
    MOVE_ARM_TO_BOTTLE,
    MOVE_BOTTLE_TO_UNSCREW,
    UNSCREW_BOTTLE,
    DISPENSE_TO_VIAL,
    SCREW_BOTTLE,
    MOVE_BOTTLE_TO_ORIGINAL_PLACEMENT,
    MAX_LIQUID_VOLUME_ML,
    PIPETTE_TRANSFER_SIZE_ML,
    TIME_REACH_IN_BOTTLE,
    TIME_PULL_OUT_BOTTLE,
    TIME_FIRST_ML,
    TIME_EACH_ADDITIONAL_ML,
  } from '../constants/robot-constants';
  
  import { Bar } from '../../../../model/bar/bar';
  
  // For the DAW timeline: 30 s = 32 ticks => 1 tick = 0.9375 s
  const SECONDS_PER_TICK = 30 / 32;
  const MIN_TICKS = 32;
  
  /**
   * Splits the total volume into increments of up to 5 mL each.
   * e.g., 11 mL => [5, 5, 1]; 7 => [5, 2]; 3 => [3], etc.
   */
  function getIncrementVolumes(totalVolume: number): number[] {
    const increments: number[] = [];
    let remaining = totalVolume;
    while (remaining > 0) {
      if (remaining >= PIPETTE_TRANSFER_SIZE_ML) {
        increments.push(PIPETTE_TRANSFER_SIZE_ML);
        remaining -= PIPETTE_TRANSFER_SIZE_ML;
      } else {
        increments.push(remaining);
        remaining = 0;
      }
    }
    return increments;
  }
  
  /**
   * How many seconds it takes to collect 'incrementVolume' from the bottle:
   *  - TIME_REACH_IN_BOTTLE (2.5s) lowering pipette in
   *  - TIME_PULL_OUT_BOTTLE (2.5s) raising pipette out
   *  - TIME_FIRST_ML (2s) for the first mL
   *  - TIME_EACH_ADDITIONAL_ML (1s) for each subsequent mL
   */
  function collectLiquidTime(incrementVolume: number): number {
    if (incrementVolume <= 0) return 0;
  
    let time = TIME_REACH_IN_BOTTLE + TIME_PULL_OUT_BOTTLE; // e.g. 2.5 + 2.5 = 5
    if (incrementVolume > 0) {
      time += TIME_FIRST_ML; // +2
    }
  
    const additionalMl = Math.max(incrementVolume - 1, 0);
    time += additionalMl * TIME_EACH_ADDITIONAL_ML; // e.g. 4 extra mL => +4
  
    return time; 
  }
  
  /**
   * Calculates the total time for the entire dispensing process:
   *  - Overhead (open bottle, unscrew, etc.)
   *  - For each increment: collect time + drip time + dispense time
   *  - Overhead (re-screw bottle, move back)
   */
  function calculateLiquidDispenseTimeSec(volumeMl: number, dripTimeSec = 0): number {
    // 1) clamp volume to [0, 25]
    let safeVol = volumeMl < 0 ? 0 : volumeMl;
    if (safeVol > MAX_LIQUID_VOLUME_ML) {
      safeVol = MAX_LIQUID_VOLUME_ML;
    }
  
    // 2) Overhead: open
    const overheadOpen = MOVE_ARM_TO_BOTTLE + MOVE_BOTTLE_TO_UNSCREW + UNSCREW_BOTTLE;
    // Overhead: close
    const overheadClose = SCREW_BOTTLE + MOVE_BOTTLE_TO_ORIGINAL_PLACEMENT;
  
    // 3) Increments of up to 5 mL
    const increments = getIncrementVolumes(safeVol);
  
    let timeForAllIncrements = 0;
    for (const incVol of increments) {
      const collectTime = collectLiquidTime(incVol);
      // dripTime applies ONCE for each increment if user wants a slow drip
      // (Because for each separate dispense, we do a slow drip.)
      const drip = dripTimeSec;
  
      // constant "DISPENSE_TO_VIAL" time to move & dispense that increment
      const dispenseTime = DISPENSE_TO_VIAL;
  
      // Sum them up
      timeForAllIncrements += collectTime + drip + dispenseTime;
    }
  
    // 4) total
    let totalSec = overheadOpen + timeForAllIncrements + overheadClose;
  
    // 5) Enforce min 30 s
    if (totalSec < 30) {
      totalSec = 30;
    }
  
    return totalSec;
  }
  
  /**
   * Convert total seconds → ticks, ensuring at least 32 ticks (30s).
   */
  function convertSecondsToTicks(totalSec: number): number {
    let ticks = totalSec / SECONDS_PER_TICK;
    if (ticks < MIN_TICKS) {
      ticks = MIN_TICKS;
    }
    return ticks;
  }
  
  /**
   * getUpdatedDispenseBar:
   *  - Recompute the durationTicks based on overhead, increments, dripTime
   *  - Clamp volume to [0, 25]
   *  - Store destinationVial if provided
   */
  export function getUpdatedDispenseBar(
    originalBar: Bar,
    chemical: string,
    volume: number,
    dripTime?: number,
    destinationVial?: string
  ): Bar {
    // 1) total time in seconds
    const totalSec = calculateLiquidDispenseTimeSec(volume, dripTime ?? 0);
  
    // 2) convert to ticks
    const newDurationTicks = convertSecondsToTicks(totalSec);
  
    // 3) clamp volume in the Bar
    let safeVolume = volume < 0 ? 0 : volume;
    if (safeVolume > MAX_LIQUID_VOLUME_ML) {
      safeVolume = MAX_LIQUID_VOLUME_ML;
    }
  
    return {
      ...originalBar,
      chemical,
      volume: safeVolume,
      dripTime,         // store for UI reference
      destinationVial,  // store chosen vial
      durationTicks: newDurationTicks,
    };
  }
  