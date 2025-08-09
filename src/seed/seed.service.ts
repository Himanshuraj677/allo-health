import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ROLES } from '../shared/constants/roles.constant';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    this.logger.log('Running DB seed (if necessary)...');

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@clinic.local';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

    const existing = await this.usersService.findByEmail(adminEmail);
    if (existing) {
      this.logger.log(`Admin user already exists (${adminEmail}), skipping creation.`);
      return;
    }

    await this.usersService.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: ROLES.ADMIN,
    });

    this.logger.log(`Created admin user: ${adminEmail}`);
  }
}
