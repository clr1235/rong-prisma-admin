import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class SharedService {
  /**
   * @description: 生成一个UUID
   * @param {*}
   * @return {*}
   */
  generateUUID(): string {
    return nanoid();
  }
}
