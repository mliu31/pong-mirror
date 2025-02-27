const TEAM = Object.freeze({
  RED: 'RED',
  BLUE: 'BLUE',
  UNASSIGNED: null
});

export type TeamValue = (typeof TEAM)[keyof typeof TEAM];

export default TEAM;
