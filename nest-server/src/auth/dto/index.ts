import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ResImageCaptchaDto {
  /* base64图片编码 */
  img: string;

  /* uuid码 */
  uuid: string;

  type: 'svg' | 'base64';
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 30, { message: '用户名长度为4-30位' })
  username: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9_-]{6,30}$/, { message: '密码只能包含字母、数字、下划线、中划线，长度为6-30位' })
  password: string;
  
  captcha: string;

  nickName: string;
  avatar: string;
  email: string;
  phonenumber: string;
  remark: string;
  sex: string;
  status: string;
  // userType: string;
  // deptId: number;
  // dept: SysDept;
}
