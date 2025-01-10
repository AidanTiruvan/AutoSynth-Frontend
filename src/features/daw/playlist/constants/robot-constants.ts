export const MOVE_ARM_TO_BOTTLE = 10;                // Overhead: move arm to bottle
export const MOVE_BOTTLE_TO_UNSCREW = 15;            // Overhead: move bottle up to unscrew
export const UNSCREW_BOTTLE = 10;                    // Overhead: unscrew bottle
export const SCREW_BOTTLE = 10;                      // Overhead: screw bottle back on
export const MOVE_BOTTLE_TO_ORIGINAL_PLACEMENT = 15; // Overhead: move bottle back to original

export const DISPENSE_TO_VIAL = 15;                  // Time to dispense up to 5 mL to vial
export const MAX_LIQUID_VOLUME_ML = 25;              // We clamp max volume at 25 mL
export const PIPETTE_TRANSFER_SIZE_ML = 5;           // Each pipette increment is 5 mL max

export const TIME_REACH_IN_BOTTLE = 2.5;     // Robot lowers pipette into bottle
export const TIME_PULL_OUT_BOTTLE = 2.5;     // Robot raises pipette out of bottle
export const TIME_FIRST_ML = 2;             // Time to aspirate the *first* mL
export const TIME_EACH_ADDITIONAL_ML = 1;   // Time for each additional mL after the first
