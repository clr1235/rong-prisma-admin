export class ResImageCaptchaDto {
  /* base64图片编码 */
  img: string;

  /* uuid码 */
  uuid: string;

  type: 'svg' | 'base64';
}
