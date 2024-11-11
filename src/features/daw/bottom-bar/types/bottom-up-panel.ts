export const BOTTOM_UP_PANELS = [
  'reactor',
  'subProcedure',
  'runProcedure',  // Add this new panel type
] as const

export type BottomUpPanel = (typeof BOTTOM_UP_PANELS)[number]
