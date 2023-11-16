import { DataSource } from 'typeorm';
import { AppDataSource } from './dataSource';
import logger from '../services/logger';
import { UserEntity } from "../entity/UserEntity";
import { hashPassword } from "../utils/utils";

import seedUsers from "./users";

export const initializeDatabase = async (): Promise<void> => {
  logger.info('Connecting MySQL database...')

  await AppDataSource.initialize()
    .then(async () => {
      logger.info('MySQL Database Connection success.')

      await seedDefaultUsers(AppDataSource)
    })
    .catch((error) => {
      /* istanbul ignore next */
      throw error
    })
}

export async function seedDefaultUsers (
  AppDataSource: DataSource): Promise<void> {
  logger.warn('Seeding Users... please wait...')

  const seedData: Omit<UserEntity, 'id'>[] = seedUsers;

  // skip if already seeded by checking size
  // TODO: Is there a better way?
  const alreadySeedSize = await AppDataSource.manager.count(UserEntity)
  if (seedData.length <= alreadySeedSize) {
    logger.info('Merchant Users already seeded. Skipping...')
    return
  }

  const users: UserEntity[] = [];
  for (const item of seedData) {
    const user = new UserEntity()
    user.firstName = item.firstName
    user.lastName = item.lastName
    user.password = await hashPassword(item.password)
    user.email = item.email
    users.push(user);
  }

  await AppDataSource.manager.save(users)
  logger.info('Seeding Users... Done')
}