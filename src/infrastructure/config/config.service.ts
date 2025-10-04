import { ConfigService } from '@nestjs/config';
import { ENVIRONMENTAL_VARIABLES } from '../../constants';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';


type keyUnion = keyof typeof ENVIRONMENTAL_VARIABLES;


@Injectable()
export class ConfigManagerService implements OnApplicationBootstrap {
  constructor(private config: ConfigService) {}


  get(key: keyUnion): string {
    const value = this.config.get(key) as string;
    if (!value) {
      throw new Error(`missing ENV variable ${key}` );
    }


    return value;
  }


  onApplicationBootstrap() {
    for (const key of Object.values(ENVIRONMENTAL_VARIABLES)) {
      if (!this.config.get(key)) {
        throw new Error(`missing ENV variable ${key}` 

);
      }
    }
  }
}
