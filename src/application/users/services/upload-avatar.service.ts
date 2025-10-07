import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { R2StorageService } from '../../../infrastructure/services/r2-storage.service';

@Injectable()
export class UploadAvatarService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly r2Storage: R2StorageService,
  ) {}

  async execute(userId: string, file: Buffer, filename: string, mimetype: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.avatar) {
      try {
        await this.r2Storage.deleteFile(user.avatar);
      } catch (error) {
        // Ignore deletion errors
      }
    }

    const avatarUrl = await this.r2Storage.uploadFile(file, filename, mimetype, 'avatars');
    
    user.avatar = avatarUrl;
    await this.userRepository.save(user);

    return { avatarUrl };
  }
}
