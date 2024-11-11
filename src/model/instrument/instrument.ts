// Represents the available types of procedures for the system
export const PROCEDURE_TYPES = [
  'REACTOR',      // Core reactors in the system
  'DISPENSE',     // Dispensing chemicals
  'TRANSFER',     // Transferring liquids
  'EXTRACT',      // Performing liquid-liquid extraction
  'MOVE',         // Moving vials between locations
  'REACT',        // Running a chemical reaction
] as const
