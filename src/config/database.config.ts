import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT') || '3306', 10),
  username: configService.get('DB_USERNAME') || 'root',
  password: configService.get('DB_PASSWORD') || '',
  database: configService.get('DB_NAME') || 'frontdesk',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // dev only; use migrations in production
  logging: false,
});
