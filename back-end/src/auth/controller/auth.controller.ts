import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUsuarioDto } from '../../usuario/dto/create-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------------------------------------------------------
  // 📝 Registro
  // ------------------------------------------------------
  @Post('register')
  async register(@Body() dto: CreateUsuarioDto) {
    return this.authService.register(dto);
  }

  // ------------------------------------------------------
  // 📧 Verificar cuenta por email
  // ------------------------------------------------------
  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  // ------------------------------------------------------
  // 🔐 Login
  // ------------------------------------------------------
  @Post('login')
  async login(@Body() body: { nombreDeUsuario: string; contrasena: string }) {
    const usuario = await this.authService.validateUser(
      body.nombreDeUsuario,
      body.contrasena,
    );

    if (!usuario)
      throw new HttpException(
        'Usuario o contraseña incorrectos',
        HttpStatus.UNAUTHORIZED,
      );

    // Si no tiene rol → debe elegir
    if (!usuario.rol) {
      return {
        message: 'Debes seleccionar un rol para continuar.',
        needsRoleSelection: true,
        userId: usuario.idUsuario,
      };
    }

    const token = this.authService.generateToken(usuario);

    return {
      message: 'Login exitoso',
      token,
      user: usuario,
    };
  }

  // ------------------------------------------------------
  // 🎭 Asignar rol
  // ------------------------------------------------------
  @Post('asignar-rol')
  async asignarRol(@Body() body: { idUsuario: number; idRol: number }) {
    if (!body.idUsuario || !body.idRol)
      throw new HttpException(
        'idUsuario e idRol son requeridos.',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.authService.asignarRol(
      body.idUsuario,
      body.idRol,
    );

    return {
      message: 'Rol asignado correctamente',
      user,
    };
  }
}
