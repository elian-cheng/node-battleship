export const validatePlayerAuth = (name: string, password: string): boolean => {
  return name.trim().length > 4 && password.trim().length > 4;
};
