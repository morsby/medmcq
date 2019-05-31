export const semesterIndices = value => {
  // Hvis value er et semester (>7)
  if (value >= 7) {
    switch (value) {
      case 7:
        return 0;
      case 8:
        return 1;
      case 9:
        return 2;
      case 11:
        return 3;
      default:
        return 0;
    }
  }

  // Hvis vvalue er et index (<7)
  if (value < 7) {
    switch (value) {
      case 0:
        return 7;
      case 1:
        return 8;
      case 2:
        return 9;
      case 3:
        return 11;
      default:
        return 7;
    }
  }
};

export const superUserRoles = ['admin', 'editor'];
