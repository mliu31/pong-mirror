const TEAM = Object.freeze({
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UNASSIGNED: null
});

export type TeamValue = (typeof TEAM)[keyof typeof TEAM];

export default TEAM;
