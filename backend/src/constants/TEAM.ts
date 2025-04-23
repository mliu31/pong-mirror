const TEAM = Object.freeze({
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UNASSIGNED: null
});

export default TEAM;

export type TeamValue = (typeof TEAM)[keyof typeof TEAM];

export const isValidTeam = (value: string | null): value is TeamValue =>
  (Object.values(TEAM) as readonly (string | null)[]).includes(value);
