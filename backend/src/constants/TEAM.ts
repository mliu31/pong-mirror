const TEAM = Object.freeze({
  RED: 'RED',
  BLUE: 'BLUE',
  UNASSIGNED: null
});

export default TEAM;

export const isValidTeam = (
  value: string | null
): value is (typeof TEAM)[keyof typeof TEAM] =>
  (Object.values(TEAM) as readonly (string | null)[]).includes(value);
