export const PROCEDURE_PRESETS = [
  // Reactors
  {
    id: 'reactor_1' as const,
    operation: 'REACTOR',
    name: 'Reactor 1',
    color: 'grey',
    category: 'REACTOR',
  },
  {
    id: 'reactor_2' as const,
    operation: 'REACTOR',
    name: 'Reactor 2',
    color: 'grey',
    category: 'REACTOR',
  },
  {
    id: 'reactor_3' as const,
    operation: 'REACTOR',
    name: 'Reactor 3',
    color: 'grey',
    category: 'REACTOR',
  },
  // Sub-procedures
  {
    id: 'dispense_chemicals' as const,
    operation: 'SUB_PROCEDURE',
    name: 'Dispense Chemicals',
    color: 'purple',
    category: 'SUB_PROCEDURE',
  },
  {
    id: 'transfer_liquid' as const,
    operation: 'SUB_PROCEDURE',
    name: 'Transfer Liquid',
    color: 'yellow',
    category: 'SUB_PROCEDURE',
  },
  {
    id: 'liquid_liquid_extraction' as const,
    operation: 'SUB_PROCEDURE',
    name: 'Liquid Liquid Extraction',
    color: 'blue',
    category: 'SUB_PROCEDURE',
  },
  {
    id: 'move_vial' as const,
    operation: 'SUB_PROCEDURE',
    name: 'Move Vial',
    color: 'green',
    category: 'SUB_PROCEDURE',
  },
  {
    id: 'run_reaction' as const,
    operation: 'SUB_PROCEDURE',
    name: 'Run Reaction',
    color: 'red',
    category: 'SUB_PROCEDURE',
  },
];

export type ProcedurePreset = (typeof PROCEDURE_PRESETS)[number];
export type ProcedurePresetId = ProcedurePreset['id'];
