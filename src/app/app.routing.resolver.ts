import { BdService } from './services/-bd.service';
import { inject } from '@angular/core';

export const databaseResolver = async (): Promise<boolean> => {
  const dbService = inject(BdService);
  return await dbService.initDatabase();
};
