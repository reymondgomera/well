import { BadRequestException, ForbiddenException, Injectable, HttpException, HttpStatus, Body, HttpCode, Post } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret} from '../utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async signup(dto: AuthDto) {
        const {email, password} = dto;
        const foundUser = await this.prisma.users.findUnique({where: {email}})

        if(foundUser){
            throw new BadRequestException('Email already exists')
        }
        const hashedPassword = await this.hashPassword(password)

        await this.prisma.users.create({
          // @ts-ignore
          data: {
            email,
            hashedPassword,
            }
        })
        return{message: 'User created sucessfull!'};
    }

    


    async signin(dto : AuthDto, req: Request, res: Response) {
        const {email, password}= dto

        const foundUser = await this.prisma.users.findUnique({where: {email: email}})
        
        if(!foundUser){
           // throw new BadRequestException('SIGNIN.USER_NOT_FOUND!');
            throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        }
        
        const isMatch = await this.comparePasswords({password, hash: foundUser.hashedPassword});
        if (!isMatch){
            throw new BadRequestException('Wrong credentials password!');
        }
        //sign jwt and return to the user
        const token = await this.signToken({id: foundUser.id, email: foundUser.email});
        if (!token) {
            throw new ForbiddenException('Could not Signin')
        }

        res.cookie('token', token, {});

        return res.send({message: 'Logged in successfully'});
    }

    async signout(req: Request, res: Response) {
        res.clearCookie('token');
        return res.send({ message: 'Logged out succesfully!'});
    }

    async hashPassword(password: string) {
      const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password,salt);
    }

    async comparePasswords(args: {password: string, hash:string}){
        return await bcrypt.compare(args.password, args.hash);
    }
    async signToken(args: {id:string, email: string}){
    
    const payload = {
            id: args.id,
            email: args.email,
          };
      
    const token = await this.jwt.signAsync(payload, {
            secret: jwtSecret,
          });
      
          return token;
    }

  
 /*   
    async getUserByEmail(email: string): Promise<User> {
        return this.prisma.user.findUnique({ where: { email } });
      }
    
      async generateResetToken(user: User): Promise<string> {
        const resetToken = crypto.randomBytes(20).toString('hex');
        await this.prisma.user.update({
          where: { id: user.id },
          data:  resetToken ,
        });
        return resetToken;
      }

      async sendResetEmail(email: string, resetToken: string) {
        const resetUrl = `https://example.com/reset-password/${resetToken}`;
        await this.mailerService.sendMail({
          to: email,
          subject: 'Reset your password',
          html: `<p>Click this link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
        });
      }
    */
}



